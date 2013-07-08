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

    $scope.incomeFirst = { wage: 100000.00, undergraduateLoanInterest: 0, stateTaxWithheld: 5000.00, lastYearStateTaxPayment: 0 };
    $scope.incomeSecond = { wage: 200000.00, undergraduateLoanInterest: 0, stateTaxWithheld: 10000.00, lastYearStateTaxPayment: 0 };

    var getSecond = function (sliderValues, isInt) {
        var value = 0.01 * sliderValues.percentSecond * sliderValues.total;
        if (isInt) {
            value = parseInt(accounting.toFixed(value, 0), 10);
        }
        return value;
    };
    var getFirst = function(sliderValues, isInt) { return sliderValues.total-getSecond(sliderValues, isInt); };

    $scope.shortTermCapitalGains = { total: 0, percentSecond: 50 };
    $scope.longTermCapitalGains = { total: 0, percentSecond: 50 };
    $scope.ordinaryDividends = { total: 0, percentSecond: 50 };
    $scope.qualifiedDividends = { total: 0, percentSecond: 50 };
    $scope.outOfStateInterest = { total: 299.38, percentSecond: 50 };
    $scope.maInterest = { total: 26.17, percentSecond: 50 };
    $scope.dependentCareFsa = { total: 500, percentSecond: 0 };
    $scope.numDependents = { total: 1, percentSecond: 100 };
    $scope.propertyTax = { total: 8028.91, percentSecond: 50 };
    $scope.mortgageInterest = { total: 24184.60, percentSecond: 50 };
    $scope.mortgageInsurance = { total: 4284.66 + 733.93, percentSecond: 50 };
    $scope.charitableGiving = { total: 7441.28, percentSecond: 50 };
    $scope.childCare = { total: 1805, percentSecond: 50 };
    $scope.rent = { total: 0, percentSecond: 50 };
    $scope.commute = { total: 0, percentSecond: 50 };

    var getIncome = function (getterFunc, scopeIncome, type) {

        if (type === undefined) {
            type = 'single';
        }
        var income = new Income(scopeIncome.wage,
            getterFunc($scope.outOfStateInterest),
            getterFunc($scope.maInterest),
            getterFunc($scope.propertyTax),
            getterFunc($scope.mortgageInterest),
            getterFunc($scope.mortgageInsurance),
            getterFunc($scope.charitableGiving),
            getterFunc($scope.dependentCareFsa),
            getterFunc($scope.numDependents, true),
            type,
            getterFunc($scope.childCare),
            getterFunc($scope.rent),
            scopeIncome.undergraduateLoanInterest,
            getterFunc($scope.shortTermCapitalGains),
            getterFunc($scope.longTermCapitalGains),
            getterFunc($scope.ordinaryDividends),
            getterFunc($scope.qualifiedDividends),
            scopeIncome.stateTaxWithheld,
            scopeIncome.lastYearStateTaxPayment,
            getterFunc($scope.commute));

        if (income.Type === 'single' && taxCalculator.isHeadOfHousehold(income, $scope.mortgageInterest.total, $scope.propertyTax.total, $scope.mortgageInsurance.total)) { income.Type = 'hoh'; }

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