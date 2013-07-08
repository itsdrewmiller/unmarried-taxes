function Income(wageIncome, outOfStateInterest, maInterest, propertyTax, mortgageInterest, mortgageInsurance, charity, dependentCareFsa, numDependents, type, childCare, rent, underGraduateStudentLoanInterest, shortTermCapitalGains, longTermCapitalGains, ordinaryDividends, qualifiedDividends, stateTaxWithheld, previousStateTaxPayment, commute) {
    var self = this;
    self.WageIncome = wageIncome;
    self.OutOfStateInterest = outOfStateInterest;
    self.MaInterest = maInterest;
    self.Interest = outOfStateInterest + maInterest;
    self.PropertyTax = propertyTax;
    self.MortgageInterest = mortgageInterest;
    self.MortgageInsurance = mortgageInsurance;
    self.Charity = charity;
    self.DependentCareFsa = dependentCareFsa;
    self.Type = type;
    self.NumDependents = numDependents;

    if (self.IsHeadOfHousehold && self.NumDependents < 1) { throw 'Cannot be head of household with zero dependents.'; }

    self.ChildCare = childCare;
    self.Rent = rent;
    self.UndergraduateStudentLoanInterest = underGraduateStudentLoanInterest;
    self.ShortTermCapitalGains = shortTermCapitalGains;
    self.LongTermCapitalGains = longTermCapitalGains;
    self.OrdinaryDividends = ordinaryDividends;
    self.QualifiedDividends = qualifiedDividends;
    self.StateTaxWithheld = stateTaxWithheld;
    self.PreviousStateTaxPayment = previousStateTaxPayment; // this could be negative
    self.Commute = commute;
}