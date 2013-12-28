function Taxes() {
    var self = this;
    self.federalBrackets = [
        { rate: 0.1, singleBottom: 0, singleTop: 8925, hohBottom: 0, hohTop: 12750, marriedBottom: 0, marriedTop: 17850 },
        { rate: 0.15, singleBottom: 8925, singleTop: 36250, hohBottom: 12750, hohTop: 48600, marriedBottom: 17850, marriedTop: 72500 },
        { rate: 0.25, singleBottom: 36250, singleTop: 87850, hohBottom: 48600, hohTop: 125450, marriedBottom: 72500, marriedTop: 146400 },
        { rate: 0.28, singleBottom: 87850, singleTop: 183250, hohBottom: 125450, hohTop: 203050, marriedBottom: 146400, marriedTop: 223050 },
        { rate: 0.33, singleBottom: 183250, singleTop: 398350, hohBottom: 203050, hohTop: 398350, marriedBottom: 223050, marriedTop: 398350 },
        { rate: 0.35, singleBottom: 398350, singleTop: 400000, hohBottom: 398350, hohTop: 425000, marriedBottom: 398350, marriedTop: 450000 },
        { rate: 0.396, singleBottom: 400000, singleTop: Infinity, hohBottom: 425000, hohTop: Infinity, marriedBottom: 450000, marriedTop: Infinity }];
    self.standardDeduction = { single: 6100, headOfHousehold: 8950, married: 12200 };
    self.exemption = 3900;

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
    self.amtHighRateStart = 175000;

    self.amtExemption = { single: 51900, married: 80800};

    self.amtPhaseOutStart = { single: 115400, married: 153900 };
    self.amtPhaseOutRate = 0.25;

    self.socialSecurityRate = 0.042;
    self.socialSecurityCap  = 113700;
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