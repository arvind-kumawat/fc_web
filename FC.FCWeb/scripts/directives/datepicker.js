angular.module('craditKartApp')
    .directive('jquerydatepicker', function () {
        return {
   
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                $(function () {
                    element.datepicker({
                        changeMonth: true,
                        changeYear: true,
                        maxDate: attrs.maxdateset,
                        minDate: attrs.mindateset,
                        yearRange: "1900:3000",
                        dateFormat: attrs.dateformatset,
                        onSelect: function (date) {
                            scope.$apply(function () {
                                ngModelCtrl.$setViewValue(date);
                            })
                        }
                    });
                });
            }
        }
    });