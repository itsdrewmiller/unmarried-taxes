function Taxes() {
    var self = this;
    self.TaxBrackets = [
        { rate: 0.1, singleBottom: 0, singleTop: 8925, hohBottom: 0, hohTop: 12750, marriedBottom: 0, marriedTop: 17850 },
        { rate: 0.15, singleBottom: 8925, singleTop: 36250, hohBottom: 12750, hohTop: 48600, marriedBottom: 17850, marriedTop: 72500 },
        { rate: 0.25, singleBottom: 36250, singleTop: 87850, hohBottom: 48600, hohTop: 125450, marriedBottom: 72500, marriedTop: 146400 },
        { rate: 0.28, singleBottom: 87850, singleTop: 183250, hohBottom: 125450, hohTop: 203050, marriedBottom: 146400, marriedTop: 223050 },
        { rate: 0.33, singleBottom: 183250, singleTop: 398350, hohBottom: 203050, hohTop: 398350, marriedBottom: 223050, marriedTop: 398350 },
        { rate: 0.35, singleBottom: 398350, singleTop: 400000, hohBottom: 398350, hohTop: 425000, marriedBottom: 398350, marriedTop: 450000 },
        { rate: 0.396, singleBottom: 400000, singleTop: Infinity, hohBottom: 425000, hohTop: Infinity, marriedBottom: 450000, marriedTop: Infinity }];
    self.standardDeduction = { single: 6100, headOfHousehold: 8950, married: 12200 };
    self.Exemption = 3900;

    self.MortgageInsurancePhaseOutStart = 100000;
    self.MortgageInsurancePhaseOutIncrement = 1000;
    self.MortgageInsurancePhaseOutPerIncrement = 0.1;

    self.childAndDependentCareMaxRatio = 0.35;
    self.childAndDependentCarePhaseOutStart = 15000;
    self.childAndDependentCarePhaseOutIncrement = 2000;
    self.childAndDependentCarePhaseOutPerIncrement = 0.01;
    self.childAndDependentCareMinRatio = 0.2;

    self.childAndDependentCareExpensesPerDependent = 3000;
    self.childAndDependentCareMaxExpenses = 6000;


    self.AmtLowRate = 0.26;
    self.AmtHighRate = 0.28;
    self.AmtHighRateStart = 175000;

    self.AmtExemption = { single: 51900, married: 80800};

    self.AmtPhaseOutStart = { single: 115400, married: 153900 };
    self.AmtPhaseOutRate = 0.25;

    self.SocialSecurityRate = 0.042;
    self.SocialSecurityCap  = 113700;
    self.MedicareRate = 0.0145;
    self.MedicareAdditionalRate = 0.009;
    self.MedicareAdditionalStart = { single: 200000, headOfHousehold: 200000, married: 250000};

    self.LongTermCapitalGainsMaximumExemptRate = 0.15;
    self.LongTermCapitalGainsRate = 0.15;

    self.QualifiedDividendsRate = 0.15;

    self.MaRate = 0.053;
    self.MaExemption = { single: 4400, hoh: 6800, married: 8800 };
    self.MaDependentExemption = 1000;
    self.MaInterestDeductionCap = { single: 100, married: 200 };
    self.MaPayrollMaximumDeduction = 2000;
    self.MaPerChildMinimumDeduction = 3600;
    self.MaPerChildMaximumDeduction = 4800;
    self.MaMaximumDependents = 2;
    self.MaMaximumRentalDeduction = 3000;
    self.MaCommuterDeductionThreshold = 150;
    self.MaMaximumCommuterDeduction = 750;
    self.MaShortTermCapitalGainsRate = 0.12;
    self.MaLongTermCapitalGainsRate = 0.053;

} 