'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:BorrowerDashboardControllerCtrl
 * @description
 * # BorrowerDashboardControllerCtrl
 */
angular.module('craditKartApp')
  .controller('application_business_detail', function ($scope, $auth, $state, $timeout, $http, CONSTANT, toastr, $location, $rootScope, productGroupRepository, constitutionTypeRepository, ownership_HeaderRepository, fCcategoryRepository, postalCodeRepository, loanAccountRepository, businessRepository, applicantRepository, $filter) {

      $scope.loanAmountString = 0;
      var PANSTATUS = {
          LOADING: "Loading",
          VERIFIED: "Verified",
          INITIAL: "Initial",
          WRONG: "Wrong",
          INVALID: "Invalid"
      }
      $scope.Init = function () {
          $scope.loanproductGroup();
          $scope.loadBusinessConstitution();
          $scope.loadBusinessOwnerships();
          $scope.loadFCCategory();
          loadBusinessForLoanAccount();
      }

      //when loan amount slider value change
      function slide(viewValue) {

          console.log("View Value", viewValue);
          var plainNumber;
          var modifiedResult;
          plainNumber = viewValue;
          var x = plainNumber;
          x = x.toString();
          var lastThree = x.substring(x.length - 3);
          var otherNumbers = x.substring(0, x.length - 3);
          if (otherNumbers != '')
              lastThree = ',' + lastThree;
          modifiedResult = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

          $scope.loanDetail.amountSlide = modifiedResult;
          $scope.loanDetail.amount = viewValue;
      }
      //get all products
      $scope.loanproductGroup = function () {
          productGroupRepository.GetAllFilter(function (callback) {
              $scope.ProductGroups = callback;
              console.log('productgroup', $scope.ProductGroups);
          })
      }

      //on pan number change
      $scope.validateBusinessPan = function (businessDetail) {
          //if (businessDetail == null)
          //    return;
          //if (businessDetail.PANCardNo != null) {
          //    if (businessDetail.PANCardNo.length == 10) {
          //        businessDetail.PanStatus = PANSTATUS.LOADING;
          //        panCardVerificationHubService.verify(businessDetail.PANCardNo, "", businessDetail.CompanyName);
          //    }
          //}

      }
      $scope.loadBusinessConstitution = function () {
          constitutionTypeRepository.GetAll(function (callback) {
              $scope.businessConstitutions = callback;
              console.log("Constitutions", $scope.businessConstitutions)
          })
      }
      $scope.loadBusinessOwnerships = function () {
          ownership_HeaderRepository.GetAll(function (callback) {
              $scope.businessOwnerships = callback;
              console.log("businessOwnerships", callback)
          })
      }

      //Pin code value change
      //$scope.getDataFromPin = function (postalCode) {
      //    if (postalCode.length == 6) {
      //        postalCodeRepository.GetByPostalCode(postalCode, function (callback) {
      //            debugger;
      //            console.log(callback);
      //            if (callback.length != null) {
      //                $scope.postalCode = callback;
      //                $scope.businessDetails.OffCity = $scope.postalCode.District;
      //                var firstLetter = ($scope.postalCode.State).charAt(0).toUpperCase();
      //                var stringWithoutFirstLetter = ($scope.postalCode.State).slice(1).toLowerCase();
      //                $scope.businessDetails.OffState = firstLetter + stringWithoutFirstLetter;
      //                $scope.businessDetails.FKPostalCodeId = $scope.postalCode.PostalId;
      //            } else {
      //                //$scope.Applicant.Business.OffPostalCode = "";
      //            }
      //        })
      //    }
      //}

      //product change
      $scope.productChanged = function (id) {
          //angular.forEach($scope.ProductGroups, function (productGroup, i) {
          //    angular.forEach(productGroup.productGroup, function (productitem, i) {
          //        console.log("product", productitem)
          //    })
          //  })
          console.log(id);
          $state.params.productId = id;
          $scope.loadProductById(id);
      }

      //pin code chnage
      $scope.getDataFromPin = function (postalCode) {
          if (postalCode.length == 6) {
              postalCodeRepository.GetFirstByPostalCode(postalCode, function (callback) {
                  console.log("postal code", callback);
                  if (callback != null) {
                      $scope.postalCode = callback;
                      $scope.businessDetails.OffCity = $scope.postalCode.District;
                      var firstLetter = ($scope.postalCode.State).charAt(0).toUpperCase();
                      var stringWithoutFirstLetter = ($scope.postalCode.State).slice(1).toLowerCase();
                      $scope.businessDetails.OffState = firstLetter + stringWithoutFirstLetter;
                      $scope.businessDetails.FKPostalCodeId = $scope.postalCode.PostalId;
                  } else {
                      //$scope.Applicant.Business.OffPostalCode = "";
                  }
              })
          }
      }

      $scope.loadFCCategory = function () {
          fCcategoryRepository.GetAll(function (callback) {
              $scope.FCCatgories = callback;
              console.log("loan fc category", callback)
          })
      }


      $scope.loadProductById = function (id) {
          angular.forEach($scope.ProductGroups, function (productGroup, i) {
              console.log("product group", $scope.ProductGroups)
              angular.forEach(productGroup.ProductList, function (productitem, i) {
                  console.log(productitem, "is is", id);
                  if (productitem.ID == id) {

                      console.log(productitem);
                      $scope.product = productitem;
                      $scope.loanDetail.amount = $scope.product.MinAmount;
                      if (!($scope.loanAccount.Amount > 0))
                          $scope.loanAccount.Amount = $scope.product.MinAmount;
                      $scope.loanAccount.FKProductId = $scope.product.ID;
                      //Get loan terms according to product
                      $scope.LoanTerms = [];
                      for (var i = $scope.product.MinLoanTerm; i <= $scope.product.MaxLoanTerm; i++) {
                          $scope.LoanTerms.push(i);
                      }
                      console.log("hittt");
                  }
              })
          })
      }

      //submit business constitution
      $scope.submitBusinessDetails = function (loanAccount, businessDetails, _isInValid) {

          console.log("LoanAccount", loanAccount)

          if ((businessDetails.IsPanVerified == true && businessDetails.ValidCompanyName == true) || (businessDetails.FKBusinessConstitutionId == 2) || true) {
              businessDetails.DOIncorporation = businessDetails.DOIncorporationMonth + "/" + businessDetails.DOIncorporationYear;


              console.log("Business Operating Since ", businessDetails.DOIncorporation);
              console.log("loan Amount", loanAccount.Amount, "product max amont", $scope.product.MaxAmount, "Product min amount", $scope.product.MinAmount);
              if (_isInValid || loanAccount.Amount > $scope.product.MaxAmount || loanAccount.Amount < $scope.product.MinAmount) {
                  $scope.ShowBusinessDtlError = true;
                  console.log("hit inside if")
              }
              else {
                  if (businessDetails.HasSameAddress) {
                      populateAddressFromBusiness(businessDetails);
                  }
                  if (businessDetails.BusinessId == null || businessDetails.BusinessId == 0) {


                      loanAccount.IsDraft = true;
                      loanAccount.FKLoanApplicationStatusId = 5;
                      loanAccount.IsInComplete = 1;
                      loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
                      loanAccountRepository.Save(loanAccount, function (callback) {
                          $scope.loanDetailsSaved = true;
                          $scope.loanAccount = callback;


                          if ($scope.loanDetailsSaved) {
                              console.log("loan account saved succesfully:", $scope.loanAccount, $scope.loanDetailsSaved);

                              businessRepository.Create(businessDetails, function (callback) {
                                  $scope.loanDetailsSaved = false;
                                  //Create an applicant as Logged In User by default so that we can track business by Applicant and we can change the details anyway in 
                                  //further step
                                  $scope.businessDetails = callback;
                                  var applicant = {
                                      IsMainApplicant: 1,
                                      FKBusinessId: callback.BusinessId,
                                      FKLoanAccountId: $scope.loanAccount.LoanAccountId,
                                      FKApplicantTypeId: 2 //Supporting only business loan so keeping it Hard Coded
                                  }
                                  applicantRepository.Save(applicant, function (applicantCallback) {
                                      GoToPersonDetail();
                                  })

                              })
                          }

                      })


                  }
                  else {
                      if ($state.params.Id) {
                          loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
                          loanAccountRepository.Update(loanAccount, function (callback) {
                              $scope.loanDetailsSaved = true;
                              $scope.loanAccount = callback;
                              console.log("$scope.loanAccount-Updated", loanAccount)

                              if ($scope.loanDetailsSaved) {
                                  businessRepository.Update(businessDetails, function (business) {
                                      applicantRepository.GetMainApplicantByLoanAccountId(parseInt($scope.loanAccount.LoanAccountId), function (callback) {
                                          $scope.loanDetailsSaved = false;
                                          if (callback != null && callback.ApplicantId > 0 && !(callback.FKBusinessId > 0)) {
                                              callback.FKBusinessId = business.BusinessId;
                                              applicantRepository.Update(callback, function (callback) {
                                                  GoToPersonDetail();
                                              })
                                          }
                                          else if (callback == null || !(callback.ApplicantId > 0)) {
                                              var applicant = {
                                                  IsMainApplicant: 1,
                                                  FKBusinessId: business.BusinessId,
                                                  FKLoanAccountId: $scope.loanAccount.LoanAccountId,
                                                  FKApplicantTypeId: 2 //Supporting only business loan so keeping it Hard Coded
                                              }
                                              applicantRepository.Save(applicant, function (applicantCallback) {
                                                  GoToPersonDetail();
                                              })
                                          }
                                          else
                                              GoToPersonDetail();

                                      })

                                  })
                              }
                          })

                      }
                      else {
                          loanAccountRepository.Save(loanAccount, function (callback) {
                              $scope.loanDetailsSaved = true;
                              $scope.loanAccount = callback;
                              console.log("loan account saved succesfully:", $scope.loanAccount, $scope.loanDetailsSaved);
                              if ($scope.loanDetailsSaved) {
                                  businessRepository.Update(businessDetails, function (business) {
                                      applicantRepository.GetMainApplicantByLoanAccountId(parseInt($scope.loanAccount.LoanAccountId), function (callback) {
                                          $scope.loanDetailsSaved = false;
                                          if (callback != null && callback.ApplicantId > 0 && !(callback.FKBusinessId > 0)) {
                                              callback.FKBusinessId = business.BusinessId;
                                              applicantRepository.Update(callback, function (callback) {
                                                  GoToPersonDetail();
                                              })
                                          }
                                          else if (callback == null || !(callback.ApplicantId > 0)) {
                                              var applicant = {
                                                  IsMainApplicant: 1,
                                                  FKBusinessId: business.BusinessId,
                                                  FKLoanAccountId: $scope.loanAccount.LoanAccountId,
                                                  FKApplicantTypeId: 2 //Supporting only business loan so keeping it Hard Coded
                                              }
                                              applicantRepository.Save(applicant, function (applicantCallback) {
                                                  GoToPersonDetail();
                                              })
                                          }
                                          else
                                              GoToPersonDetail();

                                      })

                                  })
                              }

                          })

                      }

                  }
              }
          }
      }
      //Checkbox event
      function populateAddressFromBusiness(businessDetail) {
          if (businessDetail.HasSameAddress) {
              //Copy address from business detail to ware house
              businessDetail.WarehoueAddressLine1 = businessDetail.OffAddressLine1;
              businessDetail.WarehoueAddressLine2 = businessDetail.OffAddressLine2;
              businessDetail.WarehoueCity = businessDetail.OffCity;
              businessDetail.WarehoueState = businessDetail.OffState;
              businessDetail.WarehouePostalCode = businessDetail.OffPostalCode;
          }
          else {
              businessDetail.WarehoueAddressLine1 = null;
              businessDetail.WarehoueAddressLine2 = null;
              businessDetail.WarehoueCity = null;
              businessDetail.WarehoueState = null;
              businessDetail.WarehouePostalCode = null;
          }
      }
      function GoToPersonDetail() {
          if (typeof (Storage) !== "undefined") {

              localStorage.setItem('businessDetail', JSON.stringify($scope.businessDetails));
              //document.getElementById("result").innerHTML = localStorage.getItem["audiourl"];
          }
          //$rootScope.businessDetail = $scope.businessDetail;
          $state.go('borrower.application.personal_details', { productId: $state.params.productId, Id: $scope.loanAccount.LoanAccountId });
          //manageLiner('step3');
      }

      function loadBusinessForLoanAccount() {
          if ($state.params.Id) {
              applicantRepository.GetMainApplicantBusinessByLoanAccountId($state.params.Id, function (callback) {

                  $scope.MainApplicant = callback;
                  if (callback.Business != null) {
                      console.log("Business Details", callback);
                      $scope.SelectedBusinessId = callback.Business.BusinessId;
                      $scope.loanAccount = callback.LoanAccount;
                      $scope.businessDetails = callback.Business;
                      $scope.businessDetails.PanStatus = $scope.businessDetails.IsPanVerified == true ? PANSTATUS.VERIFIED : PANSTATUS.WRONG;
                      $scope.businessDetails.VAT_Tin = parseInt(callback.Business.VAT_Tin);

                      $scope.businessDetails.HasStoreInMkt = $scope.businessDetails.HasStoreInMkt == true ? 1 : 0;
                      $scope.businessDetails.HasOverDraftAc = $scope.businessDetails.HasOverDraftAc == true ? 1 : 0;
                      $scope.businessDetails.HasPOSinOffice = $scope.businessDetails.HasPOSinOffice == true ? 1 : 0;
                      $scope.validateBusinessPan($scope.businessDetails);
                      if ($scope.businessDetails.DOIncorporation != null) {
                          $scope.businessDetails.DOIncorporation = new Date($scope.businessDetails.DOIncorporation);
                          $scope.businessDetails.DOIncorporationMonth = $scope.businessDetails.DOIncorporation.getMonth();
                          $scope.businessDetails.DOIncorporationYear = $scope.businessDetails.DOIncorporation.getFullYear();
                          $scope.businessDetails.DOIncorporationMonth++;

                      }
                      if ($scope.businessDetails.HasODLimit == true)
                          $scope.businessDetails.HasODLimit = 'true';
                      else
                          $scope.businessDetails.HasODLimit = 'false';



                  }
                  else if ($scope.businessDetails != null)
                      $scope.businessDetails.HasSameAddress = true;
                  $scope.loadProductById($scope.loanAccount.FKProductId);
              })


          }
      }
      $scope.$watchCollection('loanAccount.Amount', function () {

          $scope.loanAmountString = $filter('amount')($scope.loanAccount.Amount);
          $scope.loanAmountString = $scope.loanAmountString.toString().replace(".", " . ");
      });
      $scope.Init();
  });



