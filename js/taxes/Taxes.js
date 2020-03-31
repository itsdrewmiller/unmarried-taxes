function Taxes() {
    var self = this;
    self.federalBrackets = [
        { rate: 0.1, singleBottom: 0, singleTop: 9700, hohBottom: 0, hohTop: 12850, marriedBottom: 0, marriedTop: 19400 },
        { rate: 0.12, singleBottom: 9700, singleTop: 39475, hohBottom: 12850, hohTop: 52850, marriedBottom: 19400, marriedTop: 78950 },
        { rate: 0.22, singleBottom: 39475, singleTop: 84200, hohBottom: 52850, hohTop: 84200, marriedBottom: 78950, marriedTop: 168400 },
        { rate: 0.24, singleBottom: 84200, singleTop: 160725, hohBottom: 84200, hohTop: 160725, marriedBottom: 168400, marriedTop: 321450 },
        { rate: 0.32, singleBottom: 160725, singleTop: 204100, hohBottom: 160725, hohTop: 204100, marriedBottom: 321450, marriedTop: 408200 },
        { rate: 0.35, singleBottom: 204100, singleTop: 510300, hohBottom: 204100, hohTop: 510300, marriedBottom: 408200, marriedTop: 612350 },
        { rate: 0.37, singleBottom: 510300, singleTop: Infinity, hohBottom: 510300, hohTop: Infinity, marriedBottom: 612350, marriedTop: Infinity }];
    self.standardDeduction = { single: 12200, headOfHousehold: 18350, married: 24400 };

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
    self.amtHighRateStart = 194800;

    self.amtExemption = { single: 71700, married: 111700};

    self.amtPhaseOutStart = { single: 510300, married: 1020600 };
    self.amtPhaseOutRate = 0.25;

    self.socialSecurityRate = 0.062;
    self.socialSecurityCap  = 132900;
    self.medicareRate = 0.0145;
    self.medicareAdditionalRate = 0.009;
    self.medicareAdditionalStart = { single: 200000, headOfHousehold: 200000, married: 250000};
 
    // TODO refactor, no longer matches up to income tax brackets
    // Mostly need to fix 0.37 since the mid-400k threshold specifically doesn't match
    // Not a huge impact assuming 500k here other than if income is very close to but under 500k
    self.longTermCapitalGains = {
        levels: [0.22, 0.37, Infinity],
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