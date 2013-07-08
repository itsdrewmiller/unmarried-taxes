var outerBox = { vars: [] };

//
var maxMortgageInterest = 24184.60;
var maxPropertyTax = 8028.91;
var maxCharity = 7441.28;
var maxDependents = 1;
var maxChildcareExpenses = 2305-500;
var maxOutOfStateInterest = 299.38;
var maxMaInterest = 26.17;
var maxMortgageInsurance = 4284.66 + 5137.50 / 7;

outerBox.vars.push({ min: 0, max: maxMortgageInterest, weight: 1, isDiscrete: false });
outerBox.vars.push({ min: 0, max: maxCharity, weight: 1, isDiscrete: false });
outerBox.vars.push({ min: 0, max: maxDependents, weight: 1000, isDiscrete: true });
outerBox.vars.push({ min: 0, max: maxPropertyTax, weight: 1, isDiscrete: false });
//outerBox.vars.push({ min: 0, max: maxChildcareExpenses, weight: 1, isDiscrete: false });
outerBox.vars.push({ min: 0, max: maxMortgageInsurance, weight: 1, isDiscrete: false });


// For demonstration purposes only
var income1 = new Income(100000.00 + 4125, 0, 0, 0, 0, 0, 0, 500, 0, 'single', 0, 0, 0, 0, 0, 0, 0, 5000.00, 150, 0);
var income2 = new Income(200000.00 + 10000, 0, 0, 0, 0, 0, 0, 0, 0, 'single', 0, 0, 0, 0, 0, 0, 0, 10000.00, 621, 0);

var taxes = new Taxes();

var lowerBound = function (box) {

    income1.MortgageInterest = maxMortgageInterest - box.vars[0].min;
    income2.MortgageInterest = box.vars[0].max;

    income1.Charity = maxCharity - box.vars[1].min;
    income2.Charity = box.vars[1].max;

    income1.NumDependents = maxDependents - box.vars[2].min;
    income2.NumDependents = box.vars[2].max;

    income1.PropertyTax = maxPropertyTax - box.vars[3].min;
    income2.PropertyTax = box.vars[3].max;

    //income1.ChildCare = maxChildcareExpenses - box.vars[4].min;
    //income2.ChildCare = box.vars[4].max;

    income1.MortgageInsurance = maxMortgageInsurance - box.vars[4].min;
    income2.MortgageInsurance = box.vars[4].max;

    income1.Type = taxCalculator.isHeadOfHousehold(income1, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single'
    income2.Type = taxCalculator.isHeadOfHousehold(income2, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single'

    var lower = taxCalculator.calculateOverallTax(taxes, income1) + taxCalculator.calculateOverallTax(taxes, income2);

    return lower;

}

var upperBound = function (box) {

    income1.MortgageInterest = maxMortgageInterest - box.vars[0].max;
    income2.MortgageInterest = box.vars[0].min;

    income1.Charity = maxCharity - box.vars[1].max;
    income2.Charity = box.vars[1].min;

    baseDrewIncome.NumDependents = maxDependents - box.vars[2].max;
    income2.NumDependents = box.vars[2].min;

    income1.PropertyTax = maxPropertyTax - box.vars[3].max;
    income2.PropertyTax = box.vars[3].min;

    //income1.ChildCare = maxChildcareExpenses - box.vars[4].max;
    //income2.ChildCare = box.vars[4].min;

    income1.MortgageInsurance = maxMortgageInsurance - box.vars[4].max;
    income2.MortgageInsurance = box.vars[4].min;

    income1.Type = taxCalculator.isHeadOfHousehold(income1, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single'
    income2.Type = taxCalculator.isHeadOfHousehold(income2, maxMortgageInterest, maxPropertyTax, maxMortgageInsurance) ? 'hoh' : 'single'

    var upper = taxCalculator.calculateOverallTax(taxes, income1) + taxCalculator.calculateOverallTax(taxes, income2);
    return upper;

}

var currentTime = new Date().getTime();

var callback = function (status) {
    if (status.iterations % 25000 === 0) {
        console.log('Iteration ' + status.iterations);
        console.log('Total time: ' + ((new Date().getTime() - currentTime)/1000).toFixed(0) + 's');
        console.log((status.remainingPercent * 100).toFixed(4) + '% - ' + status.remainingCount + ' boxes');
        console.log('Between ' + status.lowerBound.toFixed(2) + ' and ' + status.upperBound.toFixed(2) + ' for a difference of ' + (status.upperBound - status.lowerBound).toFixed(2));
    }
}

var finalBox = branchAndBound.run('min', lowerBound, upperBound, outerBox, 100, callback);

console.log(finalBox);
