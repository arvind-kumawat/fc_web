angular.module('craditKartApp')
.directive('validNumber', function() {
    return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            if(!ngModelCtrl) {
                return;
            }
            element.bind('keypress', function(event) {
                if(!(event.keyCode >= 48 && event.keyCode <= 57)) {
                    event.preventDefault();
                }
            });
        }
    };
});