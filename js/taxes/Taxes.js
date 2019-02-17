function Taxes() {
    var self = this;
    self.federalBrackets = [
        { rate: 0.1, singleBottom: 0, singleTop: 9525, hohBottom: 0, hohTop: 13600, marriedBottom: 0, marriedTop: 19050 },
        { rate: 0.12, singleBottom: 9525, singleTop: 38700, hohBottom: 13600, hohTop: 51800, marriedBottom: 19050, marriedTop: 77400 },
        { rate: 0.22, singleBottom: 38700, singleTop: 82500, hohBottom: 51800, hohTop: 82500, marriedBottom: 77400, marriedTop: 165000 },
        { rate: 0.24, singleBottom: 82500, singleTop: 157500, hohBottom: 82500, hohTop: 157500, marriedBottom: 165000, marriedTop: 315000 },
        { rate: 0.32, singleBottom: 157500, singleTop: 200000, hohBottom: 157500, hohTop: 200000, marriedBottom: 315000, marriedTop: 400000 },
        { rate: 0.35, singleBottom: 200000, singleTop: 500000, hohBottom: 200000, hohTop: 500000, marriedBottom: 400000, marriedTop: 600000 },
        { rate: 0.37, singleBottom: 500000, singleTop: Infinity, hohBottom: 500000, hohTop: Infinity, marriedBottom: 600000, marriedTop: Infinity }];
    self.standardDeduction = { single: 12000, headOfHousehold: 18000, married: 24000 };

    self.mortgageInsurancePhaseOut = {
        start: 100000,
        increment: 1000,
        perIncrement: 0.1
    }; // no change 2016

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
    self.amtHighRateStart = 191100;

    self.amtExemption = { single: 70300, married: 109400};

    self.amtPhaseOutStart = { single: 500000, married: 1000000 };
    self.amtPhaseOutRate = 0.25;

    self.socialSecurityRate = 0.062;
    self.socialSecurityCap  = 127200;
    self.medicareRate = 0.0145;
    self.medicareAdditionalRate = 0.009;
    self.medicareAdditionalStart = { single: 200000, headOfHousehold: 200000, married: 250000};
 
    // TODO refactor, no longer matches up to income tax brackets
    self.longTermCapitalGains = {
        levels: [0.15, 0.396, Infinity],
        rates: [0, 0.15, 0.20]
    };

    // TODO Child Tax Credit (200k-240k threshold now)

    // TODO net investment income tax

    self.stateAndLocalDeductionCap = 10000;

    self.ma = {
        rate: 0.051,
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
        longTermCapitalGainsRate: 0.051
    };

    // Let's figure this out after manually filing once
    self.md = {

    }
} 