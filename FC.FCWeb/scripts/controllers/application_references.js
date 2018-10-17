'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:BorrowerDashboardControllerCtrlcheckforBorrower
 * @description
 * # BorrowerDashboardControllerCtrl
 */
angular.module('craditKartApp')
  .controller('application_references', function ($scope, $auth, $state, $timeout, $http, CONSTANT, toastr, $location, $rootScope, onlineSellerRepository, onlinePlatformSellerRepository, salesChannelRepository, loanApplicationStatusRepository, productRepository, notificationRepository, businessRepository, loanAccountRepository, loanDocumentRepository, loanActionRepository) {
      $scope.Init = function () {
          // $scope.checkforBorrower();
          console.log("is Borrower", $scope.isBorrower);

          if (typeof (Storage) !== "undefined") {
              var business = localStorage['businessDetail'];
              $scope.businessDetails = JSON.parse(business);
              $scope.businessDetails.IsLiveOnPlatform = $scope.businessDetails.IsLiveOnPlatform != null ? $scope.businessDetails.IsLiveOnPlatform : false;
          }
          onlineSeller();
          $scope.GetSalesChannelDetail();
          $scope.GetLoanAccountStatus();
          $scope.GetPreciseName();
      }

      // Get PreciseName by product Id
      $scope.GetPreciseName = function () {
          productRepository.GetPreciseNameById($state.params.productId, function (result) {
              console.log("product PreciseName", result);
              $scope.productPreciseName = result;

          })
      }
      $scope.GetLoanAccountStatus = function () {
          loanApplicationStatusRepository.GetByLoanAccount($state.params.Id, function (result) {
              $scope.loanAccountStatus = result;
              console.log("LoanAccountStatus", result)

          })
      }

      $scope.PosMachines = function (hasMachine) {
          var salesChannel;
          angular.forEach($scope.SalesChannels, function (salesCannel) {
              if (salesCannel.Name == 'POS/EDC Machines') {
                  salesChannel = salesCannel;
              }
          })
          if (hasMachine == true || hasMachine == 'true')
              salesChannel.Selected = true;
          else
              salesChannel.Selected = false;

          $scope.UpdateFinancialData(salesChannel, null);
      }
      function onlineSeller() {
          //$scope.roleName = $rootScope.loggedInUser.roles[0].Role.Name;
          onlineSellerRepository.GetByProductId($state.params.productId, function (callback) {

              $scope.OnlineSellers = callback;
              console.log("Online seller plateform data", callback)
          })
      }

      $scope.ManageOfflineStore = function (stores) {
          var salesChannel;
          angular.forEach($scope.SalesChannels, function (salesCannel) {
              if (salesCannel.Name == 'Offline Retail Store') {
                  salesChannel = salesCannel;
              }
          })
          if (stores > 0)
              salesChannel.Selected = true;
          else {
              salesChannel.Selected = false;
              $scope.PosMachines(false);
          }
          $scope.UpdateFinancialData(salesChannel, null);
      }
      //sales channel detail
      $scope.GetSalesChannelDetail = function () {
          salesChannelRepository.GetAll(function (callback) {
              $scope.SalesChannels = callback;
              console.log("sales channel", $scope.SalesChannels);
          })
      }
      $scope.UpdateFinancialData = function (salesChannel, onlineSeller) {
          var found = false;
          var index = 0;
          var PlatformId = 0;
          var SalesChannelId = 0;

          if (!($scope.businessDetails.PlatformInfo != null))
              $scope.businessDetails.PlatformInfo = [];

          if (onlineSeller != null) {
              angular.forEach($scope.businessDetails.PlatformInfo, function (seller) {
                  if (!found)
                      if (seller.FKPlatformId == onlineSeller.OrganizationId) {
                          found = true;
                          index = $scope.businessDetails.PlatformInfo.indexOf(seller);
                          PlatformId = seller.PlatformSellerId;
                      }
              })

              if (found) {
                  if (onlineSeller.Selected == false) {
                      if (PlatformId > 0)
                          onlinePlatformSellerRepository.Delete(PlatformId, function (callback) {
                              $scope.businessDetails.PlatformInfo.splice(index, 1);
                          })

                      else
                          $scope.businessDetails.PlatformInfo.splice(index, 1);
                  }
              }
              else {
                  $scope.businessDetails.PlatformInfo.push({
                      FKPlatformId: onlineSeller.OrganizationId,
                      FKBusinessId: parseInt($scope.businessDetails.BusinessId),
                       Organization: onlineSeller,
                      Year: null,
                      Month: null,
                      MerchantId: null,
                      SalesInLastThreeMonth: null
                  })
              }
          }
              // By Sales Channels
          else {
              var SelectedOnlieSellerPltfId = 0;
              angular.forEach($scope.businessDetails.PlatformInfo, function (seller) {
                  if (!found)
                      if (seller.FKSalesChannelId == salesChannel.SalesChannelId) {
                          found = true;
                          SalesChannelId = salesChannel.SalesChannelId;
                          SelectedOnlieSellerPltfId = seller.PlatformSellerId;
                          index = $scope.businessDetails.PlatformInfo.indexOf(seller);
                      }
              })

              if (found) {
                  if (salesChannel.Selected == false) {
                      if (SelectedOnlieSellerPltfId > 0)
                          onlinePlatformSellerRepository.Delete(SelectedOnlieSellerPltfId, function (callback) {
                              $scope.businessDetails.PlatformInfo.splice(index, 1);
                          });

                      else
                          $scope.businessDetails.PlatformInfo.splice(index, 1);
                  }
              }
              else if (salesChannel.Selected == true) {
                  $scope.businessDetails.PlatformInfo.push({
                      FKSalesChannelId: salesChannel.SalesChannelId,
                      FKBusinessId: parseInt($scope.businessDetails.BusinessId),
                      Organization: salesChannel,
                      Year: null,
                      Month: null,
                      MerchantId: null,
                      SalesInLastThreeMonth: null
                  })
              }
          }
      }

      $scope.finalSubmitApplication = function (isvalid) {
          if (isvalid) {
              loanDocumentRepository.IsReqDoc_Uploaded_CV($state.params.Id, function (callback) {
                  console.log("callback", callback);
                  if (callback == true) {
                      //loanActionRepository.HideBorrowerLA_IV($state.params.Id, function (callback) {
                      //    window.location.href = "#/borrower/dashboard/applications";
                      //})
                      window.location.href = "#/borrower/dashboard/applications";
                  }
                  else
                      window.location.href = "#/borrower/dashboard/applications";

              });
          }
      }

      $scope.submitReferences = function (isvalid) {

          console.log(isvalid);
          if (isvalid) {


              $scope.loanAccount.LoanAccountId = $state.params.Id;
              loanAccountRepository.UpdateReferencePage($scope.loanAccount, function () {
                  businessRepository.Update($scope.businessDetails, function (result) {
                      console.log("business detail", result)

                      notificationRepository.Add_UploadDoc($rootScope.loggedInUser.personId, $state.params.Id, function (callback) {
                          if ($scope.businessDetails.PlatformInfo == null) {
                              $('#finalSubmit').modal('show');
                              return;
                          }
                          if ($scope.businessDetails.PlatformInfo.length > 0) {
                              onlinePlatformSellerRepository.Update($scope.businessDetails.PlatformInfo, function (callback) {
                                  $('#finalSubmit').modal('show');
                              })
                          } else
                              $('#finalSubmit').modal('show');

                      });
                  })
              })
          }
          else {
              $scope.errorForRefrence = true;
          }
      }


      $scope.ManageWebsite = function (isValid) {
          var salesChannel;
          angular.forEach($scope.SalesChannels, function (salesCannel) {
              if (salesCannel.Name == 'Own Website') {
                  salesChannel = salesCannel;
              }
          })
          if (isValid && $scope.businessDetails.WebSiteUrl != null && $scope.businessDetails.WebSiteUrl.length > 0)
              salesChannel.Selected = true;
          else
              salesChannel.Selected = false;

          $scope.UpdateFinancialData(salesChannel, null);
      }
      $scope.Init();
  });



