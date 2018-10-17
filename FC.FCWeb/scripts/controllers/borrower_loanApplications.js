'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:BorrowerDashboardControllerCtrl
 * @description
 * # BorrowerDashboardControllerCtrl
 */
angular.module('craditKartApp')
  .controller('borrower_loanApplications', function ($scope, $auth, $state, $timeout, $http, CONSTANT, toastr, $location, $rootScope, loanAccountRepository, loanDocumentRepository, loanActionRepository,
      businessRepository, adviceRepository, authTokenRepository, productGroupRepository, productRepository) {
      $scope.numberOfApplications = -1;
      $scope.loanApplicationCurrentPage = 1;
      $scope.applicationPerPage = 5;
      $scope.isSalesAgent = false;
      $scope.Init = function () {
          //get all loans
          $scope.getTotalNumberApplication();
          $scope.getApplications(1);

          $scope.isRenewButtonVisibile();
      }
      $scope.getTotalNumberApplication = function () {
          loanAccountRepository.getTotalApplicationCount($auth.authentication.personId, function (callback) {
              $scope.totalNumberOfApplication = callback;
              console.log("totla applications", $scope.totalNumberOfApplication)
          })
      }

      $scope.showRenewPopUp = function (loanApplication) {
          $scope.loanProductGroup();
          loanAccountRepository.GetLoanAccount(loanApplication.LoanAccountId, function (result) {
              $scope.choosedRenewAccount = result;
              $('#renewLoan').modal('show');
              $scope.productChanged(loanApplication.FKProductId);

          })

      }
      $scope.productChanged = function (id) {

          productRepository.GetById(id, function (callback) {
              console.log("Product By Id", callback)
              $scope.renewLoanAccountProduct = callback;
              console.log();
              $scope.choosedRenewAccount.Amount = callback.MinAmount;
              $scope.choosedRenewAccount.FKProductId = callback.ProductId;
          })
      }
      //Renew loan application
      $scope.loanProductGroup = function () {
          productGroupRepository.GetAll($state.params.productId, function (callback) {
              $scope.ProductGroups = callback;
              console.log('productgroup', $scope.ProductGroups);
          })
      }
      //get all loan aplications
      $scope.getApplications = function (loanApplicationCurrentPage) {

          console.log("Applications hit", loanApplicationCurrentPage)
          $scope.numberOfApplications = -1;
          var begin = (loanApplicationCurrentPage - 1) * $scope.applicationPerPage;
          var end = $scope.applicationPerPage;
          $scope.applications = [];
          if ($auth.isAuthenticated()) {
              loanAccountRepository.GetApplicationsTimeLineDtl($auth.authentication.personId, begin, end, function (loanApplications) {
                  $scope.applications = loanApplications;
                  $scope.totalApplications = $scope.applications.length;
              })
          }
      }

      //Search From All the Applications
      $scope.searchFromApplications = function (searchText, currentPage, pageSize) {

          $scope.request = {
              SearchText: searchText,
              CustomId: $auth.authentication.personId,
              CurrentPage: currentPage,
              PageSize: pageSize
          };

          if (searchText) {
              loanAccountRepository.searchFromApplicationsCount($scope.request, function (callback) {
                  $scope.numberOfApplications = callback;
                  if ($scope.numberOfApplications > 0)
                      loanAccountRepository.searchFromApplications($scope.request, function (loanApplications) {
                          $scope.applications = loanApplications;

                      })
              })
          }
          else
              $scope.getApplications($scope.loanApplicationCurrentPage);
          console.log("searchFromApplications");
      }

      $scope.uploadOfferLetter = function (loan) {
          $('#uploadOfferLetter').modal('show');
          $scope.LoanAccountId = loan.LoanAccountId;
          $scope.ProductId = loan.FKProductId;
          $scope.LoanAccount = loan;
          viewSanctionLetter();
      }





      $scope.viewSanctionLetter = function (loan) {
          $('#viewSanctionLetter').modal('show');
          $scope.LoanAccountId = loan.LoanAccountId;
          $scope.ProductId = loan.FKProductId;
          $scope.LoanAccount = loan;
          viewSanctionLetter();
      }


      //Upload Document
      $scope.ManageLoanAction = function (loanAccount, loanAction) {
          var template = "";
          $scope.LoanAccount = loanAccount;
          $scope.LoanAccountId = loanAccount.LoanAccountId;
          $scope.ProductId = loanAccount.FKProductId;
          template = loanAction.LoanActionType.templateUrl;
          $scope.SelectedLoanActionId = loanAction.LoanActionId;

          //console.log("loanAction", loanAction);
          switch (template) {
              case '#upldDoc':
                  {
                      $scope.OpenUploadDocLA(loanAccount);
                      break;
                  }
              case '#viewSanctionLetter':
                  {
                      $scope.viewSanctionLetter(loanAccount);
                      break;
                  }
              case '#uploadOfferLetter':
                  {
                      $(template).modal('show');
                      break;
                  }
          }


      }

      function GetDocument(AdviceId) {
          loanActionRepository.GetAdviceLetter($scope.LoanAccountId, AdviceId, 0, 0, function (callback) {
              var newTag = "<object data='data:" + callback.DocType + ";base64, " + callback.data + "' type='" + callback.DocType + "' style='width: 840px;height: 500px;margin-left: 5px;'></object>"
              $('#ViewSactionLetter').html(newTag);
              $scope.imgData = callback.data;
          })
      }


      $scope.OfferAcceptedByBorrower = function () {
          loanAccountRepository.OfferAcceptedByBorrower($scope.LoanAccount.LoanAccountId, function (callback) {
              //$scope.SaveOfferLetter();
              $scope.CloseDocPopup();
              $scope.getApplications(1);
          })
      }

      //View sanctioned letter
      function viewSanctionLetter() {
          $scope.Status = "Not Included";
          $scope.loading = true;
          loanDocumentRepository.GetSanctionedLetterLoanDoc($scope.LoanAccountId, function (callback) {
              $scope.LoanDocuments = callback;
              loanAccountRepository.GetLoanAccount($scope.LoanAccountId, function (callback) {
                  $scope.LoanData = callback;
                  console.log("$scope.LoanData", $scope.LoanData);

                  //Get Mainapplicant business Dtails
                  businessRepository.GetMainApplicantBusiness($scope.LoanAccountId, function (callback) {
                      $scope.Business = callback;

                      adviceRepository.GetByProduct($scope.ProductId, function (callback) {
                          $scope.Advices = callback;
                          angular.forEach($scope.Advices, function (adv, i) {
                              if (adv.FKAdviceTypeId == 9) {
                                  GetDocument(adv.AdviceId);
                                  $scope.docType = "Sanction Letter";
                              }
                          })

                          angular.forEach($scope.LoanDocuments, function (loanDoc, i) {
                              if (loanDoc.FKDocumentTypeId == 18) {
                                  if (loanDoc.IsDocSent)
                                      $scope.Status = "Sent to Borrower";
                                  else if (loanDoc.IsIncluded)
                                      $scope.Status = "Included";
                              }
                          })
                          $scope.loading = false;
                      })
                  })
              })
          })
      }

      //Renew Loan Application
      $scope.RenewLoanApplication = function (loanApplication) {

          console.log("role", $auth.authentication.roles);

          if ($scope.choosedRenewAccount.Amount > $scope.renewLoanAccountProduct.MaxAmount || $scope.choosedRenewAccount.Amount < $scope.renewLoanAccountProduct.MinAmount) {
              return;
          }
          loanAccountRepository.renewApplication($scope.choosedRenewAccount, function (result) {
              console.log("after renew result", result);
              $scope.getApplications(1);
              $scope.CloseDocPopup();
          })
      }


      $scope.isRenewButtonVisibile = function () {
          $scope.authRoles = $auth.authentication.roles;
          angular.forEach($scope.authRoles, function (value) {
              if (value.Role != null) {
                  if (value.Role.Name == "Sales Agent") {
                      $scope.isSalesAgent = true;
                  }
              }
          });
      }
      $scope.CloseApplication = function (loanId) {
          loanAccountRepository.UpdateLoanApplicationStatu(loanId, 'Closed', function () {
              $scope.getApplications(1);
              console.log("CloseApplication");

          })
      }

      //close all pop up
      $scope.CloseDocPopup = function () {
          $('#upldDoc').modal('hide');
          $('#viewSanctionLetter').modal('hide');
          $('#uploadOfferLetter').modal('hide');
          $('#renewLoan').modal('hide');

      }

      $scope.SaveDocument = function () {

          loanDocumentRepository.IsReqDoc_Uploaded_CV($scope.LoanAccount.LoanAccountId, function (callback) {
              console.log("callback", callback);
              if (callback == true) {
                  $('#upldDoc').modal('hide');
                  //if ($scope.LoanAccount.HasApplied == true) {
                  //loanActionRepository.HideUploadDocLA_Borrower($scope.LoanAccount.LoanAccountId, function (callback) {
                  //    $('#upldDoc').modal('hide');
                  //    location.reload();
                  //})
                  $scope.getApplications(1);
              }
              else {
                  $('#upldDoc').modal('hide');
                  // location.reload();
              }
          })

      }

      //Accept offer
      $scope.SaveOfferLetter = function () {


          loanAccountRepository.GetLoanAccount($scope.LoanAccount.LoanAccountId, function (res) {
              $scope.ResLoanAcc = res;
              $scope.ResLoanAcc.IsAccepted_OL = 'Y';
              // loanActionRepository.CompleteAllLA_Doc($scope.LoanAccount.LoanAccountId, function () {
              loanAccountRepository.Update($scope.ResLoanAcc, function (call1) {
                  $scope.CloseDocPopup();
                  $scope.getApplications(1);
                  //loanActionRepository.GetFilterList("GetAllByLoanId", $scope.LoanAccount.LoanAccountId, function (callback) {
                  //    if (callback != null && callback.length > 0) {
                  //        angular.forEach(callback, function (LoanAction, index) {
                  //            if (LoanAction.FKLoanActionTypeId == 22) {
                  //                LoanAction.IsVisible = true;
                  //                LoanAction.FKLoanActionStatusId = 1;
                  //                LoanAction.LoanActionStatu = null;
                  //                LoanAction.Description = $scope.Description;
                  //                loanActionRepository.Update(LoanAction, function (loanAction) {
                  //                    if (index == callback.length - 1) {
                  //                        $scope.getApplications(1);
                  //                        console.log("loanAction repository if");
                  //                        $scope.CloseDocPopup();
                  //                    }
                  //                })
                  //            }
                  //            else {
                  //                if (index == callback.length - 1) {
                  //                    $scope.getApplications(1);
                  //                    console.log("loanAction repository else");
                  //                    $scope.CloseDocPopup();
                  //                }
                  //            }
                  //        });
                  //    }
                  //})
                  //  });
              })
          })
      }
      $scope.Init();
  });



