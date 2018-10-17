angular.module('craditKartApp').directive('setClassWhenAtTop', function ($window) {
  var $win = angular.element($window); // wrap window object as jQuery object

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var topClass = attrs.setClassWhenAtTop, // get CSS class from directive's attribute value
        offsetTop = element.offset().top; // get element's offset top relative to document
        var offsetTopForFooter = $('#kreditcartFooter').offset().top;
      $win.on('scroll', function (e) {
      //  console.log('offsetTop',offsetTop,'----','offsetTopForFooter',offsetTopForFooter, '----', '$win.scrollTop()',$win.scrollTop());
        if ($win.scrollTop() >= offsetTop/* && $win.scrollTop() <= offsetTopForFooter*/) {
          element.addClass(topClass);
        } else {
          element.removeClass(topClass);
        }
      });
    }
  };
});
