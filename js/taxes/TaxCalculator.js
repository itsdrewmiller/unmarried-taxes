(function () {

    var taxCalculator = function () {

        var self = this;

        self.isHeadOfHousehold = function (income, totalMortgageInterest, totalPropertyTax, totalMortgageInsurance) {
            if (income.numDependents < 1) { return false; }
            if (income.mortgageInterest + income.propertyTax + income.mortgageInsurance <= 0.5 * (totalMortgageInterest + totalPropertyTax + totalMortgageInsurance)) { return false; }
            return true;
        };

        self.calculateFederalAgi = function (income) {
            return income.wageIncome + income.qualifiedDividends + income.ordinaryDividends + income.shortTermCapitalGains + income.longTermCapitalGains - (income.numDependents > 0 ? income.dependentCareFsa : 0);
        };

        self.calculateMortgageInsuranceDeduction = function (taxes, income) {
            var mortgageInsuranceOverage = self.calculateFederalAgi(income) - taxes.MortgageInsurancePhaseOutStart;
            var mortgageInsuranceDeductionRatio = 1;
            if (mortgageInsuranceOverage > 0) {
                var incrementsOver = Math.ceil(mortgageInsuranceOverage / taxes.MortgageInsurancePhaseOutIncrement);
                mortgageInsuranceDeductionRatio -= Math.min(incrementsOver * taxes.MortgageInsurancePhaseOutPerIncrement, 1);
            }
            return mortgageInsuranceDeductionRatio * income.mortgageInsurance;
        };

        self.calculateChildAndDependentCareCredit = function (taxes, income) {
            var childCareOverage = self.calculateFederalAgi(income) - taxes.childAndDependentCarePhaseOutStart;
            var childCareEligibleExpenses = Math.min(taxes.childAndDependentCareMaxExpenses, income.numDependents * taxes.childAndDependentCareExpensesPerDependent, income.childCare) - (income.numDependents > 0 ? income.dependentCareFsa : 0);
            var childCareCredit = 0;

            if (childCareEligibleExpenses > 0) {
                var incrementsOver = Math.ceil(childCareOverage / taxes.childAndDependentCarePhaseOutIncrement);
                var childCareCreditRatio = Math.min(taxes.childAndDependentCareMaxRatio, Math.max(taxes.childAndDependentCareMaxRatio - incrementsOver * taxes.childAndDependentCarePhaseOutPerIncrement, taxes.childAndDependentCareMinRatio));
                childCareCredit = childCareEligibleExpenses * childCareCreditRatio;
            }

            return childCareCredit;

        };


        self.calculateRegularTax = function (taxes, income) {

            var mortgageInsuranceDeduction = self.calculateMortgageInsuranceDeduction(taxes, income);
            var childAndDependentCareCredit = self.calculateChildAndDependentCareCredit(taxes, income);

            var deductions = income.mortgageInterest + income.charity + income.stateTaxWithheld + income.previousStateTaxPayment + income.propertyTax + mortgageInsuranceDeduction;
            var standardDeduction = 0;
            var exemptions = (1 + income.numDependents);

            switch (income.type) {
                case 'single':
                    standardDeduction = taxes.standardDeduction.single;
                    break;
                case 'married':
                    standardDeduction = taxes.standardDeduction.married;
                    exemptions += 1;
                    break;
                case 'hoh':
                    standardDeduction = taxes.standardDeduction.headOfHousehold;
                    break;
                default:
                    throw 'Invalid income type';
            }

            if (deductions < standardDeduction) {
                deductions = standardDeduction;
            }

            var taxableIncome = income.wageIncome + income.interest + income.shortTermCapitalGains + income.ordinaryDividends -
                                deductions - exemptions * taxes.Exemption - (income.numDependents > 0 ? income.dependentCareFsa : 0);


            var taxesOwed = 0;
            var bracket = null;
            var bottom = 0;
            var top = 0;
            var bracketIndex = 0;
            var taxableInBracket = 0;
            var highestRate = 0;

            for (bracketIndex = 0; bracketIndex < taxes.TaxBrackets.length; bracketIndex++) {

                bracket = taxes.TaxBrackets[bracketIndex];
                switch (income.type) {
                    case 'single':
                        bottom = bracket.singleBottom;
                        top = bracket.singleTop;
                        break;
                    case 'hoh':
                        bottom = bracket.hohBottom;
                        top = bracket.hohTop;
                        break;
                    case 'married':
                        bottom = bracket.marriedBottom;
                        top = bracket.marriedTop;
                        break;
                    default:
                        throw 'Invalid income type';
                }

                if (taxableIncome > bottom) {

                    if (bracket.rate > highestRate) { highestRate = bracket.rate; }

                    taxableInBracket = taxableIncome - bottom;
                    if (top !== Infinity && top - bottom < taxableIncome - bottom) {
                        taxableInBracket = top - bottom;
                    }

                    taxesOwed = taxesOwed + bracket.rate * taxableInBracket;

                }

            }

            var longTermCapitalGainsTax = 0;

            if (highestRate > taxes.LongTermCapitalGainsMaximumExemptRate) {
                longTermCapitalGainsTax = taxes.LongTermCapitalGainsRate * income.longTermCapitalGains;
            }

            taxesOwed = taxesOwed + longTermCapitalGainsTax + taxes.QualifiedDividendsRate * income.qualifiedDividends - childAndDependentCareCredit;



            return parseFloat(accounting.toFixed(taxesOwed, 2));
        };

        self.calculateAmt = function (taxes, income) {

            var taxableIncome = income.wageIncome + income.interest + income.shortTermCapitalGains + income.ordinaryDividends -
                                income.mortgageInterest - income.charity - (income.numDependents > 0 ? income.dependentCareFsa : 0);

            var phaseoutEligibleIncome = taxableIncome + income.longTermCapitalGains + income.qualifiedDividends;

            var exemption = taxes.AmtExemption.single;
            var phaseOutStart = taxes.AmtPhaseOutStart.single;

            if (income.type === 'married') {
                exemption = taxes.AmtExemption.married;
                phaseOutStart = taxes.AmtPhaseOutStart.married;
            }

            var amtOwed = 0;

            if (phaseoutEligibleIncome > phaseOutStart) {
                exemption = Math.max(0, exemption - taxes.AmtPhaseOutRate * (phaseoutEligibleIncome - phaseOutStart));
            }

            taxableIncome = taxableIncome - exemption;

            if (taxableIncome > taxes.AmtHighRateStart) {
                amtOwed = taxes.AmtHighRateStart * taxes.AmtLowRate + (taxableIncome - taxes.AmtHighRateStart) * taxes.AmtHighRate;
            } else {
                amtOwed = taxableIncome * taxes.AmtLowRate;
            }

            return Math.max(0, parseFloat(accounting.toFixed(amtOwed, 2)));
        };

        self.calculateFederalIncomeTax = function (taxes, income) {
            return Math.max(this.calculateAmt(taxes, income), this.calculateRegularTax(taxes, income));
        };

        self.calculateOverallTax = function (taxes, income) {
            return self.calculateFederalIncomeTax(taxes, income) + self.calculateMaTax(taxes, income) + self.calculatePayrollTax(taxes, income);
        };

        self.calculateMaTax = function (taxes, income) {

            var taxableIncome = income.wageIncome + income.maInterest - (income.numDependents > 0 ? income.dependentCareFsa : 0);

            var exemption = 0;
            var interestDeductionCap = 0;

            switch (income.type) {
                case 'single':
                    exemption = taxes.MaExemption.single;
                    interestDeductionCap = taxes.MaInterestDeductionCap.single;
                    break;
                case 'hoh':
                    exemption = taxes.MaExemption.hoh;
                    interestDeductionCap = taxes.MaInterestDeductionCap.single;
                    break;
                case 'married':
                    exemption = taxes.MaExemption.married;
                    interestDeductionCap = taxes.MaInterestDeductionCap.married;
                    break;
                default:
                    throw 'Invalid type';
            }

            exemption += taxes.MaDependentExemption * income.numDependents;
            exemption += Math.min(income.maInterest, interestDeductionCap);

            taxableIncome = taxableIncome - exemption;

            var payrollDeduction = Math.min(self.calculatePayrollTax(taxes, income), 2000);
            var numDependents = Math.min(taxes.MaMaximumDependents, income.numDependents);
            var dependentDeduction = taxes.MaPerChildMinimumDeduction * numDependents;
            if (income.childCare - income.dependentCareFsa > dependentDeduction) {
                dependentDeduction = Math.min(taxes.MaPerChildMaximumDeduction * numDependents, income.childCare - (income.numDependents > 0 ? income.dependentCareFsa : 0));
            }

            var rentalDeduction = Math.min(taxes.MaMaximumRentalDeduction, income.rent / 2);

            var studentLoanDeduction = income.undergraduateStudentLoanInterest;

            var commuterDeduction = Math.max(0, Math.min(income.commute - taxes.MaCommuterDeductionThreshold, taxes.MaMaximumCommuterDeduction));

            taxableIncome = Math.max(0, taxableIncome - payrollDeduction - dependentDeduction - rentalDeduction - studentLoanDeduction - commuterDeduction);
            taxableIncome += income.outOfStateInterest;

            var maTax = taxes.MaRate * taxableIncome;
            maTax += taxes.MaShortTermCapitalGainsRate * income.shortTermCapitalGains + taxes.MaLongTermCapitalGainsRate * income.longTermCapitalGains;

            return parseFloat(accounting.toFixed(maTax, 2));
        };

        self.calculatePayrollTax = function (taxes, income) {


            var additionalMedicareStart = Infinity;
            switch(income.type) {
                case 'single':
                    additionalMedicareStart = taxes.MedicareAdditionalStart.single;
                    break;
                case 'married':
                    additionalMedicareStart = taxes.MedicareAdditionalStart.married;
                    break;
                case 'hoh':
                    additionalMedicareStart = taxes.MedicareAdditionalStart.headOfHousehold;
                    break;
                default:
                    throw 'Invalid income type';
            }

            var taxableIncome = income.wageIncome - income.dependentCareFsa;
            var payrollTax = Math.min(taxableIncome * taxes.SocialSecurityRate, taxes.SocialSecurityCap * taxes.SocialSecurityRate);
            payrollTax += taxableIncome * taxes.MedicareRate + Math.max(0, (taxableIncome - additionalMedicareStart) * taxes.MedicareAdditionalRate);

            return parseFloat(accounting.toFixed(payrollTax, 2));
        };
    };

    // "this" is the global scope
    this.taxCalculator = new taxCalculator();

})();