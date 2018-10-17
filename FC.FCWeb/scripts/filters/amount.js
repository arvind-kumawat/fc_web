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
  .filter('amount', function () {
    return function (input) {
      if(input <= 2000000){
        if(input > 99000){
          if (input  % 100000 != 0)
            return (input / 100000).toFixed(2) + ' Lacs';
          else
            return (input / 100000) + ' Lacs';
        }
        else{
          if (input % 1000 != 0)
            return (input / 1000).toFixed(2) + ' Thou';
          else
            return (input / 1000) + ' Thou';
        }
      }

    };
  });
