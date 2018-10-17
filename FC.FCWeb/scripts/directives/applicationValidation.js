 angular.module('craditKartApp')
 .directive('ngModel', function() {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ngModel) {
            elem.on('blur', function() {
                ngModel.$dirty = true;
                /*scope.$apply();*/
            });

            ngModel.$viewChangeListeners.push(function() {
                ngModel.$dirty = false;
            });

            scope.$on('$destroy', function() {
                elem.off('blur');
            });
        }
    }
});
