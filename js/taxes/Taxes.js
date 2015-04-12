function Taxes() {
    var self = this;
    self.federalBrackets = [
        { rate: 0.1, singleBottom: 0, singleTop: 9075, hohBottom: 0, hohTop: 12950, marriedBottom: 0, marriedTop: 18150 },
        { rate: 0.15, singleBottom: 9075, singleTop: 36900, hohBottom: 12950, hohTop: 49400, marriedBottom: 18150, marriedTop: 73800 },
        { rate: 0.25, singleBottom: 36900, singleTop: 89350, hohBottom: 49400, hohTop: 127550, marriedBottom: 73800, marriedTop: 148850 },
        { rate: 0.28, singleBottom: 89350, singleTop: 186350, hohBottom: 127550, hohTop: 206600, marriedBottom: 148850, marriedTop: 226850 },
        { rate: 0.33, singleBottom: 186350, singleTop: 405100, hohBottom: 206600, hohTop: 405100, marriedBottom: 226850, marriedTop: 405100 },
        { rate: 0.35, singleBottom: 405100, singleTop: 406750, hohBottom: 405100, hohTop: 432200, marriedBottom: 405100, marriedTop: 457600 },
        { rate: 0.396, singleBottom: 406750, singleTop: Infinity, hohBottom: 432200, hohTop: Infinity, marriedBottom: 457600, marriedTop: Infinity }];
    self.standardDeduction = { single: 6200, headOfHousehold: 9100, married: 12400 };
    self.exemption = 3950;

    self.mortgageInsurancePhaseOut = {
        start: 100000,
        increment: 1000,
        perIncrement: 0.1
    };

    self.childAndDependentCare = { 
        maxRatio: 0.35,
        minRatio: 0.2,
        phaseOut: {
            start: 15000,
            increment: 2000,
            perIncrement: 0.01
        },
        expensesPerDependent: 3000,
        maxExpenses: 6000
    };

    self.amtLowRate = 0.26;
    self.amtHighRate = 0.28;
    self.amtHighRateStart = 182500;

    self.amtExemption = { single: 52800, married: 82100};

    self.amtPhaseOutStart = { single: 117300, married: 156500 };
    self.amtPhaseOutRate = 0.25;

    self.socialSecurityRate = 0.062;
    self.socialSecurityCap  = 117000;
    self.medicareRate = 0.0145;
    self.medicareAdditionalRate = 0.009;
    self.medicareAdditionalStart = { single: 200000, headOfHousehold: 200000, married: 250000};

    self.longTermCapitalGainsMaximumExemptRate = 0.15;
    self.longTermCapitalGainsRate = 0.15;

    self.qualifiedDividendsRate = 0.15;

    self.ma = {
        rate: 0.053,
        exemption: { single: 4400, hoh: 6800, married: 8800 },
        dependentExemption: 1000,
        interestDeductionCap: { single: 100, married: 200 },
        payrollMaximumDeduction: 2000,
        perChildMinimumDeduction: 3600,
        perChildMaximumDeduction: 4800,
        maximumDependents: 2,
        maximumRentalDeduction: 3000,
        commuterDeductionThreshold: 150,
        maximumCommuterDeduction: 750,
        shortTermCapitalGainsRate: 0.12,
        longTermCapitalGainsRate: 0.053
    };
} 