// Depends on jquery UI

angular.module('unmarriedTaxes', [])
    .directive('slider', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                scope.$watch(attrs.ngModel, function (value) {
                    element.slider('value', parseInt(value, 10));
                });
                element.slider({
                    min: parseInt(attrs.min, 10),
                    max: parseInt(attrs.max, 10),
                    value: attrs.value !== undefined ? parseInt(attrs.value, 10) : parseInt(attrs.min, 10),
                    step: parseInt(attrs.step, 10),
                    slide: function (event, ui) {
                        $parse(attrs.ngModel).assign(scope, ui.value);
                        scope.$apply();
                    }
                });

                scope[attrs.ngModel] = element.slider('value');
            }
        };
    })
    .directive('currency', function ($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                ctrl.$parsers.push(function (text) {
                    if (text === undefined) {
                        return 0;
                    }
                    var floatResult = parseFloat(text.replace(/[^0-9.-]/g, ''));
                    if (isNaN(floatResult)) {
                        return text;
                    }
                    return floatResult;
                });
                ctrl.$formatters.push(function (text) {
                    if (text !== undefined && isNaN(parseFloat((text + '').replace(/[^0-9.-]/g, '')))) {
                        return text;
                    }
                    return $filter('currency')(text);
                });
                element.bind('blur', function () {
                    var viewValue = ctrl.$modelValue;
                    for (var i in ctrl.$formatters) {
                        viewValue = ctrl.$formatters[i](viewValue);
                    }
                    ctrl.$viewValue = viewValue;
                    ctrl.$render();
                });
            }
        };
    })
    .directive('currencySlidebox', function () {

        return getSlidebox('currency', 2);

    })
    .directive('integerSlidebox', function () {
        return getSlidebox('', 0);
    });

function getSlidebox(attributes, rounding) {
    return {
        restrict: 'A',
        transclude: true,
        scope: { label: '@', localModel: '=ngModel', currency: '@' },
        controller: function ($scope, $parse) {
            $scope.getFirst = function () {
                var firstValue = $scope.localModel.total - $scope.getSecond();
                return firstValue;
            };
            $scope.getSecond = function () {
                var secondValue = accounting.toFixed(0.01 * $scope.localModel.percentSecond * $scope.localModel.total, rounding);
                return secondValue;
            };

            $scope.getType = function () {
                return $scope.type;
            };
        },
        template: '<td>{{label}}</td><td><input ' + attributes + ' ng-model="localModel.total" /></td><td><div slider class="slider" ng-model="localModel.percentSecond" min="0" max="100" value="50" step="1"></td><td><input value="{{getFirst()' + (attributes ? ' | ' + attributes : '') + ' }}" disabled="disabled"/></td><td><input value="{{getSecond()' + (attributes ? ' | ' + attributes : '') + ' }}" disabled="disabled"/></td>',
        replace: false
    };
}


function UnmarriedTaxesCtrl($scope) {

    // sample values based on http://quickfacts.census.gov/qfd/states/25000.html

    $scope.incomeFirst = { 
        wage: income1.wageIncome, 
        undergraduateLoanInterest: income1.undergraduateStudentLoanInterest, 
        stateTaxWithheld: income1.stateTaxWithheld, 
        lastYearStateTaxPayment: income1.previousStateTaxPayment 
    };
    $scope.incomeSecond = { 
        wage: income2.wageIncome, 
        undergraduateLoanInterest: income2.undergraduateStudentLoanInterest, 
        stateTaxWithheld: income2.stateTaxWithheld, 
        lastYearStateTaxPayment: income2.previousStateTaxPayment 
    };

    var getSecond = function (sliderValues, isInt) {
        var value = 0.01 * sliderValues.percentSecond * sliderValues.total;
        if (isInt) {
            value = parseInt(accounting.toFixed(value, 0), 10);
        }
        return value;
    };
    var getFirst = function(sliderValues, isInt) { return sliderValues.total-getSecond(sliderValues, isInt); };

    $scope.shortTermCapitalGains = { total: income1.shortTermCapitalGains + income2.shortTermCapitalGains, percentSecond: 50 };
    $scope.longTermCapitalGains = { total: income1.longTermCapitalGains + income2.longTermCapitalGains, percentSecond: 50 };
    $scope.ordinaryDividends = { total: income1.ordinaryDividends + income2.ordinaryDividends, percentSecond: 50 };
    $scope.qualifiedDividends = { total: income1.qualifiedDividends + income2.qualifiedDividends, percentSecond: 50 };
    $scope.outOfStateInterest = { total: income1.outOfStateInterest + income2.outOfStateInterest, percentSecond: 50 };
    $scope.maInterest = { total: income1.maInterest + income2.maInterest, percentSecond: 50 };
    $scope.dependentCareFsa = { total: income1.dependentCareFsa + income2.dependentCareFsa, percentSecond: 0 };
    $scope.numDependents = { total: income1.numDependents + income2.numDependents, percentSecond: 100 };

    // http://xfinity.comcast.net/slideshow/finance-propertytaxes/massachusetts/
    $scope.propertyTax = { total: income1.propertyTax + income2.propertyTax, percentSecond: 50 };


    $scope.mortgageInterest1 = { total: income1.mortgageInterest1 + income2.mortgageInterest1, percentSecond: 50 };
    $scope.mortgageInterest2 = { total: income1.mortgageInterest2 + income2.mortgageInterest2, percentSecond: 50 };
    $scope.mortgageInsurance = { total: income1.mortgageInsurance + income2.mortgageInsurance, percentSecond: 50 };
    $scope.otherHousehold = { total: income1.otherHousehold + income2.otherHousehold, percentSecond: 50 };
    $scope.charitableGiving = { total: income1.charity + income2.charity, percentSecond: 50 };

    // http://www.huffingtonpost.com/2013/11/05/child-care-costs_n_4215659.html
    $scope.childCare = { total: income1.childCare + income2.childCare, percentSecond: 50 };
    $scope.rent = { total: income1.rent + income2.rent, percentSecond: 50 };
    $scope.commute = { total: income1.commute + income2.commute, percentSecond: 50 };

    var getIncome = function (getterFunc, scopeIncome, type) {

        if (type === undefined) {
            type = 'single';
        }
        var income = new Income({
            wageIncome: scopeIncome.wage,
            outOfStateInterest: getterFunc($scope.outOfStateInterest),
            maInterest: getterFunc($scope.maInterest),
            propertyTax: getterFunc($scope.propertyTax),
            mortgageInterest1: getterFunc($scope.mortgageInterest1),
            mortgageInterest2: getterFunc($scope.mortgageInterest2),
            mortgageInsurance: getterFunc($scope.mortgageInsurance),
            otherHousehold: getterFunc($scope.otherHousehold),
            charity: getterFunc($scope.charitableGiving),
            dependentCareFsa: getterFunc($scope.dependentCareFsa),
            numDependents: getterFunc($scope.numDependents, true),
            type: type,
            childCare: getterFunc($scope.childCare),
            rent: getterFunc($scope.rent),
            undergraduateStudentLoanInterest: scopeIncome.undergraduateLoanInterest,
            shortTermCapitalGains: getterFunc($scope.shortTermCapitalGains),
            longTermCapitalGains: getterFunc($scope.longTermCapitalGains),
            ordinaryDividends: getterFunc($scope.ordinaryDividends),
            qualifiedDividends: getterFunc($scope.qualifiedDividends),
            stateTaxWithheld: scopeIncome.stateTaxWithheld,
            previousYearStateTaxPayment: scopeIncome.lastYearStateTaxPayment,
            commute: getterFunc($scope.commute)
        });

        if (income.type === 'single' && taxCalculator.isHeadOfHousehold(income, $scope.mortgageInterest1.total + $scope.mortgageInterest2.total, $scope.propertyTax.total, $scope.mortgageInsurance.total, $scope.otherHousehold.total)) { income.type = 'hoh'; }

        return income;
    };

    var taxes = new Taxes(true);

    $scope.firstIncome = function () {
        return getIncome(getFirst, $scope.incomeFirst);
    };

    $scope.secondIncome = function () {
        return getIncome(getSecond, $scope.incomeSecond);
    };

    $scope.marriedIncome = function () {
        var marriedIncome = {
            wage: $scope.incomeFirst.wage + $scope.incomeSecond.wage,
            undergraduateLoanInterest: $scope.incomeFirst.undergraduateLoanInterest + $scope.incomeSecond.undergraduateLoanInterest,
            stateTaxWithheld: $scope.incomeFirst.stateTaxWithheld + $scope.incomeSecond.stateTaxWithheld,
            lastYearStateTaxPayment: $scope.incomeFirst.lastYearStateTaxPayment + $scope.incomeSecond.lastYearStateTaxPayment
        };
        return getIncome(function (sliderValue) { return parseFloat(sliderValue.total); }, marriedIncome, 'married');
    };

    $scope.GetFederalRegularFirst = function () {
        return taxCalculator.calculateRegularTax(taxes, $scope.firstIncome());
    };

    $scope.GetFederalRegularSecond = function () {
        return taxCalculator.calculateRegularTax(taxes, $scope.secondIncome());
    };

    $scope.GetFederalRegularMarried = function () {
        return taxCalculator.calculateRegularTax(taxes, $scope.marriedIncome());
    };

    $scope.GetFederalAmtFirst = function () {
        return taxCalculator.calculateAmt(taxes, $scope.firstIncome());
    };

    $scope.GetFederalAmtSecond = function () {
        return taxCalculator.calculateAmt(taxes, $scope.secondIncome());
    };

    $scope.GetFederalAmtMarried = function () {
        return taxCalculator.calculateAmt(taxes, $scope.marriedIncome());
    };

    $scope.GetFederalPayrollFirst = function () {
        return taxCalculator.calculatePayrollTax(taxes, $scope.firstIncome());
    };

    $scope.GetFederalPayrollSecond = function () {
        return taxCalculator.calculatePayrollTax(taxes, $scope.secondIncome());
    };

    $scope.GetStateMaFirst = function () {
        return taxCalculator.calculateMaTax(taxes, $scope.firstIncome());
    };

    $scope.GetStateMaSecond = function () {
        return taxCalculator.calculateMaTax(taxes, $scope.secondIncome());
    };

    $scope.GetStateMaMarried = function () {
        return taxCalculator.calculateMaTax(taxes, $scope.marriedIncome());
    };

    $scope.GetOverallFirst = function () {
        return taxCalculator.calculateOverallTax(taxes, $scope.firstIncome());
    };

    $scope.GetOverallSecond = function () {
        return taxCalculator.calculateOverallTax(taxes, $scope.secondIncome());
    };

    $scope.GetOverallMarried = function () {
        return taxCalculator.calculateFederalIncomeTax(taxes, $scope.marriedIncome()) + $scope.GetFederalPayrollFirst() + $scope.GetFederalPayrollSecond() + $scope.GetStateMaMarried();
    };
}