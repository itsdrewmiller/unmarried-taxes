function Taxes() {
    var self = this;
    self.federalBrackets = [
        { rate: 0.1, singleBottom: 0, singleTop: 9325, hohBottom: 0, hohTop: 13350, marriedBottom: 0, marriedTop: 18650 },
        { rate: 0.15, singleBottom: 9325, singleTop: 37950, hohBottom: 13350, hohTop: 50800, marriedBottom: 18650, marriedTop: 75900 },
        { rate: 0.25, singleBottom: 37950, singleTop: 91900, hohBottom: 50800, hohTop: 131200, marriedBottom: 75900, marriedTop: 153100 },
        { rate: 0.28, singleBottom: 91900, singleTop: 191650, hohBottom: 131200, hohTop: 212500, marriedBottom: 153100, marriedTop: 233350 },
        { rate: 0.33, singleBottom: 191650, singleTop: 416700, hohBottom: 212500, hohTop: 416700, marriedBottom: 233350, marriedTop: 416700 },
        { rate: 0.35, singleBottom: 416700, singleTop: 418400, hohBottom: 416700, hohTop: 444500, marriedBottom: 416700, marriedTop: 470700 },
        { rate: 0.396, singleBottom: 418400, singleTop: Infinity, hohBottom: 444500, hohTop: Infinity, marriedBottom: 470700, marriedTop: Infinity }];
    self.standardDeduction = { single: 6350, headOfHousehold: 9350, married: 12700 };
    self.exemption = 4050;

    // PEP
    self.exemptionPhaseout = { 
        start: { single: 261500, headOfHousehold: 287650, married: 313800},
        increment: 2500,
        perIncrement: 0.02
    };

    // Pease
    self.deductionPhaseout = { 
        start: { single: 261500, headOfHousehold: 287650, married: 313800},
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
    self.amtHighRateStart = 187800;

    self.amtExemption = { single: 54300, married: 84500};

    self.amtPhaseOutStart = { single: 120700, married: 160900 };
    self.amtPhaseOutRate = 0.25;

    self.socialSecurityRate = 0.062;
    self.socialSecurityCap  = 127200;
    self.medicareRate = 0.0145;
    self.medicareAdditionalRate = 0.009;
    self.medicareAdditionalStart = { single: 200000, headOfHousehold: 200000, married: 250000};
    // no change 2016

    self.longTermCapitalGains = {
        levels: [0.15, 0.396, Infinity],
        rates: [0, 0.15, 0.20]
    };

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
    // not updated for 2016 yet
} 