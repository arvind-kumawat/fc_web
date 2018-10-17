'use strict';

/**
 * @ngdoc filter
 * @name craditKartApp.filter:amount
 * @function
 * @description
 * # amount
 * Filter in the craditKartApp.
 */
angular.module('craditKartApp')
  .filter('INR', function ($filter) {
    return function (input) {
      if (!isNaN(input) && input!=null) {
        var result = input.toString().split('.');
        var lastThree = result[0].substring(result[0].length - 3);
        var otherNumbers = result[0].substring(0, result[0].length - 3);
        if (otherNumbers !== '') {
          lastThree = ',' + lastThree;
        }
        var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        if (result.length > 1) {
          output += "." + result[1];
          output=$filter('number')(output,2)
        }

        return output;
      }
    }
  });
