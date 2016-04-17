
var outerBox = { vars: [] };

//
var maxMortgageInterest = income1.mortgageInterest + income2.mortgageInterest;
var maxPropertyTax = income1.propertyTax + income2.propertyTax;
var maxCharity = income1.charity + income2.charity;
var maxDependents = income1.numDependents + income2.numDependents;
var maxMortgageInsurance = income1.mortgageInsurance + income2.mortgageInsurance;
var maxOtherHousehold = income1.otherHousehold + income2.otherHousehold;


outerBox.mortgageInterest = { min: 0, max: maxMortgageInterest };
outerBox.dependents = { min: 0, max: maxDependents, splitWeight: 100000, isDiscrete: true };
outerBox.propertyTax = { min: 0, max: maxPropertyTax };
outerBox.charity = { min: 0, max: maxCharity };
outerBox.mortgageInsurance = { min: 0, max: maxMortgageInsurance };
outerBox.otherHousehold = { min: 0, max: maxOtherHousehold };


var bnb = new Bnb('min');
bnb.initialBox = outerBox;

// For demonstration purposes only
var income1 = new Income(income1);

var income2 = new Income(income2);

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

    income1.otherHousehold = maxOtherHousehold - box.otherHousehold.min;
    income2.otherHousehold = box.otherHousehold.max;

    income1.type = taxCalculator.isHeadOfHousehold(income1, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance, maxOtherHousehold) ? 'hoh' : 'single';
    income2.type = taxCalculator.isHeadOfHousehold(income2, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance, maxOtherHousehold) ? 'hoh' : 'single';

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

    income1.otherHousehold = maxOtherHousehold - box.otherHousehold.max;
    income2.otherHousehold = box.otherHousehold.min;

    income1.type = taxCalculator.isHeadOfHousehold(income1, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance, maxOtherHousehold) ? 'hoh' : 'single';
    income2.type = taxCalculator.isHeadOfHousehold(income2, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance, maxOtherHousehold) ? 'hoh' : 'single';

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

bnb.tolerance = 300;
bnb.loopAbort = 10000000;

bnb.start(function (err, bnb) {
    console.log('Finished');
    console.dir(bnb.bestBox);
});
