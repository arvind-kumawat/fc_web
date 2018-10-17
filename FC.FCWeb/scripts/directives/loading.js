angular.module('craditKartApp').directive('pageLoader', function () {
  return {
    restrict: 'E',
    template: '<div class="pageLoader">' +
    '<span><img src="images/loader.gif"></span>' +
    '</div>'
  };
});
