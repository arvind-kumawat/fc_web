'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('loanRenewCtrl', function ($rootScope, $auth, $scope, toastr, $timeout, $state, $http, $location, loanAccountRepository, productRepository, productGroupRepository, LoanAccountRepository) {
      $scope.ProductGroups = [];

      //function loanproductGroup() {
      //    productGroupRepository.GetAll($state.params.productId, function (callback) {
      //        $scope.ProductGroups = callback;
      //        console.log('productgroup', $scope.ProductGroups);
      //    })
      //}

      ////renew loan application
      //$scope.RenewLoanApplication = function () {
      //    LoanAccountRepository.RenewApplication
      //}
      //loanproductGroup();
  });

