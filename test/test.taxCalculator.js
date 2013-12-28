var assert = require('assert');
var Income = require('./../js/taxes/Income.js');
var taxCalc = require('./../js/taxes/taxCalculator.js');

describe('TaxCalculator', function() {
	describe('#isHeadOfHousehold', function() {
		it('should return false when no dependents', function() {
			assert.equal(false, taxCalc.isHeadOfHousehold(new Income()));
		});

		var testIncome = new Income({
			numDependents: 1,
			mortgageInsurance: 4,
			mortgageInterest: 4,
			propertyTax: 4,
			otherHousehold: 4
		});

		it('should return false when income has less than or equal to half the total amount of household expenses', function() {
			assert.equal(false, taxCalc.isHeadOfHousehold(testIncome, 9, 9, 9, 9));
			assert.equal(false, taxCalc.isHeadOfHousehold(testIncome, 8, 8, 8, 8));
		});

		it('should return true when income has more than half the total amount of household expenses', function() {
			assert.equal(true, taxCalc.isHeadOfHousehold(testIncome, 7, 7, 7, 7));
			assert.equal(true, taxCalc.isHeadOfHousehold(testIncome, 8, 8, 8, 7));
		});
	});
});