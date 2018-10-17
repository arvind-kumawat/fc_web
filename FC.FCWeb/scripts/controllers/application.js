'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('ApplicationCtrl', function ($rootScope, $auth, $scope, toastr, $timeout, $state, $http, $location, CONSTANT, $routeParams, $window, Upload, CommonService, loanPurposeRepository,
      loanAccountRepository, productRepository, applicantRepository, constitutionTypeRepository, businessNatureRepository, businessIndustryRepository, ownershipRepository,
      bankRepository, postalCodeRepository, businessRepository, ownerQualificationRepository, maritalstatusRepository, personRepository, documentRepository, loanDocumentRepository,
      productDocumentTypeRepository, documentCategoryRepository, loanActionRepository, logRepository, documentTypeRepository, fCcategoryRepository, designationRepository, productBusinessNatureRepository,
      PlatformMonthlyDetailRepository, onlineSellerRepository, notificationRepository, businessDetailOnlineSellerRepository, onlinePlatformSellerRepository, $filter, salesChannelRepository, productGroupRepository,
      ownership_HeaderRepository, AUTH_DATA, personRoleRepository) {
      /*-------------------Service to get options list----------------------------*/

      /*--------------VARIABLE DECLARATIONS/INITIALIZATION---------------------------------------*/
      $scope.loanDetail = {};
      $scope.loanAccount = {}
      if (!$state.params.id) {
          $scope.loanDetail.amount = 0;
          $scope.loanAccount.Amount = 0;
          //$scope.loanAmountString = 0;
          $scope.loanAccount.FKBorrowerId = '';
          $scope.loanAccount.IsActive = true;
          //$scope.loanDetail.amountSlide = '50,000';
      }
      //$scope.$watchCollection('loanAccount.Amount', function () {
      //    $scope.loanAmountString = $filter('amount')($scope.loanAccount.Amount);
      //    $scope.loanAmountString = $scope.loanAmountString.toString().replace(".", " . ");
      //});
      $scope.OptionYesNo = [
    { id: true, name: 'Yes' },
    { id: false, name: 'No' },
      ];


      $scope.monthsDropDownOptions = [{ id: 1, Month: 'Jan' },
             { id: 2, Month: 'Feb' },
             { id: 3, Month: 'March' },
             { id: 4, Month: 'April' },
             { id: 5, Month: 'May' },
             { id: 6, Month: 'Jun' },
             { id: 7, Month: 'July' },
             { id: 8, Month: 'Aug' },
             { id: 9, Month: 'Sep' },
             { id: 10, Month: 'Oct' },
             { id: 11, Month: 'Nov' },
             { id: 12, Month: 'Dec' }
      ]
      $scope.range = function (source) {

          //if (source == 'month') {
          //    var start = 1;
          //    var end = 12;
          //}
          //else
          if (source == 'year') {
              var curYear = new Date().getFullYear();

              var start = curYear - 50;
              var end = curYear;

          }

          var result = [];
          for (var i = end; i >= start; i--) {
              result.push(i);
          }
          return result;
      };

      $scope.Person = {
          Name: '', FirstName: '', MiddleName: '', LastName: '', FatherName: '', Gender: '', DOB: '', FKOwnerQualificationId: '', FKMaritalStatusId: '',
          NoOfDependent: '', PanNumber: '', adhaarCardNumber: '', OwnershipPer: '', SameAsBusinessAddress: '', AddressLine1: '', AddressLine2: '',
          Landmark: '', Pincode: '', CityName: '', State: '', WorkPhone: '', MobilePhone: '', EmailId: '', FkOwnerShipId: '', Samelocationresidence: true,
          AddressLine1_Permanent1: '', AddressLine1_Permanent2: '', Pin_Permanent: '', City_Permanent: '', State_Permanent: '', FKOwerShip_Prmnt_Id: '',
          PhoneNumber_Permanent: '', MobilePhone_Permanent: '', EmailId_Permanent: '',
      }



      //$scope.regex = '/^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$/';


      /****************************** PAN CARD VERIFICATION *****************************/

      var PANSTATUS = {
          LOADING: "Loading",
          VERIFIED: "Verified",
          INITIAL: "Initial",
          WRONG: "Wrong",
          INVALID: "Invalid"
      }

      $scope.PANSTATUS = PANSTATUS;

      //function startPanVerificationHub() {
      //    panCardVerificationHubService.initialize();
      //}

      //function isValidBusinessPAN() {
      //    $scope.validateBusinessPan($scope.businessDetails);
      //}

      $scope.IsValidBusinessPAN = function () {
          isValidBusinessPAN();
      }

      //$scope.validateBusinessPan = function (businessDetail) {
      //    if (businessDetail.PANCardNo != null) {
      //        if (businessDetail.PANCardNo.length == 10) {
      //            businessDetail.PanStatus = PANSTATUS.LOADING;
      //            panCardVerificationHubService.verify(businessDetail.PANCardNo, "", businessDetail.CompanyName);
      //        }
      //    }

      //}

      $scope.CompanyNameChanged = function () {
          $scope.businessDetails.ValidCompanyName = true;
      }

      $scope.BusinessPanNumberChanged = function (businessDetail) {
          businessDetail.PanStatus = PANSTATUS.INITIAL;
      }

      function getConstitutionById(id) {
          for (var i = 0; i < $scope.businessConstitutions.length; i++) {
              if ($scope.businessConstitutions[i].BusinessConstitutionId == id) {
                  return $scope.businessConstitutions[i];
              }
          }
      }

      //$scope.$on(INTEGRATIONS.PAN_CARD_VERIFY_EVENTS.VERIFIED, function (evt, args) {
      //    debugger;
      //    $scope.businessPanVerificationData = args;
      //    console.log("PAN", args);
      //    if (args.PanStatus == true) {
      //        $scope.businessDetails.PanStatus = PANSTATUS.VERIFIED;
      //        $scope.businessDetails.IsPanVerified = true;
      //        $scope.businessDetails.ValidCompanyName = args.LastNameMatched;
      //    }
      //    else {
      //        $scope.businessDetails.PanStatus = PANSTATUS.WRONG;
      //        $scope.businessDetails.IsPanVerified = false;
      //        $scope.businessDetails.ValidCompanyName = true;
      //    }
      //    $scope.$apply();
      //    updateApplicantPanStatus(args.PanNumber, args.PanStatus, args)
      //})

      function updateApplicantPanStatus(PAN, status, args) {
          if ($scope.applicantsArray) {
              for (var i = 0; i < $scope.applicantsArray.length; i++) {
                  if ($scope.applicantsArray[i].Person.PanNumber == PAN) {
                      if (status == true) {
                          $scope.applicantsArray[i].PanStatus = PANSTATUS.VERIFIED;
                          $scope.applicantsArray[i].Person.IsPanVerified = true;
                          $scope.applicantsArray[i].ValidFirstName = args.FirstNameMatched;
                          $scope.applicantsArray[i].ValidLastName = args.LastNameMatched;
                          $scope.$apply();
                      }
                      else {
                          $scope.applicantsArray[i].PanStatus = PANSTATUS.WRONG;
                          $scope.applicantsArray[i].Person.IsPanVerified = false;
                          $scope.applicantsArray[i].ValidFirstName = args.FirstNameMatched;
                          $scope.applicantsArray[i].ValidLastName = args.LastNameMatched;
                          $scope.$apply();
                      }
                  }
              }
          }
          else {
              $scope.businessDetails.PanStatus = PANSTATUS.WRONG;
              $scope.businessDetails.IsPanVerified = false;
          }
      }



      /****************************** PAN CARD VERIFICATION END *************************/

      /****************************** PAN CARD VERIFICATION FOR APPLICANTS *****************************/

      function isValidApplicantPan(applicant) {
          $scope.validateApplicantPan(applicant);
      }


      $scope.IsValidApplicantPAN = function (applicant) {
          isValidApplicantPan(applicant);
      }

      $scope.validateApplicantPan = function (applicantDetail) {
          //panCardVerificationHubService.initialize();
          //if (applicantDetail.Person.PanNumber != null) {
          //    if (applicantDetail.Person.PanNumber.length == 10) {
          //        console.log(applicantDetail.Person.PanNumber)
          //        applicantDetail.PanStatus = PANSTATUS.LOADING;
          //        panCardVerificationHubService.verify(applicantDetail.Person.PanNumber, applicantDetail.Person.FirstName, applicantDetail.Person.LastName);
          //    }
          //}

      }

      $scope.FirstNameChanged = function (applicant) {
          applicant.ValidFirstName = true;
      }

      $scope.LastNameChanged = function (applicant) {
          applicant.ValidLastName = true;
      }

      $scope.ApplicantPanNumberChanged = function (applicantDetail) {

          applicantDetail.PanStatus = PANSTATUS.INITIAL;
      }
      $scope.checkforBorrower = function () {
       
          $scope.isBorrower = false;
          //console.log("hit per verification", personId)
          personRoleRepository.CheckForBorrower($rootScope.loggedInUser.personId, function (callback) {
              $scope.isBorrower = callback;

          })
          //$scope.isBorrower = false;

          //$scope.authRoles = $auth.authentication.roles;
          //angular.forEach($scope.authRoles, function (value) {
          //    if (value.Role != null) {
          //        if (value.Role.Name == "Borrower") {
          //            $scope.isBorrower = true;
          //        }
          //    }
          //});

      }

      $scope.Init = function () {
          //check is person is borrower or not
          $scope.checkforBorrower();
      }
      /****************************** PAN CARD VERIFICATION FOR APPLICANTS END *************************/

      $scope.applicationTabs = {};
      $scope.applicationCompletedTabs = {};
      $scope.ExistingBusiness = [];
      $scope.colorValue = false;
      $scope.ShowBusinessDtlError = false;
      $scope.ShowPersonDtlError = false;
      $scope.ShowLoanDtlError = false;
      $scope.HasExistingBusiness = false;
      $scope.UpdateExistingBusiness = false;

      $scope.loanDetailCompleted = false;
      $scope.businessDetailCompleted = false;
      $scope.partnerDetailsCompleted = false;
      $scope.referenceDtlCompleted = false;
      $scope.documentUploadCompleted = false;

      $scope.OnlineSellerSelected = false;
      $scope.OwnWebsiteSelected = false;
      $scope.OfflineRetailStore = false;

      $scope.Years = []
      var date = new Date();
      var year = date.getFullYear();
      for (var i = 1980; i <= year ; i++) {
          $scope.Years.push(
              $scope.Year = {
                  Year: i,
                  Value: i
              })
      }

      $scope.IsAgeValidated = true;
      $scope.SelectedBusinessId;
      if ($state.current.name) {
          if ($state.current.name == 'borrower.application.loan_details') {
              manageLiner('step1');
          }
          if ($state.current.name == 'borrower.application.business_details') {
              manageLiner('step2');
          }
          if ($state.current.name == 'borrower.application.personal_details') {
              manageLiner('step3');
          }
          if ($state.current.name == 'borrower.application.employer_details') {
              manageLiner('step3');
          }
          if ($state.current.name == 'borrower.application.references') {
              manageLiner('step4');
          }
          if ($state.current.name == 'borrower.application.uploads') {
              manageLiner('step5');
          }
      }




      function Init_Function_CallWhenStateChange() {
          $scope.checkforBorrower($rootScope.loggedInUser.personId);
          //if ($rootScope.loggedInUser.personId != null)
          //    getPersonByPersonId($rootScope.loggedInUser.personId);
          ///*------------------- When page refreshes ------------*/
          //if ($state.current.name == "borrower.application.loan_details") {
          //    //init();
          //}
          //else if ($state.current.name == "borrower.application.business_details") {
          //    loadDefaultValuesForBusiness();
          //    //Get Aplicant by loan accoungt so that we can get existing business
          //    loadBusinessForLoanAccount();
          ////}
          //else if ($state.current.name == "borrower.application.personal_details") {
          //    loadDefaultValuesForPersonalInfo();
          //    loadMaritalStatus();
          //    loadQualifications();
          //    //loadBusinessOwnerships();
          //} else if ($state.current.name == "borrower.application.references") {
          //    onlineSeller();
          //    loanrefrenceDetails();
          //}
          //else if ($state.current.name == "borrower.application.uploads") {
          //    loadDefaultDocuments();
          //    //loadBusinessForLoanAccount();
          //}
          /*------------------- / When page refreshes ------------*/


          /*------------------------- Calling related values in state change ---------------------*/
      }



      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
          Init_Function();
      });
      function Init_Function() {

          if ($state.current.name) {
              if ($state.current.name == 'borrower.application.loan_details') {
                  manageLiner('step1');
              }
              if ($state.current.name == 'borrower.application.business_details') {
                  manageLiner('step2');
              }
              //if ($state.current.name == 'borrower.application.employer_details' || $state.current.name == 'borrower.application.partner_details' || ($state.current.name == 'borrower.application.personal_details' && $scope.loanDetail && $scope.loanDetail.entityType != 'Salaried Professional' && $scope.loanDetail.typeOfLoan == 'Personal')) {
              //    manageLiner('step3', true);
              //}
              if ($state.current.name == 'borrower.application.personal_details') {
                  manageLiner('step3');
              }
              if ($state.current.name == 'borrower.application.references') {

                  manageLiner('step4');

              }
              if ($state.current.name == 'borrower.application.uploads') {
                  manageLiner('step5');
              }
          }






          //if ($state.current.name == "borrower.application.personal_details") {
          //    //Create array for the list of applicants
          //    loadDefaultValuesForPersonalInfo();
          //    loadQualifications();
          //    loadMaritalStatus();
          //    loadBusinessOwnerships();
          //}
          //else if ($state.current.name == "borrower.application.references") {
          //    loanrefrenceDetails();
          //}
          //else if ($state.current.name == "borrower.application.uploads") {
          //    loadDefaultDocuments();
          //    //loadBusinessForLoanAccount();
          //    //loadBanks();
          //}
          //Get Aplicant by loan accoungt so that we can get existing business
      }

      /*------------------ / Calling related values in state change ----------------*/


      /*-------------------- Step 1 --------------------------*/
      //function loadLoanPurposes() {
      //    loanPurposeRepository.GetAll(function (callback) {
      //        $scope.LoanPurposes = callback;
      //    })
      //}

      //function loadProductById(id) {
      //    angular.forEach($scope.ProductGroups, function (productGroup, i) {
      //        console.log("product group", $scope.ProductGroups)
      //        angular.forEach(productGroup.ProductList, function (productitem, i) {
      //            console.log(productitem, "is is", id);
      //            if (productitem.ID == id) {
      //                console.log(productitem);
      //                $scope.product = productitem;
      //                $scope.loanDetail.amount = $scope.product.MinAmount;
      //                $scope.loanAccount.Amount = $scope.product.MinAmount;
      //                $scope.loanAccount.FKProductId = $scope.product.ID;
      //                //Get loan terms according to product
      //                $scope.LoanTerms = [];
      //                for (var i = $scope.product.MinLoanTerm; i <= $scope.product.MaxLoanTerm; i++) {
      //                    $scope.LoanTerms.push(i);
      //                }
      //                console.log("hittt");
      //            }
      //        })
      //    })



      //    //productRepository.GetById(id, function (callback) {
      //    //    console.log("Product By Id", callback)
      //    //    $scope.product = callback;
      //    //    $scope.loanDetail.amount = $scope.product.MinAmount;
      //    //    $scope.loanAccount.Amount = $scope.product.MinAmount;
      //    //    $scope.loanAccount.FKProductId = $scope.product.ProductId;
      //    //    //Get loan terms according to product
      //    //    $scope.LoanTerms = [];
      //    //    for (var i = $scope.product.MinLoanTerm; i <= $scope.product.MaxLoanTerm; i++) {
      //    //        $scope.LoanTerms.push(i);
      //    //    }


      //    //})
      //}



      //function loadProducts() {
      //    productRepository.Get(function (callback) {
      //        console.log(callback);
      //        $scope.products = callback;
      //    })
      //}

      function loadProductBusinessNature() {
          productBusinessNatureRepository.GetAll(function (callback) {
              $scope.ProductBusinessNatures = callback;
              console.log("Product_business Nature", callback)
          })
      }

      //function loadLoanAccountById(id) {

      //    loadLoanPurposes();
      //    if ($scope.loanAccount.FKProductId) {
      //        loadProductById($scope.loanAccount.FKProductId);
      //    }
      //    else {
      //        loadProductById($state.params.productId);
      //    }

      //    if (id) {
      //        loanAccountRepository.getById(id, function (callback) {
      //            callback.FKProductId += "";
      //            $scope.loanAccount = callback;

      //            console.log('$scope.loanAccount', $scope.loanAccount);
      //        })

      //    }



      //}

      //$scope.productChanged = function (id) {
      //    //angular.forEach($scope.ProductGroups, function (productGroup, i) {
      //    //    angular.forEach(productGroup.productGroup, function (productitem, i) {
      //    //        console.log("product", productitem)
      //    //    })
      //    //  })
      //    console.log(id);
      //    $state.params.productId = id;
      //    loadProductById(id);
      //}

      //$scope.submitLoanDetails = function (loanAccount, IsInValid) {

      //    if (IsInValid) {
      //        $scope.ShowLoanDtlError = true;
      //    } else {
      //        $scope.ShowLoanDtlError = false;
      //        if ($state.params.Id) {
      //            loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
      //            loanAccountRepository.Update(loanAccount, function (callback) {
      //                $scope.loanAccount = callback;
      //                $state.go('borrower.application.business_details', { productId: $state.params.productId, Id: $scope.loanAccount.LoanAccountId });
      //                manageLiner('step2');
      //            })
      //        }
      //        else {businessDetails.Business_Contact_Mobile
      //            loanAccount.IsDraft = true;
      //            loanAccount.FKLoanApplicationStatusId = 5;
      //            loanAccount.IsInComplete = 1;
      //            loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
      //            loanAccountRepository.Save(loanAccount, function (callback) {
      //                $scope.loanAccount = callback;
      //                $state.go('borrower.application.business_details', { productId: $state.params.productId, Id: $scope.loanAccount.LoanAccountId });
      //                manageLiner('step2');
      //            })
      //        }
      //    }
      //}

      /*--------------------/ Step 1 --------------------------*/

      /*-------------------- Step 2 -------------------------*/

      function linkAccount(externalId) {
          $scope.AlreadyLinked = false;
          for (var i = 0; i < $scope.applicantsArray.length; i++) {
              if ($scope.applicantsArray[i].FacebookUserId != undefined && $scope.applicantsArray[i].FacebookUserId == externalId) {
                  $scope.AlreadyLinked = true;
                  break;
              }
          }
          if (!$scope.AlreadyLinked) {
              console.log(externalId)
              $scope.CurrentApplicant.FacebookUserId = externalId;
          }
      }

      $scope.openFacebookLogin = function (provider, currentApplicant) {
          $scope.CurrentApplicant = currentApplicant;
          var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

          var externalProviderUrl = CONSTANT.HOST + "api/Account/ExternalLogin?provider=" + provider
                                                                      + "&response_type=token&client_id=" + AUTH_DATA.clientId
                                                                      + "&redirect_uri=" + redirectUri;
          window.$windowScope = $scope;
          //window.location.href = externalProviderUrl;
          var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=1200,height=750");
          //var oauthWindow = window.open(externalProviderUrl, "Authenticate Account");
      }

      $scope.authCompletedCB = function (fragment) {
          $scope.$apply(function () {
              var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token, email: fragment.email };
              console.log("External Data ", fragment);
              linkAccount(fragment.external_id)
              $.ajax({
                  url: fragment.logout + "&next=" + fragment.next,
                  type: 'GET',
                  dataType: 'jsonp'
              })

          });
      }

      //function loadDefaultValuesForBusiness() {

      //    //loadLoanAccountById($state.params.Id);
      //   // loadBusinessConstitution();
      //    $scope.years = [];
      //    $scope.businessDetails = {};
      //    $scope.businessDetails.PanStatus = PANSTATUS.INITIAL;
      //    loadYears();
      //   // loadBusinessOwnerships();
      //    loadBanks();
      //    loadBusinessIndustries();
      //    loadBusinessNatures();
      //    loadFCCategory();

      //    GetExitingBUsiness();
      //    $scope.businessDetails.isSameBusinessAddress = true;
      //    if ($state.params.Id) {
      //        loanAccountRepository.getById($state.params.Id, function (callback) {
      //            $scope.loanAccount = callback;
      //            $scope.businessDetails.SellerPortalId = $scope.loanAccount.Seller_MerchantCode;
      //        });


      //    }

      //    //Setting User's Mobile Number into the the business detail form 
      //    $rootScope.user = JSON.parse(localStorage.getItem('$rootScope.user')); //getting data from local Storage
      //    if (!$scope.businessDetails.Business_Contact_Mobile) {
      //        if ($rootScope.user != undefined)
      //            $scope.businessDetails.Business_Contact_Mobile = $rootScope.user.phone;
      //    }


      //}



      //function loadBusinessForLoanAccount() {
      //    if ($state.params.Id) {
      //        applicantRepository.GetMainApplicantByLoanAccountId($state.params.Id, function (callback) {
      //            $scope.MainApplicant = callback;
      //            if (callback.Business != null) {
      //                console.log("Business Details", callback);
      //                $scope.SelectedBusinessId = callback.Business.BusinessId;
      //                $scope.businessDetails = callback.Business;
      //                $scope.businessDetails.PanStatus = $scope.businessDetails.IsPanVerified == true ? PANSTATUS.VERIFIED : PANSTATUS.WRONG;
      //                $scope.businessDetails.VAT_Tin = parseInt(callback.Business.VAT_Tin);

      //                $scope.businessDetails.HasStoreInMkt = $scope.businessDetails.HasStoreInMkt == true ? 1 : 0;
      //                $scope.businessDetails.HasOverDraftAc = $scope.businessDetails.HasOverDraftAc == true ? 1 : 0;
      //                $scope.businessDetails.HasPOSinOffice = $scope.businessDetails.HasPOSinOffice == true ? 1 : 0;
      //                $scope.validateBusinessPan($scope.businessDetails);
      //                if ($scope.businessDetails.DOIncorporation != null) {
      //                    $scope.businessDetails.DOIncorporation = new Date($scope.businessDetails.DOIncorporation);
      //                    $scope.businessDetails.DOIncorporationMonth = $scope.businessDetails.DOIncorporation.getMonth();
      //                    $scope.businessDetails.DOIncorporationYear = $scope.businessDetails.DOIncorporation.getFullYear();
      //                    $scope.businessDetails.DOIncorporationMonth++;

      //                }
      //                if ($scope.businessDetails.HasODLimit == true)
      //                    $scope.businessDetails.HasODLimit = 'true';
      //                else
      //                    $scope.businessDetails.HasODLimit = 'false';



      //            }
      //            else if ($scope.businessDetails != null)
      //                $scope.businessDetails.HasSameAddress = true;
      //        })


      //    }
      //}

      //function loanproductGroup() {
      //    productGroupRepository.GetAllFilter(function (callback) {
      //        $scope.ProductGroups = callback;
      //        console.log('productgroup', $scope.ProductGroups);
      //    })

      //}

      //function loadFCCategory() {
      //    fCcategoryRepository.GetAll(function (callback) {
      //        $scope.FCCatgories = callback;
      //        console.log("loan fc category", callback)
      //    })
      //}

      $scope.BusinessNatureChanged = function (businessDetails) {

          angular.forEach($scope.businessNatures, function (bNature) {
              if (businessDetails.FKBusinessNatureId == bNature.BusinessNatureId) {
                  businessDetails.FKCategoryId = bNature.FKCategoryId;
              }
          })
      }

      //function loadBusinessConstitution() {
      //    constitutionTypeRepository.GetAll(function (callback) {
      //        $scope.businessConstitutions = callback;
      //        //console.log("Constitutions", $scope.businessConstitutions)
      //    })
      //}

      //function loadBusinessOwnerships() {
      //    ownership_HeaderRepository.GetAll(function (callback) {
      //        $scope.businessOwnerships = callback;
      //        console.log("businessOwnerships", callback)
      //    })
      //}

      function loadYears() {
          var dt = new Date();
          for (var j = dt.getFullYear() ; j >= 1966  ; j--)
              $scope.years.push(j);
      }

      //$scope.concatMonthAndYear = function (month, year) {
      //    $scope.businessDetails.DOIncorporation = year + '-' + month;
      //}

      function loadBusinessIndustries() {
          businessIndustryRepository.GetAllBusinessIndustry(function (callback) {
              $scope.businessIndustries = callback;
          })
      }

      function loadBusinessNatures() {
          businessNatureRepository.GetAllBusinessNature(function (callback) {
              $scope.businessNatures = callback;
          })
      }


      function loadBanks() {
          bankRepository.GetAll(function (callback) {
              $scope.banks = callback;
          })
      }

      //$scope.getDataFromPin = function (postalCode) {
      //    if (postalCode.length == 6) {
      //        postalCodeRepository.GetPostalCode(postalCode, function (callback) {
      //            console.log(callback);
      //            if (callback.length > 0) {
      //                $scope.postalCode = callback[0];
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

      $scope.ChangeCaseForBusinessPAN = function (businessDetails) {
          if (businessDetails === undefined)
              return;
          if (businessDetails.PANCardNo != null)
              businessDetails.PANCardNo = businessDetails.PANCardNo.toUpperCase();
      }
      $scope.ChangeCaseForBusinessGST = function (businessDetails) {
          if (businessDetails.GSTNumber != null)
              businessDetails.GSTNumber = businessDetails.GSTNumber.toUpperCase();
      }
      $scope.ChangeCaseForPersonPAN = function (Details) {
          if (Details.PanNumber != null)
              if (Details.PanNumber.length == 10)
                  Details.PanNumber = Details.PanNumber.toUpperCase();
      }
      $scope.loanDetailsSaved = false;
      //$scope.submitBusinessDetails = function (loanAccount, businessDetails, _isInValid) {

      //    console.log("LoanAccount", loanAccount)

      //    if ((businessDetails.IsPanVerified == true && businessDetails.ValidCompanyName == true) || (businessDetails.FKBusinessConstitutionId == 2) || true) {
      //        businessDetails.DOIncorporation = businessDetails.DOIncorporationMonth + "/" + businessDetails.DOIncorporationYear;


      //        console.log("Business Operating Since ", businessDetails.DOIncorporation);
      //        console.log("loan Amount", loanAccount.Amount, "product max amont", $scope.product.MaxAmount, "Product min amount", $scope.product.MinAmount);
      //        if (_isInValid || loanAccount.Amount > $scope.product.MaxAmount || loanAccount.Amount < $scope.product.MinAmount) {
      //            $scope.ShowBusinessDtlError = true;
      //            console.log("hit inside if")
      //        }
      //        else {
      //            if (businessDetails.HasSameAddress) {
      //                populateAddressFromBusiness(businessDetails);
      //            }
      //            if (businessDetails.BusinessId == null || businessDetails.BusinessId == 0) {


      //                loanAccount.IsDraft = true;
      //                loanAccount.FKLoanApplicationStatusId = 5;
      //                loanAccount.IsInComplete = 1;
      //                loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
      //                loanAccountRepository.Save(loanAccount, function (callback) {
      //                    $scope.loanDetailsSaved = true;
      //                    $scope.loanAccount = callback;


      //                    if ($scope.loanDetailsSaved) {
      //                        console.log("loan account saved succesfully:", $scope.loanAccount, $scope.loanDetailsSaved);

      //                        businessRepository.Create(businessDetails, function (callback) {
      //                            $scope.loanDetailsSaved = false;
      //                            //Create an applicant as Logged In User by default so that we can track business by Applicant and we can change the details anyway in 
      //                            //further step
      //                            var applicant = {
      //                                IsMainApplicant: 1,
      //                                FKBusinessId: callback.BusinessId,
      //                                FKLoanAccountId: $scope.loanAccount.LoanAccountId,
      //                                FKApplicantTypeId: 2 //Supporting only business loan so keeping it Hard Coded
      //                            }
      //                            applicantRepository.Save(applicant, function (applicantCallback) {
      //                                GoToPersonDetail();
      //                            })

      //                        })
      //                    }

      //                })


      //            }
      //            else {
      //                if ($state.params.Id) {


      //                    loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
      //                    loanAccountRepository.Update(loanAccount, function (callback) {
      //                        $scope.loanDetailsSaved = true;
      //                        $scope.loanAccount = callback;
      //                        console.log("$scope.loanAccount-Updated", loanAccount)

      //                        if ($scope.loanDetailsSaved) {
      //                            businessRepository.Update(businessDetails, function (business) {
      //                                applicantRepository.GetMainApplicantByLoanAccountId(parseInt($scope.loanAccount.LoanAccountId), function (callback) {
      //                                    $scope.loanDetailsSaved = false;
      //                                    if (callback != null && callback.ApplicantId > 0 && !(callback.FKBusinessId > 0)) {
      //                                        callback.FKBusinessId = business.BusinessId;
      //                                        applicantRepository.Update(callback, function (callback) {
      //                                            GoToPersonDetail();
      //                                        })
      //                                    }
      //                                    else if (callback == null || !(callback.ApplicantId > 0)) {
      //                                        var applicant = {
      //                                            IsMainApplicant: 1,
      //                                            FKBusinessId: business.BusinessId,
      //                                            FKLoanAccountId: $scope.loanAccount.LoanAccountId,
      //                                            FKApplicantTypeId: 2 //Supporting only business loan so keeping it Hard Coded
      //                                        }
      //                                        applicantRepository.Save(applicant, function (applicantCallback) {
      //                                            GoToPersonDetail();
      //                                        })
      //                                    }
      //                                    else
      //                                        GoToPersonDetail();

      //                                })

      //                            })
      //                        }
      //                    })

      //                }
      //                else {
      //                    loanAccountRepository.Save(loanAccount, function (callback) {
      //                        $scope.loanDetailsSaved = true;
      //                        $scope.loanAccount = callback;
      //                        console.log("loan account saved succesfully:", $scope.loanAccount, $scope.loanDetailsSaved);
      //                        if ($scope.loanDetailsSaved) {
      //                            businessRepository.Update(businessDetails, function (business) {
      //                                applicantRepository.GetMainApplicantByLoanAccountId(parseInt($scope.loanAccount.LoanAccountId), function (callback) {
      //                                    $scope.loanDetailsSaved = false;
      //                                    if (callback != null && callback.ApplicantId > 0 && !(callback.FKBusinessId > 0)) {
      //                                        callback.FKBusinessId = business.BusinessId;
      //                                        applicantRepository.Update(callback, function (callback) {
      //                                            GoToPersonDetail();
      //                                        })
      //                                    }
      //                                    else if (callback == null || !(callback.ApplicantId > 0)) {
      //                                        var applicant = {
      //                                            IsMainApplicant: 1,
      //                                            FKBusinessId: business.BusinessId,
      //                                            FKLoanAccountId: $scope.loanAccount.LoanAccountId,
      //                                            FKApplicantTypeId: 2 //Supporting only business loan so keeping it Hard Coded
      //                                        }
      //                                        applicantRepository.Save(applicant, function (applicantCallback) {
      //                                            GoToPersonDetail();
      //                                        })
      //                                    }
      //                                    else
      //                                        GoToPersonDetail();

      //                                })

      //                            })
      //                        }

      //                    })

      //                }

      //            }
      //        }
      //    }
      //}

      //function GoToPersonDetail() {
      //    $state.go('borrower.application.personal_details', { productId: $state.params.productId, Id: $scope.loanAccount.LoanAccountId });
      //    manageLiner('step3');
      //}

      //$scope.getDataFromPinInWarehouse = function (businessDetail) {
      //    //WarehouePostalCode
      //    if (businessDetail.WarehouePostalCode.length == 6) {
      //        postalCodeRepository.GetPostalCode(businessDetail.WarehouePostalCode, function (callback) {
      //            if (callback.length > 0) {
      //                $scope.postalCode = callback[0];
      //                $scope.businessDetails.WarehoueCity = $scope.postalCode.District;
      //                $scope.businessDetails.WarehoueState = $scope.postalCode.State;
      //            } else {
      //                //$scope.Applicant.Business.OffPostalCode = "";
      //            }
      //        })
      //    }
      //}

      ////Checkbox event
      //function populateAddressFromBusiness(businessDetail) {
      //    if (businessDetail.HasSameAddress) {
      //        //Copy address from business detail to ware house
      //        businessDetail.WarehoueAddressLine1 = businessDetail.OffAddressLine1;
      //        businessDetail.WarehoueAddressLine2 = businessDetail.OffAddressLine2;
      //        businessDetail.WarehoueCity = businessDetail.OffCity;
      //        businessDetail.WarehoueState = businessDetail.OffState;
      //        businessDetail.WarehouePostalCode = businessDetail.OffPostalCode;
      //    }
      //    else {
      //        businessDetail.WarehoueAddressLine1 = null;
      //        businessDetail.WarehoueAddressLine2 = null;
      //        businessDetail.WarehoueCity = null;
      //        businessDetail.WarehoueState = null;
      //        businessDetail.WarehouePostalCode = null;
      //    }
      //}

      //function GetExitingBUsiness() {
      //    businessRepository.GetByLoggedinUser(function (callback) {
      //        $scope.ExistingBusiness = callback;
      //        //console.log("$scope.ExistingBusiness", $scope.ExistingBusiness);
      //        if ($scope.ExistingBusiness.length > 0)
      //            $scope.HasExistingBusiness = true;
      //    })
      //}

      //$scope.UpdateBusinessDetail = function (id) {
      //    if (id > 0) {
      //        angular.forEach($scope.ExistingBusiness, function (business) {
      //            if (id == business.BusinessId) {

      //                $scope.businessDetails = business;
      //                console.log($scope.businessDetails);
      //                $scope.businessDetails.DOIncorporation = new Date($scope.businessDetails.DOIncorporation);
      //                //$scope.businessDetails.DOIncorporation = $filter('date')($scope.businessDetails.DOIncorporation, 'dd/mm/yyyy');


      //                $scope.businessDetails.DOIncorporationMonth = $scope.businessDetails.DOIncorporation.getMonth();
      //                $scope.businessDetails.DOIncorporationYear = $scope.businessDetails.DOIncorporation.getFullYear();
      //                $scope.businessDetails.DOIncorporationMonth++;

      //                if ($scope.businessDetails.HasODLimit == true)
      //                    $scope.businessDetails.HasODLimit = 'true';
      //                else
      //                    $scope.businessDetails.HasODLimit = 'false';

      //                loadLoanAccountById($state.params.Id);
      //                populateAddressFromBusiness($scope.businessDetails);


      //            }

      //        })
      //    }
      //    else
      //        $scope.businessDetails = {
      //            HasSameAddress: '',
      //            BusinessId: "",
      //            SellerPortalId: '',
      //            isSameBusinessAddress: true,
      //        }
      //}

      ////Checkbox event
      //function populateAddressFromBusiness(businessDetail) {
      //    if (businessDetail.isSameBusinessAddress) {
      //        //Copy address from business detail to ware house
      //        businessDetail.WarehoueAddressLine1 = businessDetail.OffAddressLine1;
      //        businessDetail.WarehoueAddressLine2 = businessDetail.OffAddressLine2;
      //        businessDetail.WarehoueCity = businessDetail.OffCity;
      //        businessDetail.WarehoueState = businessDetail.OffState;
      //        businessDetail.WarehouePostalCode = businessDetail.OffPostalCode;
      //    }
      //    else {
      //        businessDetail.WarehoueAddressLine1 = null;
      //        businessDetail.WarehoueAddressLine2 = null;
      //        businessDetail.WarehoueCity = null;
      //        businessDetail.WarehoueState = null;
      //        businessDetail.WarehouePostalCode = null;
      //    }
      //}

      /*-------------------- / Step 2 -------------------------*/

      /*---------------------- Step 3 -------------------------*/


      function loadDefaultValuesForPersonalInfo() {


          //  loadBusinessForLoanAccount();
          //  $scope.applicantsArray = [];
          ////  loadMainApplicant();
          //  loadDesignation();

      }

      //$scope.UpdatePermanentAdd = function (person) {
      //    if (person.Samelocationresidence == true) {
      //        person.AddressLine1_Permanent1 = person.AddressLine1;
      //        person.AddressLine1_Permanent2 = person.AddressLine2;
      //        person.Pin_Permanent = person.Pincode;
      //        person.City_Permanent = person.CityName;
      //        person.State_Permanent = person.State;
      //        person.PhoneNumber_Permanent = person.WorkPhone;
      //        person.MobilePhone_Permanent = person.MobilePhone;
      //        person.EmailId_Permanent = person.EmailId;
      //        person.FKOwerShip_Prmnt_Id = person.FkOwnerShipId;
      //    }
      //}

      //function loadDesignation() {
      //    designationRepository.GetAll(function (callback) {
      //        $scope.Designations = callback;
      //    })
      //}

      //function loadQualifications() {
      //    ownerQualificationRepository.GetOwnerQualification(function (callback) {
      //        $scope.qualifications = callback;
      //        console.log("qualification", callback);
      //    })
      //}

      //function loadMaritalStatus() {
      //    maritalstatusRepository.Get(function (callback) {
      //        $scope.maritalstatus = callback;
      //    })
      //}

      //$scope.getDataFromPinForPersonalDetail = function (personalDetail, isParmanent) {
      //    if (personalDetail.Pincode.length == 6) {
      //        postalCodeRepository.GetPostalCode(personalDetail.Pincode, function (callback) {
      //            if (callback.length > 0) {
      //                $scope.postalCode = callback[0];
      //                if (isParmanent) {
      //                    personalDetail.City_Permanent = $scope.postalCode.District;
      //                    personalDetail.State_Permanent = $scope.postalCode.State;
      //                }
      //                else {
      //                    personalDetail.CityName = $scope.postalCode.District;
      //                    personalDetail.State = $scope.postalCode.State;
      //                    personalDetail.FKPostalCodeId = $scope.postalCode.PostalId;
      //                }
      //            }
      //        })
      //    }
      //}



      //$scope.openDeleteCoApplicantModal = function (applicantId, index) {
      //    $scope.coApplicantId = applicantId;
      //    $scope.coApplicantIndex = index;
      //    $('#deletecoApplicant').modal('show');
      //}

      //$scope.deleteCoApplicant = function () {
      //    if ($scope.coApplicantId > 0) {
      //        applicantRepository.Delete($scope.coApplicantId, function (callback) {
      //            loadMainApplicant();
      //            $('#deletecoApplicant').modal('hide');
      //        })
      //    }
      //    else if ($scope.coApplicantIndex > 0) {
      //        $scope.applicantsArray.splice($scope.coApplicantIndex, 1);
      //        $('#deletecoApplicant').modal('hide');
      //    }

      //}

      //$scope.populateResidenceAddressIntoPermanent = function (person, isSameAddress) {
      //    if (isSameAddress) {
      //        //Copy business address as applicant address
      //        person.AddressLine1_Permanent1 = person.AddressLine1;
      //        person.AddressLine1_Permanent2 = person.AddressLine2;
      //        person.Pin_Permanent = person.Pincode;
      //        person.State_Permanent = person.State;
      //        person.City_Permanent = person.CityName;
      //        person.PhoneNumber_Permanent = person.WorkPhone;
      //        person.MobilePhone_Permanent = person.MobilePhone;
      //        person.EmailId_Permanent = person.EmailId;
      //    }
      //}

      //$scope.ManageApplicantPanel = function (applicantId) {
      //    var HasFound1 = false;
      //    var HasFound2 = false;
      //    var Index = 0;
      //    angular.forEach($scope.applicantsArray, function (applicant, i) {
      //        applicant.showForm = false;
      //        if (!HasFound1) {
      //            if (applicant.ApplicantId == applicantId) {
      //                HasFound1 = true;
      //                Index = i + 1;
      //                applicant.showForm = false;
      //            }
      //        }
      //        if (HasFound1) {
      //            if (!(applicant.ApplicantId > 0)) {
      //                HasFound2 = true;
      //                applicant.showForm = true;
      //            }
      //        }
      //        if (HasFound2 && i > Index && applicant.showForm != true) {
      //            applicant.showForm = false;
      //        }
      //    })
      //}


      //$scope.submitPersonDetails = function (applicant, _isInvalid, i) {
      //    
      //    //if (applicant.IsMainApplicant == true) {
      //    if (applicant.FKPersonId > 0 && !applicant.EmailAlreadyExist && !applicant.MobilealreadyExist && !applicant.MakeFieldsDisable && $scope.isBorrower) {
      //        if (applicant.Person.MobilePhone != $scope.personDetailOfLogedInUser.MobilePhone
      //            && applicant.Person.EmailId != $scope.personDetailOfLogedInUser.EmailId
      //            && applicant.Person.PanNumber != $scope.personDetailOfLogedInUser.PanNumber) {

      //            applicant.Person.PersonId = 0;
      //            applicant.FKPersonId = 0;
      //            applicant.Person.FKLoginDetailId = null;
      //            $scope.panAlreadyExist = false;
      //            $scope.submitPersonDetailsAfterVarifications(applicant, _isInvalid);
      //        }
      //        else
      //            if (applicant.Person.MobilePhone == $scope.personDetailOfLogedInUser.MobilePhone
      //                   && applicant.Person.EmailId == $scope.personDetailOfLogedInUser.EmailId) {
      //                $scope.submitPersonDetailsAfterVarifications(applicant, _isInvalid);
      //            }
      //            else
      //                if (applicant.Person.MobilePhone != $scope.personDetailOfLogedInUser.MobilePhone && applicant.Person.EmailId == $scope.personDetailOfLogedInUser.EmailId) {
      //                    applicant.ShowValidationError = true;
      //                    applicant.EmailAlreadyExist = true;
      //                }
      //                else
      //                    if (applicant.Person.EmailId != $scope.personDetailOfLogedInUser.EmailId && applicant.Person.MobilePhone == $scope.personDetailOfLogedInUser.MobilePhone) {
      //                        applicant.ShowValidationError = true;
      //                        applicant.MobilealreadyExist = true;

      //                    }
      //                    else {
      //                        applicant.panAlreadyExist = true
      //                        applicant.ShowValidationError = true;
      //                    }


      //    }
      //    else
      //        $scope.submitPersonDetailsAfterVarifications(applicant, _isInvalid);
      //}

      //$scope.submitPersonDetailsAfterVarifications = function (applicant, _isInvalid) {

      //    console.log("Applicant To Save", applicant)
      //    $scope.ownershipErrr = false
      //    $scope.totalOwnership = 0;

      //    for (var j in $scope.applicantsArray) {
      //        if ($scope.applicantsArray[j].Person.OwnershipPer != "")
      //            $scope.totalOwnership += parseFloat($scope.applicantsArray[j].Person.OwnershipPer);

      //    }

      //    if (_isInvalid || !$scope.CheckAgeValidation(applicant.Person.DOB) || $scope.totalOwnership > 100 || applicant.EmailAlreadyExist || applicant.MobilealreadyExist || $scope.panAlreadyExist) {
      //        applicant.ShowValidationError = true;
      //        console.log('$scope.totalOwnership', $scope.totalOwnership)

      //    } else {
      //        applicant.ShowValidationError = false;
      //        if (applicant.Person.Samelocationresidence) {
      //            $scope.populateResidenceAddressIntoPermanent(applicant.Person, applicant.Person.Samelocationresidence);
      //        }

      //        if (applicant.Person != null) {

      //            applicant.Person.IsCustomer = true;
      //        }

      //        if (applicant.ApplicantId > 0) {
      //            applicant.Person.DOB = moment(applicant.Person.DOB, 'DD/MM/YYYY').format('YYYY-MM-DDThh:mm:ss');

      //            applicantRepository.Update(applicant, function (callback) {
      //                applicant = callback;
      //                if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
      //                    loanAccountRepository.Update($scope.loanAccount, function (callback) {
      //                    })

      //                }

      //                if (callback) {
      //                    loadMainApplicant();
      //                    applicant.showForm = false;
      //                    $scope.ManageApplicantPanel(callback.ApplicantId);
      //                }

      //            })
      //        }
      //        else {
      //            applicant.Person.DOB = moment(applicant.Person.DOB, 'DD/MM/YYYY').format('YYYY-MM-DDThh:mm:ss');

      //            applicantRepository.Save(applicant, function (callback) {
      //                applicant = callback;
      //                if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
      //                    loanAccountRepository.Update($scope.loanAccount, function (callback) {
      //                    })
      //                }
      //                if (callback) {
      //                    loadMainApplicant();
      //                    applicant.showForm = false;
      //                    $scope.ManageApplicantPanel(callback.ApplicantId);
      //                }
      //            })
      //        }
      //    }


      //}


      $scope.CheckAgeValidation = function (date) {
          $scope.IsAgeValidated = true;
          $scope.IsInvalidDate = false;
          var dateYear = moment(date, "DD/MM/YYYY").year();
          if (!dateYear)
          { $scope.IsInvalidDate = true; }
          else
          {
              var todayDate = new Date();
              var age = todayDate.getFullYear() - dateYear;
              if (age >= 18 && age <= 120)
                  $scope.IsAgeValidated = true;
              else
                  $scope.IsAgeValidated = false;
              return $scope.IsAgeValidated

          }

      }

      //$scope.showPersonalDetailsModal = function () {
      //    var allConfirmed = true;
      //    //Check if all the applicants are confirmed, then only open new 
      //    for (var i = 0; i < $scope.applicantsArray.length; i++) {
      //        if (typeof ($scope.applicantsArray[i].ApplicantId) === "undefined") {
      //            allConfirmed = false;
      //            break;
      //        }
      //    }
      //    if (allConfirmed) {
      //        $scope.personalModalDetails = {};
      //        $scope.personalModalDetails.IsMainApplicant = false;
      //        $scope.personalModalDetails.FKLoanAccountId = $state.params.Id;
      //        $scope.personalModalDetails.Person = {
      //            Name: '', FirstName: '', MiddleName: '', LastName: '', FatherName: '', Gender: '', DOB: '', FKOwnerQualificationId: '', FKMaritalStatusId: '',
      //            NoOfDependent: '', PanNumber: '', adhaarCardNumber: '', OwnershipPer: '', SameAsBusinessAddress: '', AddressLine1: '', AddressLine2: '',
      //            Landmark: '', Pincode: '', CityName: '', State: '', WorkPhone: '', MobilePhone: '', EmailId: '', FkOwnerShipId: '', Samelocationresidence: true,
      //            AddressLine1_Permanent1: '', AddressLine1_Permanent2: '', Pin_Permanent: '', City_Permanent: '', State_Permanent: '', FKOwerShip_Prmnt_Id: '',
      //            PhoneNumber_Permanent: '', MobilePhone_Permanent: '', EmailId_Permanent: '', ValidFirstName: true, ValidLastName: true, PanStatus: PANSTATUS.INITIAL
      //        };
      //        $scope.personalModalDetails.Person.Samelocationresidence = true;
      //        $('#myModa3').modal('show');
      //    }
      //    else {
      //        toastr.error("Please confirm the applicant details first");
      //    }
      //}

      //$scope.panAlreadyExist = false;
      ////Get Person Details by PanNumber
      //$scope.getPersonByPan = function (panNumber, indexOfApplicantArray) {
      //    if (!panNumber == 10) {
      //        return;
      //    }
      //    $scope.indexOfApplicantArray = indexOfApplicantArray;
      //    if (panNumber)
      //        personRepository.getByPan(panNumber, function (callback) {
      //            console.log("per verification callback", callback);
      //            if (callback.Id > 0) {
      //                //  $scope.applicantsArray[$scope.indexOfApplicantArray].Person.PanNumber = "";
      //                callback.DOB = moment(callback.DOB, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY');
      //                $scope.prsonDetailsByPan = callback;
      //                $scope.applicantsArray[$scope.indexOfApplicantArray].panAlreadyExist = true;
      //                //if ($scope.isBorrower == false) {
      //                //    $('#PersonWantUseExistingDetails').modal('show');
      //                //}

      //            } else {
      //                $scope.applicantsArray[$scope.indexOfApplicantArray].panAlreadyExist = false;
      //            }
      //            //console.log('$scope.prsonDetailsByPan', $scope.prsonDetailsByPan);
      //        })
      //    else {
      //        //$scope.applicantsArray[$scope.indexOfApplicantArray].Person = $scope.Person;
      //    }
      //}

      //Populate Person Details Got from Pan Number
      //$scope.populateDetailsGetFromPan = function () {
      //    $scope.applicantsArray[$scope.indexOfApplicantArray].Person = $scope.prsonDetailsByPan;
      //    $scope.applicantsArray[$scope.indexOfApplicantArray].MakeFieldsDisable = true;
      //    $scope.applicantsArray[$scope.indexOfApplicantArray].FKPersonId = $scope.prsonDetailsByPan.PersonId;
      //    $scope.applicantsArray[$scope.indexOfApplicantArray].panAlreadyExist = false;
      //    $('#PersonWantUseExistingDetails').modal('hide');
      //}

      ////close PersonWantUseExistingDetails PopUp
      //$scope.closePersonWantUseExistingDetails = function () {
      //    $('#PersonWantUseExistingDetails').modal('hide');
      //    $scope.panAlreadyExist = false;
      //}


      // $scope.PANSTATUS = PANSTATUS;
      ////Getting person details of loged In User
      //function getPersonByPersonId(personId) {
      //    personRepository.GetById(personId, function (callback) {
      //        if (callback.DOB)
      //            callback.DOB = moment(callback.DOB, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY');
      //        $scope.personDetailOfLogedInUser = callback;
      //        console.log('$scope.personDetailOfLogedInUser', $scope.personDetailOfLogedInUser);
      //    })
      //}


      //function loadMainApplicant() {
      //    var HasView = false;
      //    applicantRepository.GetByLoanAccountId(parseInt($state.params.Id), function (callback) {
      //        $scope.applicantsArray = [];

      //        var IsPropritor = false;
      //        var noOfPartener = 0;

      //        angular.forEach(callback, function (applicant, i) {
      //            applicant.form;
      //            if (callback.length == 1)
      //                applicant.showForm = applicant.Business.FKBusinessConstitutionId == 2 ? true : false;
      //            if (applicant.IsMainApplicant) {
      //                IsPropritor = applicant.Business.FKBusinessConstitutionId == 2 ? true : false;
      //                noOfPartener = applicant.Business.NoOfPartner;
      //            }

      //            if (!HasView && !(applicant.FKPersonId > 0)) {
      //                applicant.showForm = true;
      //                HasView = true;
      //            }

      //            applicant.ShowValidationError = false;
      //            console.log("applicant detail", applicant);

      //            if (applicant.Person != null) {
      //                getPersonByPersonId(applicant.Person.PersonId);
      //                if (applicant.Person.DOB != null) {
      //                    applicant.Person.DOB = moment(applicant.Person.DOB, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY');
      //                    console.log(applicant.Person.DOB);
      //                }

      //            }
      //            else {
      //                applicant.Person = $scope.Person;
      //                //applicant.Person.PanNumber = (applicant.IsMainApplicant == true && applicant.Business != null && applicant.Business.FKBusinessConstitutionId == 2) ? applicant.Business.PANCardNo : '';
      //                if (applicant.Business.BusinessConstitution.BusinessConstitutionName == "Proprietorship" && applicant.Business != null && applicant.IsMainApplicant == true && $scope.isBorrower == true) {
      //                    //setting Business PAN,MobilePhone,& EmailId to person's PanNumber,MobilePhone & EmailId

      //                    applicant.Person.PanNumber = applicant.Business.PANCardNo;
      //                    applicant.Person.MobilePhone = applicant.Business.Business_Contact_Mobile;
      //                    applicant.Person.EmailId = applicant.Business.EmailId;
      //                    applicant.Person.PersonId = $rootScope.loggedInUser.personId;
      //                    //set checkbox(My residence address is same as business address) to true
      //                    applicant.Person.SameAsBusinessAddress = true;

      //                    //setting business address to person's address
      //                    applicant.Person.AddressLine1 = applicant.Business.OffAddressLine1;
      //                    applicant.Person.AddressLine2 = applicant.Business.OffAddressLine2;
      //                    applicant.Person.Pincode = applicant.Business.OffPostalCode;
      //                    applicant.Person.State = applicant.Business.OffState;
      //                    applicant.Person.CityName = applicant.Business.OffCity;
      //                    applicant.Person.Landmark = applicant.Business.Landmark;
      //                    applicant.Person.FkOwnerShipId = applicant.Business.FkOwnerShipId;

      //                } else
      //                    if (applicant.Business.BusinessConstitution.BusinessConstitutionName != "Proprietorship" && applicant.IsMainApplicant == true && $scope.isBorrower == true) {
      //                        var UpdatedPerson = {
      //                            Name: $scope.personDetailOfLogedInUser.Name, FirstName: $scope.personDetailOfLogedInUser.FirstName, MiddleName: $scope.personDetailOfLogedInUser.MiddleName,
      //                            LastName: $scope.personDetailOfLogedInUser.LastName, FatherName: $scope.personDetailOfLogedInUser.FatherName, Gender: $scope.personDetailOfLogedInUser.Gender,
      //                            DOB: $scope.personDetailOfLogedInUser.DOB, FKOwnerQualificationId: $scope.personDetailOfLogedInUser.FKOwnerQualificationId, FKMaritalStatusId: $scope.personDetailOfLogedInUser.FKMaritalStatusId,
      //                            NoOfDependent: $scope.personDetailOfLogedInUser.NoOfDependent, PanNumber: $scope.personDetailOfLogedInUser.PanNumber, adhaarCardNumber: $scope.personDetailOfLogedInUser.adhaarCardNumber,
      //                            OwnershipPer: $scope.personDetailOfLogedInUser.OwnershipPer, SameAsBusinessAddress: $scope.personDetailOfLogedInUser.SameAsBusinessAddress, AddressLine1: $scope.personDetailOfLogedInUser.AddressLine1,
      //                            AddressLine2: $scope.personDetailOfLogedInUser.AddressLine2, Landmark: $scope.personDetailOfLogedInUser.Landmark, Pincode: $scope.personDetailOfLogedInUser.Pincode,
      //                            CityName: $scope.personDetailOfLogedInUser.CityName, State: $scope.personDetailOfLogedInUser.State, WorkPhone: $scope.personDetailOfLogedInUser.WorkPhone, MobilePhone: $scope.personDetailOfLogedInUser.MobilePhone,
      //                            EmailId: $scope.personDetailOfLogedInUser.EmailId, FkOwnerShipId: $scope.personDetailOfLogedInUser.FkOwnerShipId, Samelocationresidence: true, AddressLine1_Permanent1: $scope.personDetailOfLogedInUser.AddressLine1_Permanent1,
      //                            AddressLine1_Permanent2: $scope.personDetailOfLogedInUser.AddressLine1_Permanent2, Pin_Permanent: $scope.personDetailOfLogedInUser.Pin_Permanent, City_Permanent: $scope.personDetailOfLogedInUser.City_Permanent,
      //                            State_Permanent: $scope.personDetailOfLogedInUser.State_Permanent, FKOwerShip_Prmnt_Id: $scope.personDetailOfLogedInUser.FKOwerShip_Prmnt_Id, PersonId: $scope.personDetailOfLogedInUser.PersonId,
      //                            PhoneNumber_Permanent: $scope.personDetailOfLogedInUser.PhoneNumber_Permanent, MobilePhone_Permanent: $scope.personDetailOfLogedInUser.MobilePhone_Permanent, EmailId_Permanent: $scope.personDetailOfLogedInUser.EmailId_Permanent
      //                        }
      //                        applicant.FKPersonId = $scope.personDetailOfLogedInUser.PersonId;
      //                        applicant.Person = UpdatedPerson;

      //                    }

      //                if (applicant.Person)
      //                    $scope.validateApplicantPan(applicant);
      //            }
      //            
      //            applicant.MakeMobileNumberFieldDisable = false;
      //            if (applicant.Person.PersonId != null) {
      //                if (applicant.Person.PersonId == $rootScope.loggedInUser.personId)
      //                    applicant.MakeMobileNumberFieldDisable = true;
      //                else
      //                    applicant.MakeMobileNumberFieldDisable = false;
      //                console.log("applicants", applicant);
      //            }
      //            $scope.applicantsArray.push(applicant);
      //        })

      //        if (!IsPropritor && (callback.length != noOfPartener)) {
      //            var i = 0;
      //            for (i = 0; i < (noOfPartener - callback.length) ; i++) {
      //                $scope.applicant = {
      //                    ApplicantId: 0,
      //                    form: {},
      //                    IsMainApplicant: false,
      //                    FKLoanAccountId: $state.params.Id,
      //                    ValidFirstName: true, ValidLastName: true, PanStatus: PANSTATUS.INITIAL,
      //                    Person: {
      //                        Name: '', FirstName: '', MiddleName: '', LastName: '', FatherName: '', Gender: '', DOB: '', FKOwnerQualificationId: '', FKMaritalStatusId: '',
      //                        NoOfDependent: '', PanNumber: '', adhaarCardNumber: '', OwnershipPer: '', SameAsBusinessAddress: '', AddressLine1: '', AddressLine2: '',
      //                        Landmark: '', Pincode: '', CityName: '', State: '', WorkPhone: '', MobilePhone: '', EmailId: '', FkOwnerShipId: '', Samelocationresidence: true,
      //                        AddressLine1_Permanent1: '', AddressLine1_Permanent2: '', Pin_Permanent: '', City_Permanent: '', State_Permanent: '', FKOwerShip_Prmnt_Id: '',
      //                        PhoneNumber_Permanent: '', MobilePhone_Permanent: '', EmailId_Permanent: ''
      //                    },
      //                };
      //                if (!HasView) {
      //                    $scope.applicant.showForm = true;
      //                    HasView = true;
      //                }
      //                
      //                $scope.applicant.MakeMobileNumberFieldDisable = false;
      //                if ($scope.applicant.Person.PersonId > 0) {
      //                    if (applicant.Person.PersonId == $rootScope.loggedInUser.personId)
      //                        $scope.applicant.MakeMobileNumberFieldDisable = true;
      //                    else
      //                        $scope.applicant.MakeMobileNumberFieldDisable = false;
      //                    console.log("applicants", $scope.applicant);
      //                }
      //                $scope.applicantsArray.push($scope.applicant);
      //            }
      //        }
      //        console.log("applicantsArray", $scope.applicantsArray)
      //    })
      //}

      //$scope.$watch("applicantsArray", function (data) {
      //    console.log(data)
      //})

      ////$scope.checkMobileExist = function (mobileNo, i) {
      ////    if (mobileNo != $scope.personDetailOfLogedInUser.MobilePhone && mobileNo)
      ////        personRepository.IsPhoneExists(mobileNo, function (callback) {
      ////            $scope.applicantsArray[i].MobilealreadyExist = callback;
      ////        })
      ////    else
      ////        $scope.applicantsArray[i].MobilealreadyExist = false;
      ////}
      //$scope.checkEmailExist = function (Email, i) {
      //    if (Email != $scope.personDetailOfLogedInUser.EmailId && Email)
      //        personRepository.IsEmailExists(Email, function (emailCallback) {
      //            $scope.applicantsArray[i].EmailAlreadyExist = emailCallback;
      //        })
      //    else
      //        $scope.applicantsArray[i].EmailAlreadyExist = false;
      //}
      //It check: if mobile number and the emailId both are different than create a new person entry
      //if user changes only mobile number, it updates the mobile number of the existing person
      //if user changes only emailID, it updates the emailId of the existing person
      //$scope.checkMobileExist = function (mobileNo, i) {
      //    $scope.isMobileExistsForRegistration = true;
      //    $scope.isEmailExists = true;
      //    var personId;
      //    if ($scope.applicantsArray[i].FKPersonId)
      //        personId = $scope.applicantsArray[i].FKPersonId;
      //    if (personId > 0) {
      //        personRepository.GetById(personId, function (callback) {
      //            $scope.persondetailbyPersonId = callback;

      //            if ($scope.applicantsArray[i].Person.EmailId != callback.EmailId || $scope.applicantsArray[i].Person.MobilePhone != callback.MobilePhone) {
      //                personRepository.IsEmailExists($scope.applicantsArray[i].Person.EmailId, function (emailCallback) {
      //                    if ($scope.applicantsArray[i].Person.EmailId != $scope.persondetailbyPersonId.EmailId) {
      //                        $scope.isEmailExists = emailCallback;
      //                        $scope.EmailAlreadyExist = $scope.isEmailExists;
      //                    } else
      //                        $scope.EmailAlreadyExist = false;


      //                    personRepository.IsPhoneExists($scope.applicantsArray[i].Person.MobilePhone, function (callback) {
      //                        if ($scope.applicantsArray[i].Person.MobilePhone != $scope.persondetailbyPersonId.MobilePhone) {
      //                            $scope.isMobileExistsForRegistration = callback;
      //                            $scope.MobilealreadyExist = $scope.isMobileExistsForRegistration;
      //                        }
      //                        else
      //                            $scope.MobilealreadyExist = false;

      //                        if ($scope.isEmailExists == false && $scope.isMobileExistsForRegistration == false) {
      //                            $scope.applicantsArray[i].Person.FKLoginDetailId = null;
      //                            $scope.applicantsArray[i].Person.PersonId = 0;
      //                        }
      //                    })
      //                })

      //            }
      //            else {
      //                $scope.EmailAlreadyExist = false;
      //                $scope.MobilealreadyExist = false;
      //            }


      //        })
      //    }
      //    else
      //        personRepository.IsPhoneExists($scope.applicantsArray[i].Person.MobilePhone, function (callback) {
      //            if ($scope.applicantsArray[i].Person.MobilePhone) {
      //                $scope.isMobileExistsForRegistration = callback;
      //                $scope.MobilealreadyExist = $scope.isMobileExistsForRegistration;
      //            }
      //            if ($scope.applicantsArray[i].Person.EmailId)
      //                personRepository.IsEmailExists($scope.applicantsArray[i].Person.EmailId, function (emailCallback) {
      //                    $scope.isEmailExists = emailCallback;
      //                    $scope.EmailAlreadyExist = $scope.isEmailExists;
      //                })

      //        })

      //}
      /*--------------------- / Step 3 ------------------------*/

      /*----------------------  Step 4 -Platform Detail----------------------------------------------------------------------------------------*/
      //function loanrefrenceDetails() {
      //    loanAccountRepository.getById($state.params.Id, function (callback) {
      //        $scope.loanAccount = callback;
      //        $scope.Product = callback.Product;
      //    });
      //    loadBusinessForSalePurchase();

      //    loadFCCategory();

      //    $scope.OfflineRtlDtl;
      //    $scope.WebsiteDtl;
      //}
      //function loadBusinessForSalePurchase() {
      //    if ($state.params.Id) {
      //        applicantRepository.GetMainApplicantByLoanAccountId($state.params.Id, function (callback) {
      //            $scope.MainApplicant = callback;
      //            if (callback.Business != null) {
      //                console.log("Business Details", callback);
      //                $scope.businessDetails = callback.Business;
      //                $scope.SelectedBusinessId = callback.Business.BusinessId;
      //                $scope.GetSalesChannelDetail($scope.SelectedBusinessId);
      //                $scope.businessDetails.VAT_Tin = parseInt(callback.Business.VAT_Tin);

      //                //$scope.businessDetails.HasODLimit = $scope.businessDetails.HasODLimit == true ? 1 : 0;
      //                $scope.businessDetails.HasStoreInMkt = $scope.businessDetails.HasStoreInMkt == true ? 1 : 0;
      //                $scope.businessDetails.HasOverDraftAc = $scope.businessDetails.HasOverDraftAc == true ? 1 : 0;
      //                $scope.businessDetails.HasPOSinOffice = $scope.businessDetails.HasPOSinOffice == true ? 1 : 0;

      //                if ($scope.businessDetails.DOIncorporation != null)
      //                    $scope.businessDetails.DOIncorporation = new Date($scope.businessDetails.DOIncorporation);
      //                //loadOnlinePlatform();

      //            }
      //            else if ($scope.businessDetails != null)
      //                $scope.businessDetails.HasSameAddress = true;
      //        })


      //    }
      //}

      //$scope.UpdateSallerPlatform = function () {

      //    angular.forEach($scope.SalesChannels, function (salesChannel) {
      //        if (salesChannel.Name == 'Online Ecom Platforms') {
      //            if (salesChannel.Selected == true) {
      //                $scope.OnlineSellerSelected = true;
      //            }
      //            else
      //                $scope.OnlineSellerSelected = false;
      //        }

      //        if (salesChannel.Name == 'Own Website') {
      //            if (salesChannel.Selected == true)
      //                $scope.OwnWebsiteSelected = true;
      //            else
      //                $scope.OwnWebsiteSelected = false;
      //        }
      //        if (salesChannel.Name == 'Offline Retail Store') {
      //            if (salesChannel.Selected == true)
      //                $scope.OfflineRetailStore = true;
      //            else
      //                $scope.OfflineRetailStore = false;
      //        }
      //    })
      //}

      //$scope.GetSalesChannelDetail = function () {
      //    salesChannelRepository.GetAll(function (callback) {
      //        $scope.SalesChannels = callback;
      //    })
      //}

      //$scope.AddPlatformMonthlyDetail = function () {
      //    var OnlineSeler = {
      //        OnlineSellerId: '',
      //        Name: '',
      //        PlatformMonthlyDetails: [],
      //    }
      //    PlatformMonthlyDetailRepository.GetByProductId($state.params.productId, function (callback) {
      //        OnlineSeler.PlatformMonthlyDetails = callback;
      //        $scope.businessDetails.OnlineSellers.push(OnlineSeler)
      //    })
      //}



      //function onlineSeller() {
      //    //$scope.roleName = $rootScope.loggedInUser.roles[0].Role.Name;
      //    onlineSellerRepository.GetByProductId($state.params.productId, function (callback) {
      //        $scope.OnlineSellers = callback;

      //        console.log('$scope.OnlineSellers ', $scope.OnlineSellers);
      //        angular.forEach($scope.OnlineSellers, function (OnlineSeller) {
      //            var found = false;
      //            angular.forEach($scope.businessDetails.OnlineSellerPlatforms, function (OnlineSellerPlatform) {
      //                //OnlineSellerPlatform.BusinessDetailOnlineSeller.SalesInLastThreeMonth = $filter('INR')(OnlineSellerPlatform.BusinessDetailOnlineSeller.SalesInLastThreeMonth)
      //                if (!found && OnlineSellerPlatform.FKOnlineSellerId == OnlineSeller.OnlineSellerId) {
      //                    OnlineSeller.Selected = true;
      //                    found = true;
      //                }
      //            })
      //        })

      //    })
      //}

      //$scope.ManageWebsite = function (isValid) {
      //    var salesChannel;
      //    angular.forEach($scope.SalesChannels, function (salesCannel) {
      //        if (salesCannel.Name == 'Own Website') {
      //            salesChannel = salesCannel;
      //        }
      //    })
      //    if (isValid && $scope.businessDetails.WebSiteUrl != null && $scope.businessDetails.WebSiteUrl.length > 0)
      //        salesChannel.Selected = true;
      //    else
      //        salesChannel.Selected = false;

      //    $scope.UpdateFinancialData(salesChannel, null);
      //}

      //$scope.ManageOfflineStore = function (stores) {
      //    var salesChannel;
      //    angular.forEach($scope.SalesChannels, function (salesCannel) {
      //        if (salesCannel.Name == 'Offline Retail Store') {
      //            salesChannel = salesCannel;
      //        }
      //    })
      //    if (stores > 0)
      //        salesChannel.Selected = true;
      //    else {
      //        salesChannel.Selected = false;
      //        $scope.PosMachines(false);
      //    }
      //    $scope.UpdateFinancialData(salesChannel, null);
      //}

      //$scope.PosMachines = function (hasMachine) {
      //    var salesChannel;
      //    angular.forEach($scope.SalesChannels, function (salesCannel) {
      //        if (salesCannel.Name == 'POS/EDC Machines') {
      //            salesChannel = salesCannel;
      //        }
      //    })
      //    if (hasMachine == true || hasMachine == 'true')
      //        salesChannel.Selected = true;
      //    else
      //        salesChannel.Selected = false;

      //    $scope.UpdateFinancialData(salesChannel, null);
      //}

      //$scope.OnlineSelerChanged = function (onlineseller) {
      //    angular.forEach(onlineseller.PlatformMonthlyDetails, function (PlatformMonthlyDetail) {
      //        PlatformMonthlyDetail.FKOnlineSellerId = onlineseller.OnlineSellerId;
      //        PlatformMonthlyDetail.FKBusinessId = $scope.businessDetails.BusinessId;
      //    })
      //}

      //$scope.savePlatformDetail = function (PlatformMonthlyDetails) {
      //    angular.forEach($scope.businessDetails.OnlineSellers, function (onlineseller) {
      //        if (onlineseller.OnlineSellerId > 0)
      //            PlatformMonthlyDetailRepository.Save(onlineseller.PlatformMonthlyDetails, function (callback) { })
      //    })
      //}

      //function loadOnlinePlatform() {
      //    onlinePlatformSellerRepository.GetByBusiness($scope.businessDetails.BusinessId, function (callback) {
      //        $scope.businessDetails.OnlineSellerPlatforms = callback;
      //        onlineSeller();
      //    })
      //}

      //$scope.errorForRefrence = false;
      //$scope.submitReferences = function (isvalid) {

      //    console.log(isvalid);
      //    if (isvalid) {
      //        loanAccountRepository.Update($scope.loanAccount, function () {
      //            businessRepository.Update($scope.businessDetails, function () {
      //                loanAccountRepository.ApplicationSubmittedByBorrower($state.params.Id, function (loanaccountCallback) {
      //                    loanAccountRepository.UpdateLoanApplicationStatu($state.params.Id, 'Applied', function () {
      //                        notificationRepository.Add_UploadDoc($rootScope.loggedInUser.personId, $state.params.Id, function (callback) {
      //                            loanAccountRepository.ActivateCVStage($state.params.Id, function (callback) {
      //                                loanAccountRepository.getById($state.params.Id, function (callback) {

      //                                    $scope.loanAccount = callback;
      //                                    $scope.Product = callback.Product;
      //                                    if ($scope.businessDetails.OnlineSellerPlatforms.length > 0) {
      //                                        onlinePlatformSellerRepository.Update($scope.businessDetails.OnlineSellerPlatforms, function (callback) {
      //                                            $('#finalSubmit').modal('show');
      //                                        })
      //                                    } else
      //                                        $('#finalSubmit').modal('show');

      //                                });
      //                            });
      //                        });
      //                    })
      //                })
      //            })
      //        })
      //    }
      //    else {
      //        $scope.errorForRefrence = true;
      //    }
      //}




      //$scope.AddBusinessDtlOnlineSeller = function (onlineSeller) {
      //    $scope.businessDetails.OnlineSellers.push(
      //       OnlineSeller = {
      //           FKOnlineSellerId: onlineSeller.OnlineSellerId,
      //           FKBusinessId: businessDetails.BusinessId,
      //           MerchantId: '',
      //           PlatformSellingMonths: '',
      //           PlatformPurchaseMonths: '',
      //           Rating: '',
      //           NoOfCollectionInMonth: '',
      //           NoOfSettelmentMonth: '',
      //           NoOfPurchaseInMonth: '',
      //           SalesInLastThreeMonth: '',
      //           PurchasesInLastThreeMonth: '',
      //       })
      //}

      //$scope.UpdateFinancialData = function (salesChannel, onlineSeller) {
      //    var found = false;
      //    var index = 0;
      //    var PlatformId = 0;
      //    var SalesChannelId = 0;

      //    if (!($scope.businessDetails.OnlineSellerPlatforms != null))
      //        $scope.businessDetails.OnlineSellerPlatforms = [];

      //    if (onlineSeller != null) {
      //        angular.forEach($scope.businessDetails.OnlineSellerPlatforms, function (seller) {
      //            if (!found)
      //                if (seller.FKOnlineSellerId == onlineSeller.OnlineSellerId) {
      //                    found = true;
      //                    index = $scope.businessDetails.OnlineSellerPlatforms.indexOf(seller);
      //                    PlatformId = seller.PlatformSellerId;
      //                }
      //        })

      //        if (found) {
      //            if (onlineSeller.Selected == false) {
      //                if (PlatformId > 0)
      //                    onlinePlatformSellerRepository.Delete(PlatformId, function (callback) {
      //                        $scope.businessDetails.OnlineSellerPlatforms.splice(index, 1);
      //                    })

      //                else
      //                    $scope.businessDetails.OnlineSellerPlatforms.splice(index, 1);
      //            }
      //        }
      //        else {
      //            $scope.businessDetails.OnlineSellerPlatforms.push({
      //                FKOnlineSellerId: onlineSeller.OnlineSellerId,
      //                FKBusinessId: $scope.businessDetails.BusinessId,
      //                OnlineSeller: onlineSeller,
      //                BusinessDetailOnlineSeller: {
      //                    BusinessDetailOnlineSellerId: null,
      //                    MerchantId: '',
      //                    PlatformSellingMonths: '',
      //                    NoOfCollectionInMonth: '',
      //                    SalesInLastThreeMonth: '',
      //                    PlatformPurchaseMonths: '',
      //                    NoOfPurchaseInMonth: '',
      //                    PurchasesInLastThreeMonth: '',
      //                    NoOfSettelmentMonth: '',
      //                    FKOnlineSellerPlatformId: '',
      //                    Rating: '',
      //                }
      //            })
      //        }
      //    }
      //        // By Sales Channels
      //    else {
      //        var SelectedOnlieSellerPltfId = 0;
      //        angular.forEach($scope.businessDetails.OnlineSellerPlatforms, function (seller) {
      //            if (!found)
      //                if (seller.FKSalesChannelId == salesChannel.SalesChannelId) {
      //                    found = true;
      //                    SalesChannelId = salesChannel.SalesChannelId;
      //                    SelectedOnlieSellerPltfId = seller.PlatformSellerId;
      //                    index = $scope.businessDetails.OnlineSellerPlatforms.indexOf(seller);
      //                }
      //        })

      //        if (found) {
      //            if (salesChannel.Selected == false) {
      //                if (SelectedOnlieSellerPltfId > 0)
      //                    onlinePlatformSellerRepository.Delete(SelectedOnlieSellerPltfId, function (callback) {
      //                        $scope.businessDetails.OnlineSellerPlatforms.splice(index, 1);
      //                    });

      //                else
      //                    $scope.businessDetails.OnlineSellerPlatforms.splice(index, 1);
      //            }
      //        }
      //        else if (salesChannel.Selected == true) {
      //            $scope.businessDetails.OnlineSellerPlatforms.push({
      //                FKSalesChannelId: salesChannel.SalesChannelId,
      //                FKBusinessId: $scope.businessDetails.BusinessId,
      //                SalesChannel: salesChannel,
      //                BusinessDetailOnlineSeller: {
      //                    MerchantId: '',
      //                    PlatformSellingMonths: '',
      //                    NoOfCollectionInMonth: '',
      //                    SalesInLastThreeMonth: '',
      //                    PlatformPurchaseMonths: '',
      //                    NoOfPurchaseInMonth: '',
      //                    PurchasesInLastThreeMonth: '',
      //                    NoOfSettelmentMonth: '',
      //                    FKOnlineSellerPlatformId: '',
      //                    Rating: '',
      //                }
      //            })
      //        }
      //    }
      //}

      //when click on upload document button on pop up
      $scope.goToDocuments = function () {
          $scope.ownershipErrr = false;
          $('#finalSubmit').modal('hide');
          $state.go("borrower.application.uploads", { productId: $state.params.productId, Id: $state.params.Id });

      }

      /*----------------------  Step 4  End-----------------------------------------------------------------------------------------*/
      /*----------------------  Step 5 Upload Document------------------------------------------------------------------------------*/

      //function loadDefaultDocuments() {

      //    //loadAllApplicantsForKYC();
      //    //loadProductTypes();
      //    //loadDucumentCategories();
      //    loanAccountRepository.getById($state.params.Id, function (callback) {
      //        $scope.loanAccount = callback;
      //    });
      //    loadDocumentType();
      //    loanApplicantDetail();

      //}

      //To Add a Loan Document Object And call A  $scope.UploadDocument function to upload a doc
      //$scope.AddLoanDocument = function (documentType, criteria, id, loanAccountId, doc) {
      //    var flag = false;
      //    //angular.forEach(documentType.LoanDocuments, function (lDoc) {
      //    //    if (criteria == 0)
      //    //        if (!(lDoc.FKDocumentId > 0) && lDoc.ForBusiness == true && lDoc.FKBusinessId == $scope.MainApplicant.FKBusinessId) {
      //    //            flag = true;
      //    //        }
      //    //    if (criteria == 1)
      //    //        if (!(lDoc.FKDocumentId > 0) && lDoc.ForPerson == true && lDoc.FKPersonId == id) {
      //    //            flag = true;
      //    //        }
      //    //})
      //    if (!flag) {
      //        documentType.LoanDocuments.push({
      //            FKLoanAccountId: $state.params.Id,
      //            FKDocumentTypeId: documentType.DocumentTypeId,
      //            IsMandatory: false,
      //            IsDocSent: false,
      //            ForPerson: criteria == 1 ? true : '',
      //            FKPersonId: criteria == 1 ? id : '',
      //            ForBusiness: criteria == 0 ? true : '',
      //            FKBusinessId: criteria == 0 ? $scope.MainApplicant.FKBusinessId : '',
      //            FKDocumentId: '',
      //            IsDeleted: false,
      //            //FKDocuemntCategoryId: documentType.HasSameCategory ? documentType.DocumentCategories[0].DocumentCategoryId : '',
      //            Document: {
      //                DocumentId: '',
      //            }
      //        })
      //        var documentToUpload = documentType;
      //        $scope.UploadDocument(documentToUpload, documentType, criteria, id, loanAccountId, doc);
      //    }
      //}

      //To upload A Document
      //$scope.UploadDocument = function (loanDocument, docType, criteria, id, LoanId, doc) {
      //    loanDocument.FKDocumentTypeId = docType.DocumentTypeId;

      //    loanDocument.FKLoanAccountId = LoanId;
      //    if (criteria == 0) {
      //        loanDocument.ForBusiness = true;
      //        loanDocument.FKBusinessId = $scope.MainApplicant.FKBusinessId;
      //    } else {
      //        loanDocument.ForPerson = true;
      //        loanDocument.FKPersonId = id;
      //    }

      //    var pass = "";

      //    var formData = new FormData();
      //    formData.append('File', doc);
      //    //loanDocument.Document[0]
      //    documentRepository.Create(formData, LoanId, pass, function (callback) {

      //        loanDocument.FKDocumentId = callback.DocumentId;
      //        loanDocument.Document = callback;
      //        if (loanDocument.LoanDocumentId > 0) {
      //            loanDocumentRepository.Update(loanDocument, function (loanDocumentCallback) {
      //                loadDefaultDocuments();
      //            })
      //        } else {
      //            loanDocumentRepository.Create(loanDocument, function (loanDocumentCallback) {
      //                loadDefaultDocuments();
      //            })
      //        }

      //    })
      //}
      //$scope.RemoveLoanDocument = function (documentType, criteria, id) {
      //    angular.forEach(documentType.LoanDocuments, function (lDoc, i) {
      //        if (criteria == 0 && lDoc.ForBusiness == true && !(lDoc.LoanDocumentId > 0) && documentType.Name == 'Bank Statement') {
      //            documentType.LoanDocuments.splice(i, 1);
      //        }
      //        else if (criteria == 1 && lDoc.ForPerson == true && !(lDoc.LoanDocumentId > 0) && ($scope.businessDetails.FKBusinessConstitutionId != 2 && documentType.Name != 'PAN Card')) {
      //            documentType.LoanDocuments.splice(i, 1);
      //        }
      //        else if (criteria == 3 && lDoc.ForPerson == true && !(lDoc.LoanDocumentId > 0) && lDoc.FKPersonId == id) {
      //            documentType.LoanDocuments.splice(i, 1);
      //        }
      //    })
      //}

      $scope.showImage = function (id, fileName) {
          $scope.docName = fileName;
          $scope.PopUpImageID = id;

          var serviceBase = CONSTANT.HOST;
          $http({
              method: 'GET',
              cache: false,
              url: serviceBase + '/api/DownloadDocument',
              params: { "LoanAccountId": $state.params.Id, "DocumentId": id, type: "GetImage" },

          }).success(function (callback) {
              var newTag = "<object data='data:" + callback.DocType + ";base64, " + callback.data + "' type='" + callback.DocType + "' style='width:871px;height:500px;'></object>"
              $('#ShowDocument').html(newTag);
              $('#document-popup').modal('show');
              $scope.imgData = callback.data;
              $scope.doctype = callback.DocType;

              $scope.modalInstance = $modal.open({
                  templateUrl: CONSTANT.HOST + '/LoanApplication/_LoanDocumentTab_PopupView',
                  scope: $scope,
                  size: 'lg'
              });
              $scope.modalInstance.result.then(function () {
                  $scope.Init();
                  $state.go($state.current.name);
              }, function () {
                  $scope.Init();
                  $state.go($state.current.name);
              });
          })
      }


      function 
    DocumentCategory() {
          documentCategoryRepository.GetAll(function (callback) {
              $scope.documentCategories = callback;
          })
      }

      //function loanApplicantDetail() {
      //    applicantRepository.GetCoApplicantsByLoanAccountId($state.params.Id, function (coapp) {
      //        $scope.CoApplicants = coapp
      //        console.log("$scope.CoApplicants", $scope.CoApplicants);
      //        applicantRepository.GetMainApplicantByLoanAccountId($state.params.Id, function (callback) {
      //            $scope.MainApplicant = callback;
      //            $scope.businessDetails = $scope.MainApplicant.Business;
      //            //$scope.businessDetails.HasODLimit = $scope.businessDetails.HasODLimit == true ? 1 : 0;
      //            console.log("$scope.MainApplicant", $scope.MainApplicant);
      //        });

      //        applicantRepository.GetApplicantsByLoanAccountId($state.params.Id, function (callback) {
      //            $scope.Applicants = callback;

      //            console.log("$scope.Applicants", $scope.Applicants);
      //        });



      //    })
      //}

      //$scope.DeleteLoanDocument = function (lDocId) {
      //    loanDocumentRepository.Delete(lDocId, function (callback) {
      //        loadDefaultDocuments();
      //    })
      //}

      //function loadDocumentType() {
      //    loanAccountRepository.getById($state.params.Id, function (callback) {
      //        $scope.loanAccount = callback;
      //        documentTypeRepository.GetNonFebrictdConfiguredDocByProduct_CV($state.params.productId, function (callback) {
      //            $scope.DocumentTypes = callback;
      //            console.log("$scope.DocumentTypes", $scope.DocumentTypes);
      //            //Get already uploaded Doc
      //            angular.forEach($scope.DocumentTypes, function (documentType) {
      //                documentType.HasSameCategory = true;
      //                if (documentType.DocumentCategories.length == 1) {
      //                    if (documentType.DocumentCategories[0].Name != documentType.Name)
      //                        documentType.HasSameCategory = false;
      //                }


      //                loanDocumentRepository.GetByDocTypeAndLoanAccountId($state.params.Id, documentType.DocumentTypeId, function (callback) {
      //                    documentType.LoanDocuments = callback;
      //                    var ForBusinessCount = 0;
      //                    var ForPersonCount = 0;

      //                    angular.forEach(documentType.LoanDocuments, function (loanDoc) {
      //                        //if (documentType.HasSameCategory)
      //                        //    loanDoc.FKDocuemntCategoryId = documentType.DocumentCategories[0].DocumentCategoryId
      //                        if (!(loanDoc.ForBusiness == true || loanDoc.ForPerson == true)) {
      //                            loanDoc.ForBusiness = documentType.ForBusiness;
      //                            loanDoc.ForPerson = documentType.ForPerson;
      //                        }
      //                        if (loanDoc.ForBusiness == true)
      //                            ForBusinessCount++;
      //                        if (loanDoc.ForPerson == true)
      //                            ForPersonCount++;
      //                    });
      //                    angular.forEach($scope.loanAccount.Applicants, function (applicant) {
      //                        applicant.HasLoanDocument = false;
      //                        angular.forEach(documentType.LoanDocuments, function (loanDoc) {
      //                            if (loanDoc.ForPerson == true && loanDoc.FKPersonId == applicant.FKPersonId)
      //                                applicant.HasLoanDocument = true;
      //                        });
      //                    })
      //                })
      //            });

      //            console.log("$scope.DocumentTypes", $scope.DocumentTypes);
      //        })
      //    })
      //}

      //function loadAllApplicantsForKYC() {
      //    applicantRepository.GetByLoanAccountId($state.params.Id, function (callback) {
      //        $scope.applicants = callback;
      //        loanDocumentRepository.GetByLoanAccountId($state.params.Id, function (callback) {
      //            $scope.businessBankDocs = [];
      //            $scope.businessAddressProof = [];
      //            $scope.businessPAN = [];
      //            for (var i = 0; i < $scope.applicants.length; i++) {
      //                if ($scope.applicants[i].IsMainApplicant == true) {
      //                    $scope.MainApplicant = $scope.applicants[i].IsMainApplicant;
      //                }
      //                $scope.applicants[i].docCount = 0;
      //            }
      //            var bankStatementsCount = 0;
      //            var addressProofCount = 0;
      //            var businessPANCount = 0;
      //            for (var i = 0; i < callback.length; i++) {
      //                if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 4) {
      //                    bankStatementsCount += 1;
      //                }
      //                else if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 1 && callback[i].ForBusiness == true) {
      //                    addressProofCount += 1;
      //                }
      //                else if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 2) {
      //                    businessPANCount += 1;
      //                }
      //                else if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 1 && callback[i].ForPerson == true) {
      //                    //$scope.applicants[j].
      //                    for (var j = 0; j < $scope.applicants.length; j++) {
      //                        if ($scope.applicants[j].FKPersonId == callback[i].FKPersonId) {
      //                            $scope.applicants[j].docCount += 1;
      //                        }
      //                    }
      //                }
      //            }
      //            if (bankStatementsCount == 0) {
      //                $scope.defaultDoc = {};
      //                $scope.defaultDoc.showDropdown = false;
      //                $scope.businessBankDocs.push($scope.defaultDoc);
      //            }
      //            if (addressProofCount == 0) {
      //                $scope.businessAddressProof = [
      //                  {
      //                      showDropdown: false
      //                  }]
      //            }
      //            if (businessPANCount == 0) {
      //                $scope.businessPAN = [{
      //                    showDropdown: false
      //                }]
      //            }
      //            for (var i = 0; i < $scope.applicants.length; i++) {
      //                if ($scope.applicants[i].docCount == 0) {
      //                    $scope.applicants[i].guarantorKycAddressProofDocs = [{
      //                        showDropdown: false
      //                    }]
      //                }
      //            }
      //            angular.forEach(callback, function (Loandoc, index) {
      //                if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 4) {
      //                    documentRepository.GetById(Loandoc.FKDocumentId, 0, function (documentCallback) {
      //                        //$scope.businessBankDocs.Document = documentCallback.Name;
      //                        $scope.businessBankDocs.push(Loandoc);
      //                    })
      //                }
      //                else if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 1 && Loandoc.ForBusiness == true) {
      //                    $scope.businessAddressProof.push(Loandoc);
      //                }
      //                else if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 2) {
      //                    $scope.businessPAN.push(Loandoc);
      //                }
      //                else if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 1 && Loandoc.ForPerson == true) {
      //                    for (var j = 0; j < $scope.applicants.length; j++) {
      //                        if (typeof ($scope.applicants[j].guarantorKycAddressProofDocs) === "undefined") {
      //                            $scope.applicants[j].guarantorKycAddressProofDocs = [];
      //                        }
      //                        if ($scope.applicants[j].FKPersonId == Loandoc.FKPersonId) {
      //                            $scope.applicants[j].guarantorKycAddressProofDocs.push(Loandoc);
      //                        }
      //                    }
      //                }
      //            })
      //        })

      //    })
      //}

      //function loadDucumentCategories() {
      //    documentCategoryRepository.GetAll(function (callback) {
      //        $scope.documentCategories = callback;
      //    })
      //}

      //function loadProductTypes() {
      //    productDocumentTypeRepository.GetProductTypeByProductId($state.params.productId, function (callback) {
      //        $scope.productTypes = callback;
      //    })
      //}

      //$scope.cancelBusinessBankDoc = function (index) {
      //    loanDocumentRepository.Delete($scope.businessBankDocs[index].LoanDocumentId, function (callback) {
      //        $scope.businessBankDocs.splice(index, 1);
      //    })
      //}

      //$scope.cancelBusinessAddressProof = function (index) {
      //    loanDocumentRepository.Delete($scope.businessAddressProof[index].LoanDocumentId, function (callback) {
      //        $scope.businessAddressProof.splice(index, 1);
      //    })
      //}

      //$scope.cancelBusinessPan = function (index) {
      //    loanDocumentRepository.Delete($scope.businessPAN[index].LoanDocumentId, function (callback) {
      //        $scope.businessPAN.splice(index, 1);
      //    })
      //}

      //$scope.cancelGuarantorKycAddressProofDoc = function (parentindex, index) {
      //    loanDocumentRepository.Delete($scope.personalDetails[parentindex].guarantorKycAddressProofDocs[index].LoanDocumentId, function (callback) {
      //        $scope.personalDetails[parentindex].guarantorKycAddressProofDocs[index].splice(index, 1);
      //    })
      //    //$scope.personalDetails[parentindex].guarantorKycAddressProofDocs[index];
      //}

      //$scope.uploadMoreBusinessBankDoc = function () {
      //    $scope.defaultDoc = {};
      //    $scope.defaultDoc.showDropdown = false;
      //    $scope.businessBankDocs.push($scope.defaultDoc);
      //}

      //$scope.uploadMoreBusinessAddressProof = function () {
      //    $scope.defaultBusinessAddressDoc = {};
      //    $scope.defaultBusinessAddressDoc.showDropdown = false;
      //    $scope.businessAddressProof.push($scope.defaultBusinessAddressDoc);
      //}

      //$scope.uploadMoreBusinessPan = function () {
      //    $scope.businessPAN.push({
      //        showDropdown: false
      //    })
      //}

      //$scope.uploadMoreGuarantorKycAddressProofDoc = function (index) {
      //    $scope.applicants[index].guarantorKycAddressProofDocs.push({
      //        showDropdown: false
      //    })
      //}


      //$scope.HasDocuments = function (DocType, forbusiness) {
      //    var result = false;
      //    angular.forEach(DocType.LoanDocuments, function (ldoc) {
      //        if (forbusiness && ldoc.ForBusiness == true) {
      //            if (!result) {
      //                if (ldoc.FKDocumentId > 0)
      //                    result = true;
      //            }
      //        }
      //        else if (forbusiness == false && ldoc.ForPerson == true) {
      //            if (!result) {
      //                if (ldoc.FKDocumentId > 0)
      //                    result = true;
      //            }
      //        }
      //    })
      //    return result;
      //}

      //$scope.HasNullDocuments = function (DocType, forbusiness) {
      //    var result = false;
      //    angular.forEach(DocType.LoanDocuments, function (ldoc) {
      //        if (forbusiness && ldoc.ForBusiness == true) {
      //            if (!result) {
      //                if (!(ldoc.LoanDocumentId > 0))
      //                    result = true;
      //            }
      //        }
      //        else if (forbusiness == false && ldoc.ForPerson == true) {
      //            if (!result) {
      //                if (!(ldoc.LoanDocumentId > 0))
      //                    result = true;
      //            }
      //        }
      //    })
      //    return result;
      //}


      //$scope.uploadBankStatement = function (businessDoc) {
      //    if (businessDoc.LoanDocumentId) {
      //        loanDocumentRepository.Delete(businessDoc.LoanDocumentId, function (loanDocDeleteCallback) {
      //            //Deleted
      //            uploadOrUpdateDocument(businessDoc);
      //        })
      //    }
      //    else {
      //        uploadOrUpdateDocument(businessDoc);
      //    }
      //}

      //$scope.uploadAddressProof = function (addressProof) {
      //    var stageId;
      //    for (var i = 0; i < $scope.productTypes.length; i++) {
      //        if ($scope.productTypes[i].FKDocumentTypeId == 4) {
      //            stageId = $scope.productTypes[i].FKStageId;
      //        }
      //    }
      //    addressProof.FKLoanAccountId = $state.params.Id;
      //    addressProof.FKDocumentTypeId = 1;
      //    addressProof.IsDeleted = false;
      //    addressProof.FKStageId = stageId;
      //    var formData = new FormData();
      //    formData.append('File', addressProof.Document[0]);
      //    documentRepository.Create(formData, $state.params.Id, function (callback) {
      //        addressProof.FKDocumentId = callback.DocumentId;
      //        addressProof.ForPerson = false;
      //        addressProof.ForBusiness = true;
      //        addressProof.FKBusinessId = $scope.businessDetails.BusinessId;
      //        loanDocumentRepository.Create(addressProof, function (loanDocumentCallback) {
      //            loadDefaultDocuments();
      //        })
      //    })
      //}

      //$scope.uploadBusinessKycDocs = function (businessPAN) {
      //    var stageId;
      //    for (var i = 0; i < $scope.productTypes.length; i++) {
      //        if ($scope.productTypes[i].FKDocumentTypeId == 4) {
      //            stageId = $scope.productTypes[i].FKStageId;
      //        }
      //    }
      //    businessPAN.FKLoanAccountId = $state.params.Id;
      //    businessPAN.FKDocumentTypeId = 2;
      //    businessPAN.IsDeleted = false;
      //    businessPAN.FKStageId = stageId;
      //    var formData = new FormData();
      //    formData.append('File', businessPAN.Document[0]);
      //    documentRepository.Create(formData, $state.params.Id, function (callback) {
      //        businessPAN.FKDocumentId = callback.DocumentId;
      //        businessPAN.ForPerson = false;
      //        businessPAN.ForBusiness = true;
      //        businessPAN.FKBusinessId = $scope.businessDetails.BusinessId;
      //        loanDocumentRepository.Create(businessPAN, function (loanDocumentCallback) {
      //            loadDefaultDocuments();
      //        })
      //    })
      //}

      //$scope.uploadGuarantorKycDocs = function (personKYC, personDetail) {
      //    var stageId;
      //    for (var i = 0; i < $scope.productTypes.length; i++) {
      //        if ($scope.productTypes[i].FKDocumentTypeId == 4) {
      //            stageId = $scope.productTypes[i].FKStageId;
      //        }
      //    }
      //    personKYC.FKLoanAccountId = $state.params.Id;
      //    personKYC.FKDocumentTypeId = 1;
      //    personKYC.IsDeleted = false;
      //    personKYC.FKStageId = stageId;
      //    var formData = new FormData();
      //    formData.append('File', personKYC.Document[0]);
      //    documentRepository.Create(formData, $state.params.Id, function (callback) {
      //        personKYC.FKDocumentId = callback.DocumentId;
      //        personKYC.ForPerson = true;
      //        personKYC.ForBusiness = false;
      //        personKYC.FKPersonId = personDetail.FKPersonId;
      //        loanDocumentRepository.Create(personKYC, function (loanDocumentCallback) {
      //            loadDefaultDocuments();
      //        })
      //    })
      //}

      //function uploadOrUpdateDocument(businessDoc) {
      //    var stageId;
      //    for (var i = 0; i < $scope.productTypes.length; i++) {
      //        if ($scope.productTypes[i].FKDocumentTypeId == 4) {
      //            stageId = $scope.productTypes[i].FKStageId;
      //        }
      //    }
      //    businessDoc.FKLoanAccountId = $state.params.Id;
      //    businessDoc.FKDocumentTypeId = 4; //Hard Coding for bank statement
      //    businessDoc.IsDeleted = false;
      //    businessDoc.FKStageId = stageId;
      //    var formData = new FormData();
      //    formData.append('File', businessDoc.Document[0]);
      //    documentRepository.Create(formData, $state.params.Id, function (callback) {
      //        businessDoc.FKDocumentId = callback.DocumentId;
      //        businessDoc.ForPerson = false;
      //        businessDoc.ForBusiness = true;
      //        businessDoc.FKBusinessId = $scope.businessDetails.BusinessId;
      //        loanDocumentRepository.Create(businessDoc, function (loanDocumentCallback) {
      //            loadDefaultDocuments();
      //        })
      //    })
      //}

      //$scope.finalSubmitApplication = function (isvalid) {
      //    if (isvalid) {
      //        loanDocumentRepository.IsReqDoc_Uploaded_CV($state.params.Id, function (callback) {
      //            console.log("callback", callback);
      //            if (callback == true) {
      //                loanActionRepository.HideBorrowerLA_IV($state.params.Id, function (callback) {
      //                    window.location.href = "#/borrower/dashboard/applications";
      //                })
      //            }
      //            else
      //                window.location.href = "#/borrower/dashboard/applications";

      //        });
      //    }

      //    //}
      //}

      //$scope.assignDefaultCategoryAsBusiness = function (pan) {
      //    for (var i = 0; i < $scope.documentCategories.length; i++) {
      //        if ($scope.documentCategories[i].Name == "Business") {
      //            pan.FKDocuemntCategoryId = $scope.documentCategories[i].DocumentCategoryId;
      //        }
      //    }
      //}

      //$scope.goToReferences = function () {
      //    var validPan = true;
      //    for (var i = 0; i < $scope.applicantsArray.length; i++) {
      //        if ($scope.applicantsArray[i].Person.IsPanVerified == false || $scope.applicantsArray[i].ValidFirstName == false || $scope.applicantsArray[i].ValidLastName == false) {
      //            validPan = false;
      //            break;
      //        }
      //    }
      //    if (validPan || true) {
      //        var total = 0;
      //        var IsInvalid = false;
      //        if ($scope.IsAgeValidated == true) {
      //            angular.forEach($scope.applicantsArray, function (applicant) {

      //                if (applicant.Person.OwnershipPer) {
      //                    total += parseFloat(applicant.Person.OwnershipPer);
      //                }

      //                if (applicant.form.$invalid || $scope.EmailAlreadyExist || $scope.MobilealreadyExist) {
      //                    applicant.showForm = true;
      //                    applicant.ShowValidationError = true;

      //                    if (!IsInvalid)
      //                        IsInvalid = true;
      //                }
      //                else {
      //                    applicant.showForm = false;
      //                    applicant.ShowValidationError = false;
      //                    applicant.Person.DOB = moment(applicant.Person.DOB, 'DD/MM/YYYY').format('MM/DD/YYYY');

      //                    if (applicant.ApplicantId > 0) {
      //                        applicantRepository.Update(applicant, function (callback) {
      //                            applicant = callback;
      //                            if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
      //                                $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
      //                                loanAccountRepository.Update($scope.loanAccount, function (callback) {
      //                                })

      //                            }
      //                        })
      //                    }
      //                    else {
      //                        applicantRepository.Save(applicant, function (callback) {
      //                            applicant = callback;
      //                            if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
      //                                $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
      //                                loanAccountRepository.Update($scope.loanAccount, function (callback) {
      //                                })

      //                            }

      //                        });
      //                    }
      //                }
      //            })

      //            if (!IsInvalid)
      //                if ($scope.businessDetails.FKBusinessConstitutionId != 2) {
      //                    if (total == 100) {
      //                        $scope.ownershipErrr = false;
      //                        $state.go("borrower.application.references", { productId: $state.params.productId, Id: $state.params.Id });
      //                        manageLiner('step4');
      //                    }
      //                    else {
      //                        $scope.ownershipErrr = true;
      //                    }
      //                }
      //                else {
      //                    $scope.ownershipErrr = false;
      //                    $state.go("borrower.application.references", { productId: $state.params.productId, Id: $state.params.Id });
      //                    manageLiner('step4');
      //                }
      //        }
      //    }

      //}

      //$scope.goToDocuments = function () {
      //    var total = 0;
      //    for (var i = 0; i < $scope.applicantsArray.length; i++) {
      //        if ($scope.applicantsArray[i].Person.OwnershipPer) {
      //            total += parseFloat($scope.applicantsArray[i].Person.OwnershipPer);
      //        }
      //    }
      //    if ($scope.businessDetails.FKBusinessConstitutionId != 2) {
      //        if (total == 100 || ((100 / $scope.applicantsArray.length) * $scope.applicantsArray.length) == total) {
      //            $scope.ownershipErrr = false;
      //            $state.go("borrower.application.uploads", { productId: $state.params.productId, Id: $state.params.Id });
      //        }
      //        else {
      //            $scope.ownershipErrr = true;
      //        }
      //    }
      //    else {
      //        $scope.ownershipErrr = false;
      //        $state.go("borrower.application.uploads", { productId: $state.params.productId, Id: $state.params.Id });
      //    }
      //}

      /*--------------------- / Step 4 ------------------------*/

      //var init = function () {
      //    Init_Function();
      //    //console.log("hit init");
      //    ////loadProduc;ts();
      //    //loadProductBusinessNature();

      //    ////loanproductGroup()
      //    //if ($scope.ProductGroups.length)
      //    //productGroupRepository.GetAllFilter(function (callback) {
      //    //    $scope.ProductGroups = callback;
      //    //    if ($state.params.Id != "" && $state.params.Id != null && typeof ($state.params.Id) != "undefined") {
      //    //        console.log("LoanAccountId", $state.params.Id)
      //    //        loadLoanAccountById($state.params.Id);
      //    //    }
      //    //    else {
      //    //        $scope.loanAccount.FKProductId = $state.params.productId;
      //    //        $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
      //    //        loadLoanPurposes();
      //    //        if ($state.params.productId) {
      //    //            loadProductById($state.params.productId);
      //    //        }
      //    //    }
      //    //})


      //}


      //var init_Optional = function () {

      //    console.log("hit init");
      //    //loadProduc;ts();
      //    //loadProductBusinessNature();

      //    //loanproductGroup()

      //    //   productGroupRepository.GetAllFilter(function (callback) {
      //    //  $scope.ProductGroups = callback;
      //    //  console.log("productGroup", callback);
      //    //if ($state.params.Id != "" && $state.params.Id != null && typeof ($state.params.Id) != "undefined") {
      //    //    console.log("LoanAccountId", $state.params.Id)
      //    //    loadLoanAccountById($state.params.Id);
      //    //}
      //    //else {
      //    //    $scope.loanAccount.FKProductId = $state.params.productId;
      //    //    $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
      //    //    loadLoanPurposes();
      //    //    if ($state.params.productId) {
      //    //       // loadProductById($state.params.productId);
      //    //    }
      //    //}
      //    //})


      //}

      //function goTo(state) {
      //    $state.go(state, {Id: })
      //}

      //init();
      //init_Optional();
      /*--------------------/ Get Products -------------*/

      /*-------------------functions for managing liner of steps------------------------------*/

      $scope.ActivateStep = function (url, Isvalid, step) {
          if (Isvalid) {
              manageLiner(step);
              $state.go(url, { productId: $state.params.productId, Id: $state.params.Id });


              //$state.reload();
          }
      }


      //$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      //    Init_Function_CallWhenStateChange();
      //    Init_Function();
      //});
      function manageLiner(step) {
          if (step == 'step1') {
              $scope.applicationTabs = {};
              $scope.applicationCompletedTabs.completedStep2 = "";
              $scope.applicationCompletedTabs.completedStep3 = "";
              $scope.applicationCompletedTabs.completedStep4 = "";
              $scope.applicationCompletedTabs.completedStep5 = "";
              $scope.applicationCompletedTabs.completedStep6 = "";
              $scope.loanDetailCompleted = false;
              $scope.businessDetailCompleted = false;
              $scope.partnerDetailsCompleted = false;
              $scope.referenceDtlCompleted = false;
              $scope.documentUploadCompleted = false;
          }
          if (step == 'step2') {
              $scope.colorValue = true;
              $scope.applicationCompletedTabs.completedStep1 = "greenBg";
              $scope.applicationCompletedTabs.completedStep2 = "blueBg";
              $scope.applicationCompletedTabs.completedStep3 = "";
              $scope.applicationCompletedTabs.completedStep4 = "";
              $scope.applicationCompletedTabs.completedStep5 = "";
              $scope.applicationCompletedTabs.completedStep6 = "";
              $scope.applicationTabs.liner1 = 'green';
              $scope.loanDetailCompleted = true;

              $scope.businessDetailCompleted = false;
              $scope.partnerDetailsCompleted = false;
              $scope.referenceDtlCompleted = false;
              $scope.documentUploadCompleted = false;
          }
          if (step == 'step3') {
              //$scope.applicationTabs = {};
              $scope.applicationTabs.liner1 = 'green';
              $scope.applicationTabs.liner2 = 'green';
              $scope.applicationCompletedTabs.completedStep1 = "greenBg";
              $scope.applicationCompletedTabs.completedStep2 = "greenBg";
              $scope.applicationCompletedTabs.completedStep3 = "blueBg";
              $scope.applicationCompletedTabs.completedStep4 = "";
              $scope.applicationCompletedTabs.completedStep5 = "";
              $scope.applicationCompletedTabs.completedStep6 = "";
              $scope.loanDetailCompleted = true;
              $scope.businessDetailCompleted = true;

              $scope.partnerDetailsCompleted = false;
              $scope.referenceDtlCompleted = false;
              $scope.documentUploadCompleted = false;
          }
          if (step == 'step4') {
              $scope.applicationTabs = {};
              $scope.applicationTabs.liner1 = 'green';
              $scope.applicationTabs.liner2 = 'green';
              $scope.applicationTabs.liner3 = 'green';
              $scope.applicationCompletedTabs.completedStep1 = "greenBg";
              $scope.applicationCompletedTabs.completedStep2 = "greenBg";
              $scope.applicationCompletedTabs.completedStep3 = "greenBg";
              $scope.applicationCompletedTabs.completedStep4 = "blueBg";
              $scope.applicationCompletedTabs.completedStep5 = "";
              $scope.applicationCompletedTabs.completedStep6 = "";
              $scope.loanDetailCompleted = true;
              $scope.businessDetailCompleted = true;
              $scope.partnerDetailsCompleted = true;

              $scope.referenceDtlCompleted = false;
              $scope.documentUploadCompleted = false;
              //$scope.partnerDetailsCompleted = true;
          }
          if (step == 'step5') {
              //$scope.applicationTabs = {};
              $scope.applicationTabs.liner1 = 'green';
              $scope.applicationTabs.liner2 = 'green';
              $scope.applicationTabs.liner3 = 'green';
              $scope.applicationTabs.liner4 = 'green';
              $scope.applicationCompletedTabs.completedStep1 = "greenBg";
              $scope.applicationCompletedTabs.completedStep2 = "greenBg";
              $scope.applicationCompletedTabs.completedStep3 = "greenBg";
              $scope.applicationCompletedTabs.completedStep4 = "greenBg";
              $scope.applicationCompletedTabs.completedStep5 = "blueBg";
              $scope.applicationCompletedTabs.completedStep6 = "";
              $scope.loanDetailCompleted = true;
              $scope.businessDetailCompleted = true;
              $scope.partnerDetailsCompleted = true;
              $scope.referenceDtlCompleted = true;

              $scope.documentUploadCompleted = false;
          }
          if (step == 'step6') {
              //$scope.applicationTabs = {};
              $scope.applicationTabs.liner1 = 'green';
              $scope.applicationTabs.liner2 = 'green';
              $scope.applicationTabs.liner3 = 'green';
              $scope.applicationTabs.liner4 = 'green';
              $scope.applicationTabs.liner5 = 'green';
              $scope.applicationCompletedTabs.completedStep1 = "greenBg";
              $scope.applicationCompletedTabs.completedStep2 = "greenBg";
              $scope.applicationCompletedTabs.completedStep3 = "greenBg";
              $scope.applicationCompletedTabs.completedStep4 = "greenBg";
              $scope.applicationCompletedTabs.completedStep5 = "greenBg";
              $scope.applicationCompletedTabs.completedStep6 = "blueBg";
              $scope.loanDetailCompleted = true;
              $scope.businessDetailCompleted = true;
              $scope.partnerDetailsCompleted = true;
              $scope.referenceDtlCompleted = true;
              $scope.documentUploadCompleted = true;
          }
      };


      $scope.cancel = function () {
          window.location.href = "#/borrower/dashboard/applications";
      }

      /*--------------------/ Get Products -------------*/

      /*-------------------functions for managing liner of steps------------------------------*/

      //function manageLiner(step, IsValid) {
      //    if (IsValid) {
      //        if (step == 'step1') {
      //            $scope.applicationTabs = {};
      //            $scope.loanDetailCompleted = false;
      //            $scope.businessDetailCompleted = false;
      //            $scope.partnerDetailsCompleted = false;
      //            $scope.referenceDtlCompleted = false;
      //            $scope.documentUploadCompleted = false;
      //        }
      //        if (step == 'step2') {
      //            $scope.colorValue = true;
      //            //$scope.applicationTabs = {};
      //            $scope.applicationCompletedTabs.completedStep1 = "greenBg";
      //            $scope.applicationTabs.liner1 = 'green';
      //            $scope.loanDetailCompleted = true;
      //            $scope.businessDetailCompleted = false;
      //            $scope.partnerDetailsCompleted = false;
      //            $scope.referenceDtlCompleted = false;
      //            $scope.documentUploadCompleted = false;
      //        }
      //        if (step == 'step3') {
      //            //$scope.applicationTabs = {};
      //            $scope.applicationTabs.liner1 = 'green';
      //            $scope.applicationTabs.liner2 = 'green';
      //            $scope.applicationCompletedTabs.completedStep2 = "greenBg";
      //            $scope.loanDetailCompleted = true;
      //            $scope.businessDetailCompleted = true;
      //            $scope.partnerDetailsCompleted = false;
      //            $scope.referenceDtlCompleted = false;
      //            $scope.documentUploadCompleted = false;
      //        }
      //        if (step == 'step4') {
      //            $scope.applicationTabs = {};
      //            $scope.applicationTabs.liner1 = 'green';
      //            $scope.applicationTabs.liner2 = 'green';
      //            $scope.applicationTabs.liner3 = 'green';
      //            $scope.loanDetailCompleted = true;
      //            $scope.businessDetailCompleted = true;
      //            $scope.partnerDetailsCompleted = true;
      //            $scope.referenceDtlCompleted = false;
      //            $scope.documentUploadCompleted = false;
      //            //$scope.partnerDetailsCompleted = true;
      //        }
      //        if (step == 'step5') {
      //            //$scope.applicationTabs = {};
      //            $scope.applicationTabs.liner1 = 'green';
      //            $scope.applicationTabs.liner2 = 'green';
      //            $scope.applicationTabs.liner3 = 'green';
      //            $scope.applicationTabs.liner4 = 'green';
      //            $scope.loanDetailCompleted = true;
      //            $scope.businessDetailCompleted = true;
      //            $scope.partnerDetailsCompleted = true;
      //            $scope.referenceDtlCompleted = true;
      //            $scope.documentUploadCompleted = false;
      //        }
      //        if (step == 'step6') {
      //            //$scope.applicationTabs = {};
      //            $scope.applicationTabs.liner1 = 'green';
      //            $scope.applicationTabs.liner2 = 'green';
      //            $scope.applicationTabs.liner3 = 'green';
      //            $scope.applicationTabs.liner4 = 'green';
      //            $scope.applicationTabs.liner5 = 'green';
      //            $scope.loanDetailCompleted = true;
      //            $scope.businessDetailCompleted = true;
      //            $scope.partnerDetailsCompleted = true;
      //            $scope.referenceDtlCompleted = true;
      //            $scope.documentUploadCompleted = true;
      //        }
      //    }
      //};

      /*-------------------End function for managing liner of steps------------------------------*/

      /*Functions for managing amount slider*/
      //function slide(viewValue) {

      //    console.log("View Value", viewValue);
      //    var plainNumber;
      //    var modifiedResult;
      //    plainNumber = viewValue;
      //    var x = plainNumber;
      //    x = x.toString();
      //    var lastThree = x.substring(x.length - 3);
      //    var otherNumbers = x.substring(0, x.length - 3);
      //    if (otherNumbers != '')
      //        lastThree = ',' + lastThree;
      //    modifiedResult = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

      //    $scope.loanDetail.amountSlide = modifiedResult;
      //    $scope.loanDetail.amount = viewValue;
      //}

      function valueSelect(data) {
          slide(data);
          if (data > 2000000 || data < 50000) {
              $scope.amountValue = true;
              $scope.sliderError = "Amount between 50000 to 2000000";

          }
          else if (data == undefined) {
              $scope.sliderError = "";

          }
          else {
              $scope.amountValue = false;
              $scope.sliderError = "";

          }
      }

      /*End Functions for managing amount slider*/

      /*-------------function for validation-----------------*/
      function numberAllow(num) {
          if (num < 0 || num > 100) {
              $scope.ownershipError = "Not valid number";
          }
          else if (num == undefined) {
              $scope.ownershipError = "";
          }
          else {
              $scope.ownershipError = "";
          }
      }




      /*----------------------function for get mobile devices type-----------------*/
      function getMobileOperatingSystem() {
          var userAgent = navigator.userAgent || navigator.vendor || window.opera;

          // Windows Phone must come first because its UA also contains "Android"
          if (/windows phone/i.test(userAgent)) {
              return "Windows Phone";
          }

          if (/android/i.test(userAgent)) {
              return "Android";
          }

          // iOS detection from: http://stackoverflow.com/a/9039885/177710
          if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
              return "iOS";
          }

          return "unknown";
      }

      /*----------------------End function for get mobile devices type-----------------*/

      if (getMobileOperatingSystem() == 'unknown') {
          $scope.showDragAndDrop = true;
      }
      else {
          $scope.showDragAndDrop = false;
      }

      if (navigator.userAgent.match(/iPhone|iPad|Tablet/i)) {
          if ($window.innerWidth <= 1024) {
              angular.element(document).ready(function () {
                  $('span.TypeOfLoanBusiness input[type="radio"], span.TypeOfLoanPersonal input[type="radio"]').css({
                      'margin-top': 2 + 'px'
                  });
              });
          }
      }
      /*-------------------End Service to get options list----------------------------*/
      $scope.contentFullyLoaded = false;
      $scope.$on('$viewContentLoaded', function () {
          $scope.contentFullyLoaded = true;
      });

      $scope.OpenPrivacyPolicy = function () {
          $('#privacy-modal').modal('show');
      }


      $scope.OpenTermOfUse = function () {
          $('#terms-modal').modal('show');
      }
      $scope.Init();

  });

