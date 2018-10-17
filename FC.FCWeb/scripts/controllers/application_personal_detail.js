'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:BorrowerDashboardControllerCtrl
 * @description
 * # BorrowerDashboardControllerCtrl
 */
angular.module('craditKartApp')
  .controller('application_personal_detail', function ($scope, $auth, $state, $timeout, $http, CONSTANT, toastr, $location, $rootScope, applicantRepository, loanPurposeRepository, loanAccountRepository, ownerQualificationRepository, maritalstatusRepository, postalCodeRepository, ownership_HeaderRepository, personRepository) {
      var PANSTATUS = {
          LOADING: "Loading",
          VERIFIED: "Verified",
          INITIAL: "Initial",
          WRONG: "Wrong",
          INVALID: "Invalid"
      }

      //on person pin change



      $scope.submitPersonDetails = function (applicant, _isInvalid, i) {
          debugger;
          //if (applicant.IsMainApplicant == true) {
          if (applicant.FKPersonId > 0 && !applicant.EmailAlreadyExist && !applicant.MobilealreadyExist && !applicant.MakeFieldsDisable && $scope.isBorrower) {
              if (applicant.Person.MobilePhone != $scope.personDetailOfLogedInUser.MobilePhone
                  && applicant.Person.EmailId != $scope.personDetailOfLogedInUser.EmailId
                  && applicant.Person.PanNumber != $scope.personDetailOfLogedInUser.PanNumber) {

                  applicant.Person.PersonId = 0;
                  applicant.FKPersonId = 0;
                  applicant.Person.FKLoginDetailId = null;
                  $scope.panAlreadyExist = false;
                  $scope.submitPersonDetailsAfterVarifications(applicant, _isInvalid);
              }
              else
                  if (applicant.Person.MobilePhone == $scope.personDetailOfLogedInUser.MobilePhone
                         && applicant.Person.EmailId == $scope.personDetailOfLogedInUser.EmailId) {
                      $scope.submitPersonDetailsAfterVarifications(applicant, _isInvalid);
                  }
                  else
                      if (applicant.Person.MobilePhone != $scope.personDetailOfLogedInUser.MobilePhone && applicant.Person.EmailId == $scope.personDetailOfLogedInUser.EmailId) {
                          applicant.ShowValidationError = true;
                          applicant.EmailAlreadyExist = true;
                      }
                      else
                          if (applicant.Person.EmailId != $scope.personDetailOfLogedInUser.EmailId && applicant.Person.MobilePhone == $scope.personDetailOfLogedInUser.MobilePhone) {
                              applicant.ShowValidationError = true;
                              applicant.MobilealreadyExist = true;

                          }
                          else {
                              applicant.panAlreadyExist = true
                              applicant.ShowValidationError = true;
                          }


          }
          else
              $scope.submitPersonDetailsAfterVarifications(applicant, _isInvalid);
      }
      $scope.populateResidenceAddressIntoPermanent = function (person, isSameAddress) {
          if (isSameAddress) {
              //Copy business address as applicant address
              person.AddressLine1_Permanent1 = person.AddressLine1;
              person.AddressLine1_Permanent2 = person.AddressLine2;
              person.Pin_Permanent = person.Pincode;
              person.State_Permanent = person.State;
              person.City_Permanent = person.CityName;
              person.PhoneNumber_Permanent = person.WorkPhone;
              person.MobilePhone_Permanent = person.MobilePhone;
              person.EmailId_Permanent = person.EmailId;
          }
      }

      $scope.ManageApplicantPanel = function (applicantId) {
          var HasFound1 = false;
          var HasFound2 = false;
          var Index = 0;
          angular.forEach($scope.applicantsArray, function (applicant, i) {
              applicant.showForm = false;
              if (!HasFound1) {
                  if (applicant.ApplicantId == applicantId) {
                      HasFound1 = true;
                      Index = i + 1;
                      applicant.showForm = false;
                  }
              }
              if (HasFound1) {
                  if (!(applicant.ApplicantId > 0)) {
                      HasFound2 = true;
                      applicant.showForm = true;
                  }
              }
              if (HasFound2 && i > Index && applicant.showForm != true) {
                  applicant.showForm = false;
              }
          })
      }


      $scope.submitPersonDetailsAfterVarifications = function (applicant, _isInvalid) {

          console.log("Applicant To Save", applicant)
          $scope.ownershipErrr = false
          $scope.totalOwnership = 0;

          for (var j in $scope.applicantsArray) {
              if ($scope.applicantsArray[j].OwnershipPer != "")
                  $scope.totalOwnership += parseFloat($scope.applicantsArray[j].OwnershipPer);

          }

          if (_isInvalid || !$scope.CheckAgeValidation(applicant.Person.DOB) || $scope.totalOwnership > 100 || applicant.EmailAlreadyExist || applicant.MobilealreadyExist || applicant.panAlreadyExist) {
              applicant.ShowValidationError = true;
              console.log('$scope.totalOwnership', $scope.totalOwnership)

          } else {
              applicant.ShowValidationError = false;
              if (applicant.Person.Samelocationresidence) {
                  $scope.populateResidenceAddressIntoPermanent(applicant.Person, applicant.Person.Samelocationresidence);
              }

              if (applicant.Person != null) {

                  applicant.Person.IsCustomer = true;
              }

              if (applicant.ApplicantId > 0) {
                  applicant.Person.DOB = moment(applicant.Person.DOB, 'DD/MM/YYYY').format('YYYY-MM-DDThh:mm:ss');

                  applicantRepository.Update(applicant, function (callback) {
                      applicant = callback;
                      if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
                          $scope.updateLoanAccountList = [];
                          $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
                          $scope.loanAccount.LoanAccountId = applicant.FKLoanAccountId;
                          $scope.updateLoanAccountList.push($scope.loanAccount);

                      }

                      if (callback) {
                          $scope.loadMainApplicant();
                          applicant.showForm = false;
                          $scope.ManageApplicantPanel(callback.ApplicantId);
                      }

                  })
              }
              else {
                  applicant.Person.DOB = moment(applicant.Person.DOB, 'DD/MM/YYYY').format('YYYY-MM-DDThh:mm:ss');

                  applicantRepository.Save(applicant, function (callback) {
                      applicant = callback;
                      if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
                          $scope.updateLoanAccountList = [];
                          $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
                          $scope.loanAccount.LoanAccountId = applicant.FKLoanAccountId;
                          $scope.updateLoanAccountList.push($scope.loanAccount);
                      }
                      if (callback) {
                          $scope.loadMainApplicant();
                          applicant.showForm = false;
                          $scope.ManageApplicantPanel(callback.ApplicantId);
                      }
                  })
              }
          }


      }




      $scope.getDataFromPinForPersonalDetail = function (personalDetail, isParmanent) {
          if (personalDetail.Pincode.length == 6) {
              postalCodeRepository.GetFirstByPostalCode(personalDetail.Pincode, function (callback) {
                  console.log("postal code", callback);
                  if (callback != null) {
                      $scope.postalCode = callback;
                      if (isParmanent) {
                          personalDetail.City_Permanent = $scope.postalCode.District;
                          personalDetail.State_Permanent = $scope.postalCode.State;
                      }
                      else {
                          personalDetail.CityName = $scope.postalCode.District;
                          personalDetail.State = $scope.postalCode.State;
                          personalDetail.FKPostalCodeId = $scope.postalCode.PostalId;
                      }
                  }
              })
          }
      }
      //copy business address to person address
      $scope.populateBusinessAddressIntoResidence = function (person) {
          console.log($scope.applicantsArray);
          if (person.SameAsBusinessAddress) {
              //Copy business address as applicant address
              person.AddressLine1 = $scope.businessDetails.OffAddressLine1;
              person.AddressLine2 = $scope.businessDetails.OffAddressLine2;
              person.Pincode = $scope.businessDetails.OffPostalCode;
              person.State = $scope.businessDetails.OffState;
              person.CityName = $scope.businessDetails.OffCity;
              person.Landmark = $scope.businessDetails.Landmark;
              person.FkOwnerShipId = $scope.businessDetails.FkOwnerShipId;
          }
          else {
              person.AddressLine1 = "";
              person.AddressLine2 = "";
              person.Pincode = "";
              person.State = "";
              person.CityName = "";
              person.Landmark = "";
              person.FkOwnerShipId = "";
          }
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
                      //$scope. $scope.businessDetails.OffPostalCode = "";
                  }
              })
          }
      }
      $scope.Init = function () {

          if (typeof (Storage) !== "undefined") {
              var business = localStorage['businessDetail'];
              $scope.businessDetails = JSON.parse(business);
          }
          getPersonByPersonId($rootScope.loggedInUser.personId);

          //  loadLoanAccountById($state.params.Id);
          loadQualifications();
          loadMaritalStatus();
          loadBusinessOwnerships();

      }


      function loadBusinessOwnerships() {
          ownership_HeaderRepository.GetAll(function (callback) {
              $scope.businessOwnerships = callback;
              console.log("businessOwnerships", callback)
          })
      }

      $scope.isPanNumberExist = function (personId, panNumenr, indexOfApplicantArray) {
          $scope.applicantsArray[indexOfApplicantArray].panAlreadyExist = false;
          if (panNumenr != null)
              if (!panNumenr.length > 0)
                  return
          if (!personId > 0)
              personId = 0;
          personRepository.PersonPanValication(personId, panNumenr, function (result) {
              $scope.applicantsArray[indexOfApplicantArray].panAlreadyExist = result;
          })

      }




      //Get Person Details by PanNumber
      $scope.getPersonByPan = function (panNumber, indexOfApplicantArray) {
          if (!panNumber == 10) {
              return;
          }
          $scope.indexOfApplicantArray = indexOfApplicantArray;
          if (panNumber)
              personRepository.getByPan(panNumber, function (callback) {
                  console.log("per verification callback", callback);
                  if (callback.Id > 0) {
                      //  $scope.applicantsArray[$scope.indexOfApplicantArray].Person.PanNumber = "";
                      callback.DOB = moment(callback.DOB, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY');
                      $scope.prsonDetailsByPan = callback;
                      $scope.applicantsArray[$scope.indexOfApplicantArray].panAlreadyExist = true;
                      //if ($scope.isBorrower == false) {
                      //    $('#PersonWantUseExistingDetails').modal('show');
                      //}

                  } else {
                      $scope.applicantsArray[$scope.indexOfApplicantArray].panAlreadyExist = false;
                  }
                  //console.log('$scope.prsonDetailsByPan', $scope.prsonDetailsByPan);
              })
          else {
              //$scope.applicantsArray[$scope.indexOfApplicantArray].Person = $scope.Person;
          }
      }
      function loadMaritalStatus() {
          maritalstatusRepository.Get(function (callback) {
              $scope.maritalstatus = callback;
          })
      }
      function loadQualifications() {
          ownerQualificationRepository.GetOwnerQualification(function (callback) {
              $scope.qualifications = callback;
              console.log("qualification", callback);
          })
      }
      function loadLoanAccountById(id) {

          //loadLoanPurposes();
          //if ($scope.loanAccount.FKProductId) {
          //    $scope.loadProductById($scope.loanAccount.FKProductId);
          //}
          //else {
          //    $scope.loadProductById($state.params.productId);
          //}

          //if (id) {
          //    loanAccountRepository.getById(id, function (callback) {
          //        callback.FKProductId += "";
          //        $scope.loanAccount = callback;

          //        console.log('$scope.loanAccount', $scope.loanAccount);
          //    })

          //}
      }
      $scope.goToReferences = function () {
          $scope.applicantUpdate = [];

          var validPan = true;
          for (var i = 0; i < $scope.applicantsArray.length; i++) {
              if ($scope.applicantsArray[i].Person.IsPanVerified == false || $scope.applicantsArray[i].ValidFirstName == false || $scope.applicantsArray[i].ValidLastName == false) {
                  validPan = false;
                  break;
              }
          }
          if (validPan || true) {
              var total = 0;
              var IsInvalid = false;
              if ($scope.IsAgeValidated == true) {
                  angular.forEach($scope.applicantsArray, function (applicant) {

                      if (applicant.OwnershipPer) {
                          total += parseFloat(applicant.OwnershipPer);
                      }

                      if (applicant.form.$invalid || $scope.EmailAlreadyExist || $scope.MobilealreadyExist || applicant.panAlreadyExist || applicant.EmailAlreadyExist || applicant.MobilealreadyExist) {
                          applicant.showForm = true;
                          applicant.ShowValidationError = true;

                          if (!IsInvalid)
                              IsInvalid = true;
                      }
                      else {
                          applicant.showForm = false;
                          applicant.ShowValidationError = false;
                          applicant.Person.DOB = moment(applicant.Person.DOB, 'DD/MM/YYYY').format('MM/DD/YYYY');
                          $scope.applicantUpdate.push(applicant);
                          //if (applicant.ApplicantId > 0) {
                          //    $scope.applicantUpdate.push(applicant);
                          //    //applicantRepository.Update(applicant, function (callback) {
                          //    //    applicant = callback;
                          //    //    if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
                          //    //        $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
                          //    //        loanAccountRepository.Update($scope.loanAccount, function (callback) {
                          //    //        })

                          //    //    }
                          //    //})
                          //}
                          //else {
                          //    applicantRepository.Save(applicant, function (callback) {
                          //        applicant = callback;
                          //        if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
                          //            $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
                          //            loanAccountRepository.Update($scope.loanAccount, function (callback) {
                          //            })

                          //        }

                          //    });
                          //}
                      }
                  })
                  if ($scope.applicantUpdate.length > 0) {
                      $scope.updateLoanAccountList = [];
                      //if there is only one applicant that time we are hiding the save button and continue ill work same as save button
                      if ($scope.applicantsArray.length == 1) {
                          applicantRepository.updateApplicantList($scope.applicantUpdate, function (callback) {
                              //Update LoanAccount
                              angular.forEach($scope.applicantUpdate, function (applicant) {
                                  if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
                                      $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
                                      $scope.loanAccount.LoanAccountId = applicant.FKLoanAccountId;
                                      $scope.updateLoanAccountList.push($scope.loanAccount)
                                      //$scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
                                      //loanAccountRepository.Update($scope.loanAccount, function (callback) {
                                      //})
                                  }
                              })

                              $scope.updateFKBorrowerIdLoanAccount($scope.updateLoanAccountList);

                              //console.log("update save", callback)
                              //applicant = callback;
                              //if (applicant.FKPersonId > 0 && applicant.FKPersonId != $scope.loanAccount.FKBorrowerId && applicant.IsMainApplicant == true) {
                              //    $scope.loanAccount.FKBorrowerId = $rootScope.loggedInUser.personId;
                              //    loanAccountRepository.Update($scope.loanAccount, function (callback) {
                              //    })
                              //}
                          })
                      }


                  }

                  if (!IsInvalid)
                      if ($scope.businessDetails.FKBusinessConstitutionId != 2) {
                          if (total == 100) {
                              $scope.ownershipErrr = false;
                              $state.go("borrower.application.references", { productId: $state.params.productId, Id: $state.params.Id });
                              //manageLiner('step4');
                          }
                          else {
                              $scope.ownershipErrr = true;
                          }
                      }
                      else {
                          $scope.ownershipErrr = false;
                          $state.go("borrower.application.references", { productId: $state.params.productId, Id: $state.params.Id });
                          //manageLiner('step4');
                      }
              }
          }

      }
      $scope.updateFKBorrowerIdLoanAccount = function (loanAccounts) {
          loanAccountRepository.UpdateFKBorrowerId(loanAccounts, function (callback) {
          })
      }

      $scope.loadMainApplicant = function () {
          var HasView = false;
          applicantRepository.GetWithPersonByLoanAccountId(parseInt($state.params.Id), function (callback) {

              console.log("GetWithPersonByLoanAccountId", callback)
              $scope.applicantsArray = [];

              var IsPropritor = false;
              var noOfPartener = 0;

              angular.forEach(callback, function (applicant, i) {
                  applicant.form;
                  if (callback.length == 1)
                      applicant.showForm = $scope.businessDetails.FKBusinessConstitutionId == 2 ? true : false;
                  if (applicant.IsMainApplicant) {
                      IsPropritor = $scope.businessDetails.FKBusinessConstitutionId == 2 ? true : false;
                      noOfPartener = $scope.businessDetails.NoOfPartner;
                  }

                  if (!HasView && !(applicant.FKPersonId > 0)) {
                      applicant.showForm = true;
                      HasView = true;
                  }

                  applicant.ShowValidationError = false;
                  console.log("applicant detail", applicant);

                  if (applicant.Person != null) {
                      //getPersonByPersonId(applicant.Person.PersonId);
                      if (applicant.Person.DOB != null) {
                          applicant.Person.DOB = moment(applicant.Person.DOB, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY');
                          //console.log(applicant.Person.DOB);
                      }

                  }
                  else {
                      applicant.Person = $scope.Person;
                      if ($scope.businessDetails.BusinessConstitutionName == "Proprietorship" && $scope.businessDetails != null &&
                          applicant.IsMainApplicant == true && $scope.isBorrower == false) {
                          applicant.OwnershipPer = 100;

                      } else if ($scope.businessDetails.BusinessConstitutionName == "Proprietorship" && applicant.IsMainApplicant == true &&
                          $scope.isBorrower == true) {
                          var UpdatedPerson = {
                              Name: $scope.personDetailOfLogedInUser.Name, FirstName: $scope.personDetailOfLogedInUser.FirstName, MiddleName: $scope.personDetailOfLogedInUser.MiddleName,
                              LastName: $scope.personDetailOfLogedInUser.LastName, FatherName: $scope.personDetailOfLogedInUser.FatherName, Gender: $scope.personDetailOfLogedInUser.Gender,
                              DOB: $scope.personDetailOfLogedInUser.DOB, FKOwnerQualificationId: $scope.personDetailOfLogedInUser.FKOwnerQualificationId, FKMaritalStatusId: $scope.personDetailOfLogedInUser.FKMaritalStatusId,
                              NoOfDependent: $scope.personDetailOfLogedInUser.NoOfDependent,
                              PanNumber: $scope.personDetailOfLogedInUser.PanNumber,
                              adhaarCardNumber: $scope.personDetailOfLogedInUser.adhaarCardNumber,
                              SameAsBusinessAddress: $scope.personDetailOfLogedInUser.SameAsBusinessAddress, AddressLine1: $scope.personDetailOfLogedInUser.AddressLine1,
                              AddressLine2: $scope.personDetailOfLogedInUser.AddressLine2, Landmark: $scope.personDetailOfLogedInUser.Landmark, Pincode: $scope.personDetailOfLogedInUser.Pincode,
                              CityName: $scope.personDetailOfLogedInUser.CityName, State: $scope.personDetailOfLogedInUser.State, WorkPhone: $scope.personDetailOfLogedInUser.WorkPhone, MobilePhone: $scope.personDetailOfLogedInUser.MobilePhone,
                              EmailId: $scope.personDetailOfLogedInUser.EmailId, FkOwnerShipId: $scope.personDetailOfLogedInUser.FkOwnerShipId, Samelocationresidence: true, AddressLine1_Permanent1: $scope.personDetailOfLogedInUser.AddressLine1_Permanent1,
                              AddressLine1_Permanent2: $scope.personDetailOfLogedInUser.AddressLine1_Permanent2, Pin_Permanent: $scope.personDetailOfLogedInUser.Pin_Permanent, City_Permanent: $scope.personDetailOfLogedInUser.City_Permanent,
                              State_Permanent: $scope.personDetailOfLogedInUser.State_Permanent, FKOwerShip_Prmnt_Id: $scope.personDetailOfLogedInUser.FKOwerShip_Prmnt_Id, PersonId: $scope.personDetailOfLogedInUser.PersonId,
                              PhoneNumber_Permanent: $scope.personDetailOfLogedInUser.PhoneNumber_Permanent, MobilePhone_Permanent: $scope.personDetailOfLogedInUser.MobilePhone_Permanent, EmailId_Permanent: $scope.personDetailOfLogedInUser.EmailId_Permanent
                          }
                          applicant.OwnershipPer = 100;
                          if (UpdatedPerson.PanNumber == null) {
                              UpdatedPerson.PanNumber = $scope.businessDetails.PANCardNo;
                          }
                          applicant.FKPersonId = $scope.personDetailOfLogedInUser.PersonId;
                          applicant.Person = UpdatedPerson;
                      }
                      else if ($scope.businessDetails.BusinessConstitutionName != "Proprietorship" && applicant.IsMainApplicant == true && $scope.isBorrower == true) {

                          //applicant=$scope.personDetailOfLogedInUser.OwnershipPer;
                          var UpdatedPerson = {
                              Name: $scope.personDetailOfLogedInUser.Name, FirstName: $scope.personDetailOfLogedInUser.FirstName, MiddleName: $scope.personDetailOfLogedInUser.MiddleName,
                              LastName: $scope.personDetailOfLogedInUser.LastName, FatherName: $scope.personDetailOfLogedInUser.FatherName, Gender: $scope.personDetailOfLogedInUser.Gender,
                              DOB: $scope.personDetailOfLogedInUser.DOB, FKOwnerQualificationId: $scope.personDetailOfLogedInUser.FKOwnerQualificationId, FKMaritalStatusId: $scope.personDetailOfLogedInUser.FKMaritalStatusId,
                              NoOfDependent: $scope.personDetailOfLogedInUser.NoOfDependent, PanNumber: $scope.personDetailOfLogedInUser.PanNumber, adhaarCardNumber: $scope.personDetailOfLogedInUser.adhaarCardNumber,
                              SameAsBusinessAddress: $scope.personDetailOfLogedInUser.SameAsBusinessAddress, AddressLine1: $scope.personDetailOfLogedInUser.AddressLine1,
                              AddressLine2: $scope.personDetailOfLogedInUser.AddressLine2, Landmark: $scope.personDetailOfLogedInUser.Landmark, Pincode: $scope.personDetailOfLogedInUser.Pincode,
                              CityName: $scope.personDetailOfLogedInUser.CityName, State: $scope.personDetailOfLogedInUser.State, WorkPhone: $scope.personDetailOfLogedInUser.WorkPhone, MobilePhone: $scope.personDetailOfLogedInUser.MobilePhone,
                              EmailId: $scope.personDetailOfLogedInUser.EmailId, FkOwnerShipId: $scope.personDetailOfLogedInUser.FkOwnerShipId, Samelocationresidence: true, AddressLine1_Permanent1: $scope.personDetailOfLogedInUser.AddressLine1_Permanent1,
                              AddressLine1_Permanent2: $scope.personDetailOfLogedInUser.AddressLine1_Permanent2, Pin_Permanent: $scope.personDetailOfLogedInUser.Pin_Permanent, City_Permanent: $scope.personDetailOfLogedInUser.City_Permanent,
                              State_Permanent: $scope.personDetailOfLogedInUser.State_Permanent, FKOwerShip_Prmnt_Id: $scope.personDetailOfLogedInUser.FKOwerShip_Prmnt_Id, PersonId: $scope.personDetailOfLogedInUser.PersonId,
                              PhoneNumber_Permanent: $scope.personDetailOfLogedInUser.PhoneNumber_Permanent, MobilePhone_Permanent: $scope.personDetailOfLogedInUser.MobilePhone_Permanent, EmailId_Permanent: $scope.personDetailOfLogedInUser.EmailId_Permanent
                          }
                          applicant.FKPersonId = $scope.personDetailOfLogedInUser.PersonId;
                          applicant.Person = UpdatedPerson;

                      }

                      //if (applicant.Person)
                      //    $scope.validateApplicantPan(applicant);
                  }
                  applicant.MakeMobileNumberFieldDisable = false;
                  applicant.MakePanNumberFieldDisable = false;
                  if (applicant.Person.PersonId != null) {
                      if (applicant.Person.PersonId == $rootScope.loggedInUser.personId) {
                          applicant.MakeMobileNumberFieldDisable = true;
                          applicant.MakePanNumberFieldDisable = true;
                      }

                      else
                          applicant.MakeMobileNumberFieldDisable = false;
                      console.log("applicants", applicant);
                  }
                  $scope.applicantsArray.push(applicant);
              })

              if (!IsPropritor && (callback.length != noOfPartener)) {
                  var i = 0;
                  for (i = 0; i < (noOfPartener - callback.length) ; i++) {
                      $scope.applicant = {
                          ApplicantId: 0,
                          form: {},
                          IsMainApplicant: false,
                          FKLoanAccountId: $state.params.Id,
                          ValidFirstName: true, ValidLastName: true, PanStatus: PANSTATUS.INITIAL,
                          Person: {
                              Name: '', FirstName: '', MiddleName: '', LastName: '', FatherName: '', Gender: '', DOB: '', FKOwnerQualificationId: '', FKMaritalStatusId: '',
                              NoOfDependent: '', PanNumber: '', adhaarCardNumber: '', SameAsBusinessAddress: '', AddressLine1: '', AddressLine2: '',
                              Landmark: '', Pincode: '', CityName: '', State: '', WorkPhone: '', MobilePhone: '', EmailId: '', FkOwnerShipId: '', Samelocationresidence: true,
                              AddressLine1_Permanent1: '', AddressLine1_Permanent2: '', Pin_Permanent: '', City_Permanent: '', State_Permanent: '', FKOwerShip_Prmnt_Id: '',
                              PhoneNumber_Permanent: '', MobilePhone_Permanent: '', EmailId_Permanent: ''
                          },
                      };
                      if (!HasView) {
                          $scope.applicant.showForm = true;
                          HasView = true;
                      }
                      $scope.applicant.MakeMobileNumberFieldDisable = false;
                      if ($scope.applicant.Person.PersonId > 0) {
                          if (applicant.Person.PersonId == $rootScope.loggedInUser.personId)
                              $scope.applicant.MakeMobileNumberFieldDisable = true;
                          else
                              $scope.applicant.MakeMobileNumberFieldDisable = false;
                          console.log("applicants", $scope.applicant);
                      }
                      $scope.applicantsArray.push($scope.applicant);
                  }
              }
              console.log("applicantsArray", $scope.applicantsArray)
          })
      }

      //Getting person details of loged In User
      function getPersonByPersonId(personId) {
          // var deferred = new $.Deferred();
          personRepository.GetById(personId, function (callback) {
              if (callback.DOB)
                  callback.DOB = moment(callback.DOB, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY');
              $scope.personDetailOfLogedInUser = callback;
              $scope.loadMainApplicant();
              console.log('$scope.personDetailOfLogedInUser', $scope.personDetailOfLogedInUser);
              //deferred.resolve(true);
          })
          // deferred.resolve(false);
      }

      //$scope.checkEmailExist = function (Email, i) {
      //    if (Email != $scope.personDetailOfLogedInUser.EmailId && Email)
      //        personRepository.IsEmailExists(Email, function (emailCallback) {
      //            $scope.applicantsArray[i].EmailAlreadyExist = emailCallback;
      //        })
      //    else
      //        $scope.applicantsArray[i].EmailAlreadyExist = false;
      //}

      $scope.checkEmailExist = function (personId, Email, indexOfApplicantArray) {
          debugger;
          $scope.applicantsArray[indexOfApplicantArray].EmailAlreadyExist = false;
          if (Email != null)
              if (!Email.length > 0)
                  return
          if (!personId > 0)
              personId = 0;
          personRepository.IsPersonExistWithEmailId(personId, Email, function (result) {
              $scope.applicantsArray[indexOfApplicantArray].EmailAlreadyExist = result;
          })
      }
      $scope.checkMobileExist = function (personId, mobile, indexOfApplicantArray) {
          $scope.applicantsArray[indexOfApplicantArray].MobilealreadyExist = false;
          if (mobile != null)
              if (!mobile.length > 0)
                  return
          if (!personId > 0)
              personId = 0;
          personRepository.IsPersonExistWithphoneNumber(personId, mobile, function (result) {
              $scope.applicantsArray[indexOfApplicantArray].MobilealreadyExist = result;
          })
      }
      //$scope.checkMobileExist = function (mobileNo, i) {
      //    if (mobileNo != $rootScope.loggedInUser.Mobile && mobileNo)
      //        personRepository.IsPhoneExists(mobileNo, function (callback) {
      //            $scope.applicantsArray[i].MobilealreadyExist = callback;
      //        })
      //    else
      //        $scope.applicantsArray[i].MobilealreadyExist = false;
      //}
      //function loadLoanPurposes() {
      //    loanPurposeRepository.GetAll(function (callback) {
      //        $scope.LoanPurposes = callback;
      //    })
      //}
      $scope.loadProductById = function (id) {
          //angular.forEach($scope.ProductGroups, function (productGroup, i) {
          //    console.log("product group", $scope.ProductGroups)
          //    angular.forEach(productGroup.ProductList, function (productitem, i) {
          //        console.log(productitem, "is is", id);
          //        if (productitem.ID == id) {
          //            debugger;
          //            console.log(productitem);
          //            $scope.product = productitem;
          //            //$scope.loanDetail.amount = $scope.product.MinAmount;
          //            //$scope.loanAccount.Amount = $scope.product.MinAmount;
          //            //$scope.loanAccount.FKProductId = $scope.product.ID;
          //            //Get loan terms according to product
          //            $scope.LoanTerms = [];
          //            //for (var i = $scope.product.MinLoanTerm; i <= $scope.product.MaxLoanTerm; i++) {
          //            //    $scope.LoanTerms.push(i);
          //            //}
          //            console.log("hittt");
          //        }
          //    })
          //})
      }

      $scope.Init();

  });



