﻿function Income(settings) {
    // previous order: wageIncome, outOfStateInterest, maInterest, propertyTax, mortgageInterest, mortgageInsurance, charity, dependentCareFsa, numDependents, type, childCare, rent, underGraduateStudentLoanInterest, shortTermCapitalGains, longTermCapitalGains, ordinaryDividends, qualifiedDividends, stateTaxWithheld, previousStateTaxPayment, commute) {

    settings = settings || {};
    var self = this;
    self.wageIncome = settings.wageIncome || 0;
    self.outOfStateInterest =settings.outOfStateInterest || 0;
    self.maInterest = settings.maInterest || 0;
    self.interest = settings.outOfStateInterest + settings.maInterest || 0;
    self.propertyTax = settings.propertyTax || 0;
    self.mortgageInsurance = settings.mortgageInsurance || 0;
    self.mortgageInterest1 = settings.mortgageInterest1 || 0;
    self.mortgageAmount1 = settings.mortgageAmount1 || 100000;
    self.mortgageInterest2 = settings.mortgageInterest2 || 0;
    self.mortgageAmount2 = settings.mortgageAmount2 || 100000;
    self.otherHousehold = settings.otherHousehold || 0;
    self.charity = settings.charity || 0;
    self.dependentCareFsa = settings.dependentCareFsa || 0;
    self.type = settings.type || 'single';
    self.numDependents = settings.numDependents || 0;

    if (self.type == 'hoh' && self.numDependents < 1) { throw 'Cannot be head of household with zero dependents.'; }

    self.childCare = settings.childCare || 0;
    self.rent = settings.rent || 0;
    self.undergraduateStudentLoanInterest = settings.underGraduateStudentLoanInterest || 0;
    self.shortTermCapitalGains = settings.shortTermCapitalGains || 0;
    self.longTermCapitalGains = settings.longTermCapitalGains || 0;
    self.ordinaryDividends = settings.ordinaryDividends || 0;
    self.qualifiedDividends = settings.qualifiedDividends || 0;
    self.stateTaxWithheld = settings.stateTaxWithheld || 0;
    self.previousStateTaxPayment = settings.previousStateTaxPayment || 0; // this could be negative
    self.commute = settings.commute || 0;
}

if (typeof module !== 'undefined') { 
    module.exports = Income; 
}