
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
var income1 = new Income({
    wageIncome: 100000,
    stateTaxWithheld: 5000
});

var income2 = new Income({
    wageIncome: 200000,
    stateTaxWithheld: 10000
});

var taxes = new Taxes();

bnb.lowerBound = function (box) {

    income1.mortgageInterest = maxMortgageInterest - box.mortgageInterest.min;
    income2.mortgageInterest = box.mortgageInterest.max;

    income1.charity = maxCharity - box.charity.min;
    income2.charity = box.charity.max;

    income1.numDependents = maxDependents - box.dependents.min;
    income2.numDependents = box.dependents.max;

    income1.propertyTax = maxPropertyTax - box.propertyTax.min;
    income2.propertyTax = box.propertyTax.max;

    income1.mortgageInsurance = maxMortgageInsurance - box.mortgageInsurance.min;
    income2.mortgageInsurance = box.mortgageInsurance.max;

    income1.type = taxCalculator.isHeadOfHousehold(income1, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single';
    income2.type = taxCalculator.isHeadOfHousehold(income2, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single';

    var lower = taxCalculator.calculateOverallTax(taxes, income1) + taxCalculator.calculateOverallTax(taxes, income2);
    return lower;

};

bnb.upperBound = function (box) {

    income1.mortgageInterest = maxMortgageInterest - box.mortgageInterest.max;
    income2.mortgageInterest = box.mortgageInterest.min;

    income1.charity = maxCharity - box.charity.max;
    income2.charity = box.charity.min;

    income1.numDependents = maxDependents - box.dependents.max;
    income2.numDependents = box.dependents.min;

    income1.propertyTax = maxPropertyTax - box.propertyTax.max;
    income2.propertyTax = box.propertyTax.min;

    income1.mortgageInsurance = maxMortgageInsurance - box.mortgageInsurance.max;
    income2.mortgageInsurance = box.mortgageInsurance.min;

    income1.type = taxCalculator.isHeadOfHousehold(income1, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single';
    income2.type = taxCalculator.isHeadOfHousehold(income2, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single';

    var upper = taxCalculator.calculateOverallTax(taxes, income1) + taxCalculator.calculateOverallTax(taxes, income2);
    return upper;

};

var currentTime = new Date().getTime();

bnb.iteration = function (status) {
    if (status.count % 2500 === 0) {
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
