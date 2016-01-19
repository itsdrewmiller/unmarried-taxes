function Taxes() {
    var self = this;
    self.federalBrackets = [
        { rate: 0.1, singleBottom: 0, singleTop: 9225, hohBottom: 0, hohTop: 13150, marriedBottom: 0, marriedTop: 18450 },
        { rate: 0.15, singleBottom: 9225, singleTop: 37450, hohBottom: 13150, hohTop: 50200, marriedBottom: 18450, marriedTop: 74900 },
        { rate: 0.25, singleBottom: 37450, singleTop: 90750, hohBottom: 50200, hohTop: 129600, marriedBottom: 74900, marriedTop: 151200 },
        { rate: 0.28, singleBottom: 90750, singleTop: 189300, hohBottom: 129600, hohTop: 209850, marriedBottom: 151200, marriedTop: 230450 },
        { rate: 0.33, singleBottom: 189300, singleTop: 411500, hohBottom: 209850, hohTop: 411500, marriedBottom: 230450, marriedTop: 411500 },
        { rate: 0.35, singleBottom: 411500, singleTop: 413200, hohBottom: 411500, hohTop: 439000, marriedBottom: 411500, marriedTop: 464850 },
        { rate: 0.396, singleBottom: 413200, singleTop: Infinity, hohBottom: 439000, hohTop: Infinity, marriedBottom: 464850, marriedTop: Infinity }];
    self.standardDeduction = { single: 6300, headOfHousehold: 9250, married: 12600 };
    self.exemption = 4000;
    self.exemptionPhaseout = { 
        start: { single: 258250, headOfHousehold: 284050, married: 309900},
        increment: 2500,
        perIncrement: 0.02
    };

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
    }; // no change 2016

    self.amtLowRate = 0.26;
    self.amtHighRate = 0.28;
    self.amtHighRateStart = 185400;

    self.amtExemption = { single: 53600, married: 83400};

    self.amtPhaseOutStart = { single: 119200, married: 158900 };
    self.amtPhaseOutRate = 0.25;

    self.socialSecurityRate = 0.062;
    self.socialSecurityCap  = 118500;
    self.medicareRate = 0.0145;
    self.medicareAdditionalRate = 0.009;
    self.medicareAdditionalStart = { single: 200000, headOfHousehold: 200000, married: 250000};

    self.longTermCapitalGains = {
        levels: [0.15, 0.396, Infinity],
        rates: [0, 0.15, 0.20]
    }

    self.ma = {
        rate: 0.0515,
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
        longTermCapitalGainsRate: 0.0515
    };
} 