var taxCalculator = {
    isHeadOfHousehold: function (income, totalMortgageInterest, totalPropertyTax, totalMortgageInsurance, totalOtherHousehold) {
        if (income.numDependents < 1) { return false; }
        
        totalMortgageInsurance = totalMortgageInsurance || 0;
        totalPropertyTax = totalPropertyTax || 0;
        totalMortgageInsurance = totalMortgageInsurance || 0;
        totalOtherHousehold = totalOtherHousehold || 0;
        
        if (income.mortgageInterest + income.propertyTax + income.mortgageInsurance + income.otherHousehold <= 0.5 * (totalMortgageInterest + totalPropertyTax + totalMortgageInsurance + totalOtherHousehold)) { return false; }
        return true;
    },
    calculateFederalAgi: function (income) {
        return income.wageIncome + income.qualifiedDividends + income.ordinaryDividends + income.shortTermCapitalGains + income.longTermCapitalGains - (income.numDependents > 0 ? income.dependentCareFsa : 0);
    },
    calculateMortgageInsuranceDeduction: function (taxes, income) {
        var mortgageInsuranceOverage = this.calculateFederalAgi(income) - taxes.mortgageInsurancePhaseOut.start;
        var mortgageInsuranceDeductionRatio = 1;
        if (mortgageInsuranceOverage > 0) {
            var incrementsOver = Math.ceil(mortgageInsuranceOverage / taxes.mortgageInsurancePhaseOut.increment);
            mortgageInsuranceDeductionRatio -= Math.min(incrementsOver * taxes.mortgageInsurancePhaseOut.perIncrement, 1);
        }
        return mortgageInsuranceDeductionRatio * income.mortgageInsurance;
    },
    calculateChildAndDependentCareCredit: function (taxes, income) {
        var childCareOverage = this.calculateFederalAgi(income) - taxes.childAndDependentCare.phaseOut.start;
        var childCareEligibleExpenses = Math.min(taxes.childAndDependentCare.maxExpenses, income.numDependents * taxes.childAndDependentCare.expensesPerDependent, income.childCare) - (income.numDependents > 0 ? income.dependentCareFsa : 0);
        var childCareCredit = 0;

        if (childCareEligibleExpenses > 0) {
            var incrementsOver = Math.ceil(childCareOverage / taxes.childAndDependentCare.phaseOut.increment);
            var childCareCreditRatio = Math.min(taxes.childAndDependentCare.maxRatio, Math.max(taxes.childAndDependentCare.maxRatio - incrementsOver * taxes.childAndDependentCare.phaseOut.perIncrement, taxes.childAndDependentCare.minRatio));
            childCareCredit = childCareEligibleExpenses * childCareCreditRatio;
        }

        return childCareCredit;

    },
    calculateRegularTax: function (taxes, income) {

        var agi = this.calculateFederalAgi(income);

        var mortgageInsuranceDeduction = this.calculateMortgageInsuranceDeduction(taxes, income);
        var childAndDependentCareCredit = this.calculateChildAndDependentCareCredit(taxes, income);

        var standardDeduction = 0;

        switch (income.type) {
            case 'single':
                standardDeduction = taxes.standardDeduction.single;
                break;
            case 'married':
                standardDeduction = taxes.standardDeduction.married;
                break;
            case 'hoh':
                standardDeduction = taxes.standardDeduction.headOfHousehold;
                break;
            default:
                throw 'Invalid income type';
        }

        var deductions = income.mortgageInterest + income.charity + Math.min(taxes.stateAndLocalDeductionCap, income.stateTaxWithheld + income.previousStateTaxPayment + income.propertyTax) + mortgageInsuranceDeduction;

        if (deductions < standardDeduction) {
            deductions = standardDeduction;
        }

        var taxableIncome = income.wageIncome + income.interest + income.shortTermCapitalGains + income.ordinaryDividends -
                            deductions - (income.numDependents > 0 ? income.dependentCareFsa : 0);

        var taxesOwed = 0;
        var bracket = null;
        var bottom = 0;
        var top = 0;
        var bracketIndex = 0;
        var taxableInBracket = 0;
        var highestRate = 0;

        for (bracketIndex = 0; bracketIndex < taxes.federalBrackets.length; bracketIndex++) {

            bracket = taxes.federalBrackets[bracketIndex];
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


        // figure out which long term rate to apply
        var level = 0;
        while (taxes.longTermCapitalGains.levels[level] < highestRate) {
            level++;
        }
        var ltcgRate = taxes.longTermCapitalGains.rates[level];

        taxesOwed = taxesOwed + ltcgRate * (income.longTermCapitalGains + income.qualifiedDividends) - childAndDependentCareCredit;

        return parseFloat(accounting.toFixed(taxesOwed, 2));
    },
    calculateAmt: function (taxes, income) {

        var taxableIncome = income.wageIncome + income.interest + income.shortTermCapitalGains + income.ordinaryDividends -
                            income.mortgageInterest - income.charity - (income.numDependents > 0 ? income.dependentCareFsa : 0);

        var phaseoutEligibleIncome = taxableIncome + income.longTermCapitalGains + income.qualifiedDividends;

        var exemption = taxes.amtExemption.single;
        var phaseOutStart = taxes.amtPhaseOutStart.single;

        if (income.type === 'married') {
            exemption = taxes.amtExemption.married;
            phaseOutStart = taxes.amtPhaseOutStart.married;
        }

        var amtOwed = 0;

        if (phaseoutEligibleIncome > phaseOutStart) {
            exemption = Math.max(0, exemption - taxes.amtPhaseOutRate * (phaseoutEligibleIncome - phaseOutStart));
        }

        taxableIncome = taxableIncome - exemption;

        if (taxableIncome > taxes.amtHighRateStart) {
            amtOwed = taxes.amtHighRateStart * taxes.amtLowRate + (taxableIncome - taxes.amtHighRateStart) * taxes.amtHighRate;
        } else {
            amtOwed = taxableIncome * taxes.amtLowRate;
        }

        return Math.max(0, parseFloat(accounting.toFixed(amtOwed, 2)));
    },
    calculateFederalIncomeTax: function (taxes, income) {
        return Math.max(this.calculateAmt(taxes, income), this.calculateRegularTax(taxes, income));
    },
    calculateOverallTax: function (taxes, income) {
        return this.calculateFederalIncomeTax(taxes, income) + this.calculateMaTax(taxes, income) + this.calculatePayrollTax(taxes, income);
    },
    calculateMaTax: function (taxes, income) {

        var taxableIncome = income.wageIncome + income.maInterest - (income.numDependents > 0 ? income.dependentCareFsa : 0);

        var exemption = 0;
        var interestDeductionCap = 0;

        switch (income.type) {
            case 'single':
                exemption = taxes.ma.exemption.single;
                interestDeductionCap = taxes.ma.interestDeductionCap.single;
                break;
            case 'hoh':
                exemption = taxes.ma.exemption.hoh;
                interestDeductionCap = taxes.ma.interestDeductionCap.single;
                break;
            case 'married':
                exemption = taxes.ma.exemption.married;
                interestDeductionCap = taxes.ma.interestDeductionCap.married;
                break;
            default:
                throw 'Invalid type';
        }

        exemption += taxes.ma.dependentExemption * income.numDependents;
        exemption += Math.min(income.maInterest, interestDeductionCap);

        taxableIncome = taxableIncome - exemption;

        var payrollDeduction = Math.min(this.calculatePayrollTax(taxes, income), 2000);
        var numDependents = Math.min(taxes.ma.maximumDependents, income.numDependents);
        var dependentDeduction = taxes.ma.perChildMinimumDeduction * numDependents;
        if (income.childCare - income.dependentCareFsa > dependentDeduction) {
            dependentDeduction = Math.min(taxes.ma.perChildMaximumDeduction * numDependents, income.childCare - (income.numDependents > 0 ? income.dependentCareFsa : 0));
        }

        var rentalDeduction = Math.min(taxes.ma.maximumRentalDeduction, income.rent / 2);

        var studentLoanDeduction = income.undergraduateStudentLoanInterest;

        var commuterDeduction = Math.max(0, Math.min(income.commute - taxes.ma.commuterDeductionThreshold, taxes.ma.maximumCommuterDeduction));

        taxableIncome = Math.max(0, taxableIncome - payrollDeduction - dependentDeduction - rentalDeduction - studentLoanDeduction - commuterDeduction);
        taxableIncome += income.outOfStateInterest;

        var maTax = taxes.ma.rate * taxableIncome;
        maTax += taxes.ma.shortTermCapitalGainsRate * income.shortTermCapitalGains + taxes.ma.longTermCapitalGainsRate * income.longTermCapitalGains;

        return parseFloat(accounting.toFixed(maTax, 2));
    },
    calculatePayrollTax: function (taxes, income) {


        var additionalMedicareStart = Infinity;
        switch(income.type) {
            case 'single':
                additionalMedicareStart = taxes.medicareAdditionalStart.single;
                break;
            case 'married':
                additionalMedicareStart = taxes.medicareAdditionalStart.married;
                break;
            case 'hoh':
                additionalMedicareStart = taxes.medicareAdditionalStart.headOfHousehold;
                break;
            default:
                throw 'Invalid income type';
        }

        var taxableIncome = income.wageIncome - income.dependentCareFsa;
        var payrollTax = Math.min(taxableIncome * taxes.socialSecurityRate, taxes.socialSecurityCap * taxes.socialSecurityRate);
        payrollTax += taxableIncome * taxes.medicareRate + Math.max(0, (taxableIncome - additionalMedicareStart) * taxes.medicareAdditionalRate);

        return parseFloat(accounting.toFixed(payrollTax, 2));
    }
};

if (typeof module !== 'undefined') { 
    module.exports = taxCalculator; 
}
