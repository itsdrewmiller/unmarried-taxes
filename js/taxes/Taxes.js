function Taxes() {
    var self = this;
    self.federalBrackets = [
        { rate: 0.1, singleBottom: 0, singleTop: 9275, hohBottom: 0, hohTop: 13250, marriedBottom: 0, marriedTop: 18550 },
        { rate: 0.15, singleBottom: 9275, singleTop: 37650, hohBottom: 13250, hohTop: 50400, marriedBottom: 18550, marriedTop: 75300 },
        { rate: 0.25, singleBottom: 37650, singleTop: 91150, hohBottom: 50400, hohTop: 130150, marriedBottom: 75300, marriedTop: 151900 },
        { rate: 0.28, singleBottom: 91150, singleTop: 190150, hohBottom: 130150, hohTop: 210800, marriedBottom: 151900, marriedTop: 231450 },
        { rate: 0.33, singleBottom: 190150, singleTop: 413350, hohBottom: 210800, hohTop: 413350, marriedBottom: 231450, marriedTop: 413350 },
        { rate: 0.35, singleBottom: 413350, singleTop: 415050, hohBottom: 413350, hohTop: 441000, marriedBottom: 413350, marriedTop: 466950 },
        { rate: 0.396, singleBottom: 415050, singleTop: Infinity, hohBottom: 441000, hohTop: Infinity, marriedBottom: 466950, marriedTop: Infinity }];
    self.standardDeduction = { single: 6300, headOfHousehold: 9300, married: 12600 };
    self.exemption = 4050;

    // PEP
    self.exemptionPhaseout = { 
        start: { single: 259400, headOfHousehold: 285350, married: 311300},
        increment: 2500,
        perIncrement: 0.02
    };

    // Pease
    self.deductionPhaseout = { 
        start: { single: 259400, headOfHousehold: 285350, married: 311300},
        totalPercentage: 0.2,
        diffPercentage: 0.03
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
    self.amtHighRateStart = 186300;

    self.amtExemption = { single: 53900, married: 83800};

    self.amtPhaseOutStart = { single: 119700, married: 159700 };
    self.amtPhaseOutRate = 0.25;

    self.socialSecurityRate = 0.062;
    self.socialSecurityCap  = 118500;
    self.medicareRate = 0.0145;
    self.medicareAdditionalRate = 0.009;
    self.medicareAdditionalStart = { single: 200000, headOfHousehold: 200000, married: 250000};
    // no change 2016

    self.longTermCapitalGains = {
        levels: [0.15, 0.396, Infinity],
        rates: [0, 0.15, 0.20]
    };

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
    // not updated for 2016 yet
} 