'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:BorrowerDashboardControllerCtrl
 * @description
 * # BorrowerDashboardControllerCtrl
 */
angular.module('craditKartApp')
  .controller('borrower_loan', function ($scope, $auth, $state, $timeout, $http, CONSTANT, toastr, $location, $rootScope, loanRepository, loanDocumentRepository, authTokenRepository, fcLoanSearchRepository) {

      $scope.Init = function () {
          //get all loans

          $scope.checkIsSalesAgent();
      }
      $scope.isSalesAgent = false;
      function RequestForDisburse() {
          loanRepository.RequestForDisburse($scope.SelectedLoan.LoanId, function (callback) {
              getLoans();
          })
      }

      //Generate document
      $scope.GenerateLoanStatement = function (id) {
          
          loanDocumentRepository.GenerateLoanStatement(id, function (callback) {
              $scope.GetLoanStatement(id);
          })
      }
      //get all laons
      $scope.getLoans = function () {
          
          if ($scope.isSalesAgent == false) {
              loanRepository.GetForLoggedInUser_FE(function (callback) {

                  $scope.Loans = callback;
                  console.log("$scope.Loans", $scope.Loans);

                  if ($scope.Loans.length > 0)
                      $scope.SelectedLoanChanged($scope.Loans[0].LoanId);
              })
          }
      }


      //Get Sales Agent

      $scope.GetSearchResult = function () {
         
          fcLoanSearchRepository.Get($rootScope.loggedInUser.personId, $scope.searchText, function (callback) {
              $scope.searchResult = callback;
              console.log("callback", callback)

          })
      }


      $scope.GetSearchResults = function () {
          if ($scope.searchText == null)
              return;
          if ($scope.searchText.length < 3)
              return;

          $('customTemplate').modal('show');
          return fcLoanSearchRepository.Get($rootScope.loggedInUser.personId, $scope.searchText).then(function (response) {
              console.log(response)
              return response.data.map(function (item) {
                  return item;
              })
              
          });
      }
      //on loan Chnage
      $scope.SelectedLoanChanged = function (loanId) {
          debugger;
         
          if (loanId == 0) {
              loanRepository.FCDashboardGetFirstLoan(0,function (result) {
                  console.log("loannss", result)
                  $scope.SelectedLoan = result;
                  console.log('$scope.SelectedLoan', $scope.SelectedLoan);
                  $(".dropdown-toggle").attr("aria-expanded", false);
                  $('#drop_down_loans').removeClass('open');
                  $scope.LoanAccountId = $scope.SelectedLoan.FKLoanAccountId;
                  $scope.LoanDocuments = $scope.SelectedLoan.loanDocuments;
              })

          }
          else {
              debugger;
              loanRepository.FCDashboardGetFilteredLoan(loanId, function (result) {
                  console.log("loannss", result)

                  $scope.SelectedLoan = result;
                  console.log('$scope.SelectedLoan', $scope.SelectedLoan);
                  $(".dropdown-toggle").attr("aria-expanded", false);
                  $('#drop_down_loans').removeClass('open');
                  $scope.LoanAccountId = $scope.SelectedLoan.FKLoanAccountId;
                  $scope.LoanDocuments = $scope.SelectedLoan.loanDocuments;
              })
          }
      }

      $scope.checkIsSalesAgent = function () {
          $scope.authRoles = $auth.authentication.roles;
          angular.forEach($scope.authRoles, function (value) {
              if (value.Role != null) {
                  if (value.Role.Name == "Sales Agent") {
                      $scope.isSalesAgent = true;
                  }
              }
          });
          if ($scope.isSalesAgent == false)
              $scope.getLoans();
          else
              $scope.SelectedLoanChanged(0);
      }
      $scope.Init();
  });







