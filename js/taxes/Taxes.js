function Taxes() {
    var self = this;
    self.TaxBrackets = [
        { rate: 0.1, singleBottom: 0, singleTop: 8700, hohBottom: 0, hohTop: 12400, marriedBottom: 0, marriedTop: 17400 },
        { rate: 0.15, singleBottom: 8700, singleTop: 35350, hohBottom: 12400, hohTop: 47350, marriedBottom: 17400, marriedTop: 70700 },
        { rate: 0.25, singleBottom: 35350, singleTop: 85650, hohBottom: 47350, hohTop: 122300, marriedBottom: 70700, marriedTop: 142700 },
        { rate: 0.28, singleBottom: 85650, singleTop: 178650, hohBottom: 122300, hohTop: 198050, marriedBottom: 142700, marriedTop: 217450 },
        { rate: 0.33, singleBottom: 178650, singleTop: 388350, hohBottom: 198050, hohTop: 388350, marriedBottom: 217450, marriedTop: 388350 },
        { rate: 0.35, singleBottom: 388350, singleTop: Infinity, hohBottom: 388350, hohTop: Infinity, marriedBottom: 388350, marriedTop: Infinity }];
    self.standardDeduction = { single: 5950, headOfHousehold: 8700, married: 11900 };
    self.Exemption = 3800;

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

    self.AmtExemption = { single: 50600, married: 78750};

    self.AmtPhaseOutStart = { single: 112500, married: 150000 };
    self.AmtPhaseOutRate = 0.25;

    self.SocialSecurityRate = 0.042;
    self.SocialSecurityCap  = 110100;
    self.MedicareRate = 0.0145;
    self.MedicareAdditionalRate = 0.000; // .009 next year
    self.MedicareAdditionalStart = 200000;

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