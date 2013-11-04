
var outerBox = { vars: [] };

//
var maxMortgageInterest = 23750.00;
var maxPropertyTax = 7000.00;
var maxCharity = 25000.00;
var maxDependents = 1;
var maxMortgageInsurance = 4200 + 5137.50 / 7;

outerBox.mortgageInterest = { min: 0, max: maxMortgageInterest };
outerBox.dependents = { min: 0, max: maxDependents, splitWeight: 100000, isDiscrete: true };
outerBox.propertyTax = { min: 0, max: maxPropertyTax };
outerBox.charity = { min: 0, max: maxCharity };
outerBox.mortgageInsurance = { min: 0, max: maxMortgageInsurance };

var bnb = new Bnb('min');
bnb.initialBox = outerBox;

// For demonstration purposes only
var income1 = new Income(100000.00, 0, 0, 0, 0, 0, 0, 0, 0, 'single', 0, 0, 0, 0, 0, 0, 0, 5000.00, 0, 0);
var income2 = new Income(200000.00, 0, 0, 0, 0, 0, 0, 0, 0, 'single', 0, 0, 0, 0, 0, 0, 0, 10000.00, 0, 0);

var taxes = new Taxes();

bnb.lowerBound = function (box) {

    income1.MortgageInterest = maxMortgageInterest - box.mortgageInterest.min;
    income2.MortgageInterest = box.mortgageInterest.max;

    income1.Charity = maxCharity - box.charity.min;
    income2.Charity = box.charity.max;

    income1.NumDependents = maxDependents - box.dependents.min;
    income2.NumDependents = box.dependents.max;

    income1.PropertyTax = maxPropertyTax - box.propertyTax.min;
    income2.PropertyTax = box.propertyTax.max;

    income1.MortgageInsurance = maxMortgageInsurance - box.mortgageInsurance.min;
    income2.MortgageInsurance = box.mortgageInsurance.max;

    income1.Type = taxCalculator.isHeadOfHousehold(income1, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single';
    income2.Type = taxCalculator.isHeadOfHousehold(income2, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single';

    var lower = taxCalculator.calculateOverallTax(taxes, income1) + taxCalculator.calculateOverallTax(taxes, income2);

    return lower;

};

bnb.upperBound = function (box) {

    income1.MortgageInterest = maxMortgageInterest - box.mortgageInterest.max;
    income2.MortgageInterest = box.mortgageInterest.min;

    income1.Charity = maxCharity - box.charity.max;
    income2.Charity = box.charity.min;

    income1.NumDependents = maxDependents - box.dependents.max;
    income2.NumDependents = box.dependents.min;

    income1.PropertyTax = maxPropertyTax - box.propertyTax.max;
    income2.PropertyTax = box.propertyTax.min;

    income1.MortgageInsurance = maxMortgageInsurance - box.mortgageInsurance.max;
    income2.MortgageInsurance = box.mortgageInsurance.min;

    income1.Type = taxCalculator.isHeadOfHousehold(income1, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single';
    income2.Type = taxCalculator.isHeadOfHousehold(income2, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single';

    var upper = taxCalculator.calculateOverallTax(taxes, income1) + taxCalculator.calculateOverallTax(taxes, income2);
    return upper;

};

var currentTime = new Date().getTime();

bnb.iteration = function (status) {
    if (status.count % 25000 === 0) {
        console.log('From ' + status.bounds.minLower + ' to ' + status.bounds.minUpper);
        console.log('Total time: ' + ((new Date().getTime() - currentTime)/1000).toFixed(0) + 's');
    }
};

bnb.tolerance = 100;
bnb.loopAbort = 10000000;

bnb.start(function (err, bnb) {
    console.log('Finished');
    console.dir(bnb.bestBox);
});
