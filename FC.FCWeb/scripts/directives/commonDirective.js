/*angular.module("craditKartApp", [])
  .directive("scrollToTopWhen", function ($timeout) {
    function link (scope, element, attrs) {
      scope.$on(attrs.scrollToTopWhen, function () {
        $timeout(function () {
          angular.element(element)[0].scrollTop = 0;
        });
      });
    }
  });*/

angular.module('craditKartApp')
  .directive('ngModel', function() {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
          scope.$apply(function (){
            scope.$eval(attrs.ngEnter);
          });

        //  event.preventDefault();
        }
      });
    };
  });
