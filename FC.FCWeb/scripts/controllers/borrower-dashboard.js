'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:BorrowerDashboardControllerCtrl
 * @description
 * # BorrowerDashboardControllerCtrl
 */
angular.module('craditKartApp')
  .controller('BorrowerDashboardCtrl', function ($scope, $auth, $state, $timeout, $http, CONSTANT, toastr, $location, $rootScope, loanAccountRepository, loanRepository, facilityRepository,
      loanDocumentRepository, loanActionRepository, documentRepository, applicantRepository, productDocumentTypeRepository, documentCategoryRepository, loanStageRepository,
      businessRepository, adviceRepository, logRepository, documentTypeRepository, notificationRepository, installmentRepository, otpRepository, personRepository, authTokenRepository, personRoleRepository, productGroupRepository, productRepository) {

      // VARIABLES DECLARATION/INITIALIZATION

      $scope.isSalesAgent = false;
      $rootScope.hideHeader = false;
      $rootScope.hideFooter = false;
      $scope.applicationPerPage = 5;
      // $scope.loanApplicationCurrentPage = 1;
      $scope.facilitiesCurrentPage = 1;
      $scope.activeTab = 'dashboard';
      $scope.applications = [];
      $scope.facilities = [];
      $scope.selectedLoanId = 0;
      $scope.businessDetails = {};
      $scope.LoanAccountId;
      $scope.ProductId;
      $scope.viewUploadOfferLetterSec = false;
      $scope.ShowUpldDoumentMsg = false;
      $scope.SelectedLoanActionId;
      $scope.EligibilForDocSubmit = false;
      $scope.HasUpldDocLA = false;
      $scope.HasAcceptOfferLtrLA = false;
      $scope.HasUpldOfferLetterLA = false;
      $scope.SanctionDocument = {
          Document: []
      };


      // FUNCTION DECLARATION
      //$scope.getApplications = getApplications;
      // $scope.gotoLoan = gotoLoan;
      $scope.getFacilities = getFacilities;
      $scope.editApplication = editApplication;
      $scope.getNotifications = getNotifications;

      console.log($state.params.Id);
      //get all user notifications
      function getNotifications() {

          notificationRepository.GetByLoggedInPerson(function (callback) {
              $scope.notifications = callback;
              //console.log("Notifications", $scope.notifications);

          })
      }


      $scope.HideNotification = function (id) {
          notificationRepository.HideById(id, function (callback) {
              location.reload();
          })
      }

      // $scope.numberOfApplications = -1;
      //Get Total Number Of Applications
      //loanAccountRepository.getTotalApplicationCount($auth.authentication.personId, function (callback) {
      //    $scope.totalNumberOfApplication = callback;
      //})

      // get all applications
      //function getApplications(loanApplicationCurrentPage) {
      //    $scope.numberOfApplications = -1;
      //    var begin = (loanApplicationCurrentPage - 1) * $scope.applicationPerPage;
      //    var end = $scope.applicationPerPage;
      //    $scope.applications = [];
      //    if ($auth.isAuthenticated()) {
      //        loanAccountRepository.GetApplicationsTimeLineDtl($auth.authentication.personId, begin, end, function (loanApplications) {
      //            $scope.applications = loanApplications;
      //            //angular.forEach($scope.applications, function (app) {
      //            //    if (app.Status != 'Draft') {
      //            //        personRoleRepository.CheckForBorrower($rootScope.loggedInUser.personId, function (callback) {
      //            //            if (callback == true)
      //            //            loanActionRepository.GetPendingActionforBorrower(parseInt(app.LoanAccountId), 0, function (loanActions) {
      //            //                if (loanActions != null) {
      //            //                    app.LoanActions = loanActions;
      //            //                }
      //            //            })

      //            //        })       
      //            //    }
      //            //})
      //            console.log("applications:", $scope.applications);
      //            $scope.totalApplications = $scope.applications.length;
      //        })
      //    }
      //}

      ////Search From All the Applications
      //$scope.searchFromApplications = function (searchText, currentPage, pageSize) {
      //    $scope.request = {
      //        SearchText: searchText,
      //        CustomId: $auth.authentication.personId,
      //        CurrentPage: currentPage,
      //        PageSize: pageSize
      //    };

      //    if (searchText) {
      //        loanAccountRepository.searchFromApplicationsCount($scope.request, function (callback) {
      //            $scope.numberOfApplications = callback;
      //            if ($scope.numberOfApplications > 0)
      //                loanAccountRepository.searchFromApplications($scope.request, function (loanApplications) {
      //                    $scope.applications = loanApplications;

      //                })
      //        })
      //    }
      //    else
      //        getApplications($scope.loanApplicationCurrentPage);
      //    console.log("searchFromApplications");
      //}
      // get all approved loan
      function getFacilities(currentPage) {
          if ($auth.isAuthenticated()) {
              facilityRepository.GetForLoggedInUser(function (data) {
                  $scope.facilities = data;
                  //window.scrollTo(0, 0);
              });
          }
      }

      //get all laons
      //function getLoans() {
      //    //loanRepository.GetForLoggedInUser_FE(function (callback) {

      //    //    $scope.Loans = callback;
      //    //    console.log("$scope.Loans", $scope.Loans);

      //    //    if ($scope.Loans.length > 0)
      //    //        $scope.SelectedLoanChanged($scope.Loans[0]);
      //    //})
      //}

      function gotoLoan(loanId) {
          $scope.selectedLoanId = loanId;
          $state.go('borrower.dashboard.loan_details', { id: loanId })
      }

      ////Upload Document
      //$scope.ManageLoanAction = function (loanAccount, loanAction) {
      //    var template = "";
      //    $scope.LoanAccount = loanAccount;
      //    $scope.LoanAccountId = loanAccount.LoanAccountId;
      //    $scope.ProductId = loanAccount.FKProductId;
      //    template = loanAction.LoanActionType.templateUrl;
      //    $scope.SelectedLoanActionId = loanAction.LoanActionId;

      //    //console.log("loanAction", loanAction);
      //    switch (template) {
      //        case '#upldDoc':
      //            {
      //                $scope.OpenUploadDocLA(loanAccount);
      //                break;
      //            }
      //        case '#viewSanctionLetter':
      //            {
      //                $scope.viewSanctionLetter(loanAccount);
      //                break;
      //            }
      //        case '#uploadOfferLetter':
      //            {
      //                $(template).modal('show');
      //                break;
      //            }
      //    }


      //}

      //$scope.uploadOfferLetter = function (loan) {
      //    $('#uploadOfferLetter').modal('show');
      //    $scope.LoanAccountId = loan.LoanAccountId;
      //    $scope.ProductId = loan.FKProductId;
      //    $scope.LoanAccount = loan;
      //    viewSanctionLetter();
      //}





      //$scope.viewSanctionLetter = function (loan) {
      //    $('#viewSanctionLetter').modal('show');
      //    $scope.LoanAccountId = loan.LoanAccountId;
      //    $scope.ProductId = loan.FKProductId;
      //    $scope.LoanAccount = loan;
      //    viewSanctionLetter();
      //}

      $scope.OpenUploadDocLA = function (loan) {
          $('#upldDoc').modal('show');
          $scope.LoanAccountId = loan.LoanAccountId;
          $scope.ProductId = loan.FKProductId;
          $scope.LoanAccount = loan;
          loadDefaultDocuments();

      }

      //$scope.OfferAcceptedByBorrower = function () {
      //    loanActionRepository.OfferAcceptedByBorrower($scope.LoanAccount.LoanAccountId, function (callback) {
      //        $scope.SaveOfferLetter();
      //    })
      //}

      //function viewSanctionLetter() {
      //    $scope.Status = "Not Included";
      //    $scope.loading = true;
      //    loanDocumentRepository.GetSanctionedLetterLoanDoc($scope.LoanAccountId, function (callback) {
      //        $scope.LoanDocuments = callback;
      //        loanAccountRepository.GetLoanAccount($scope.LoanAccountId, function (callback) {
      //            $scope.LoanData = callback;
      //            console.log("$scope.LoanData", $scope.LoanData);

      //            //Get Mainapplicant business Dtails
      //            businessRepository.GetMainApplicantBusiness($scope.LoanAccountId, function (callback) {
      //                $scope.Business = callback;

      //                adviceRepository.GetByProduct($scope.ProductId, function (callback) {
      //                    $scope.Advices = callback;
      //                    angular.forEach($scope.Advices, function (adv, i) {
      //                        if (adv.FKAdviceTypeId == 9) {
      //                            GetDocument(adv.AdviceId);
      //                            $scope.docType = "Sanction Letter";
      //                        }
      //                    })

      //                    angular.forEach($scope.LoanDocuments, function (loanDoc, i) {
      //                        if (loanDoc.FKDocumentTypeId == 18) {
      //                            if (loanDoc.IsDocSent)
      //                                $scope.Status = "Sent to Borrower";
      //                            else if (loanDoc.IsIncluded)
      //                                $scope.Status = "Included";
      //                        }
      //                    })
      //                    $scope.loading = false;
      //                })
      //            })
      //        })
      //    })
      //}

      //function GetDocument(AdviceId) {
      //    loanActionRepository.GetAdviceLetter($scope.LoanAccountId, AdviceId, 0, 0, function (callback) {
      //        var newTag = "<object data='data:" + callback.DocType + ";base64, " + callback.data + "' type='" + callback.DocType + "' style='width: 840px;height: 500px;margin-left: 5px;'></object>"
      //        $('#ViewSactionLetter').html(newTag);
      //        $scope.imgData = callback.data;
      //    })
      //}

      function DocumentSubmitEligibility() {
          $scope.EligibilForDocSubmit = true;
          angular.forEach($scope.DocumentTypes, function (docType) {
              angular.forEach(docType.LoanDocuments, function (lDoc) {
                  if ($scope.EligibilForDocSubmit)
                      if (!lDoc.FKDocumentId > 0) {
                          $scope.EligibilForDocSubmit = false;
                      }
              })
          })
      }

      //$scope.RequestCallBack = function () {
      //    loanAccountRepository.GenerateRequestForDiscussion($scope.LoanAccountId, function (callback) {
      //        $scope.LoanAccount = callback;
      //        $('#viewSanctionLetter').modal('hide');
      //        getApplications(1);
      //        console.log("request call back");
      //    })
      //}

      $scope.AcceptOfferLetter = function () {
          $scope.viewUploadOfferLetterSec = true;
      }

      //Accept offer letter
      //$scope.SaveOfferLetter = function () {
      //    loanAccountRepository.GetLoanAccount($scope.LoanAccount.LoanAccountId, function (res) {
      //        $scope.ResLoanAcc = res;
      //        $scope.ResLoanAcc.IsAccepted_OL = 'Y';
      //        loanActionRepository.CompleteAllLA_Doc($scope.LoanAccount.LoanAccountId, function () {
      //            loanAccountRepository.Update($scope.ResLoanAcc, function (call1) {

      //                loanActionRepository.GetFilterList("GetAllByLoanId", $scope.LoanAccount.LoanAccountId, function (callback) {
      //                    if (callback != null && callback.length > 0) {
      //                        angular.forEach(callback, function (LoanAction, index) {
      //                            if (LoanAction.FKLoanActionTypeId == 22) {
      //                                LoanAction.IsVisible = true;
      //                                LoanAction.FKLoanActionStatusId = 1;
      //                                LoanAction.LoanActionStatu = null;
      //                                LoanAction.Description = $scope.Description;
      //                                loanActionRepository.Update(LoanAction, function (loanAction) {
      //                                    if (index == callback.length - 1) {
      //                                        getApplications(1);
      //                                        console.log("loanAction repository if");
      //                                        $scope.CloseDocPopup();
      //                                    }
      //                                })
      //                            }
      //                            else {
      //                                if (index == callback.length - 1) {
      //                                    getApplications(1);
      //                                    console.log("loanAction repository else");
      //                                    $scope.CloseDocPopup();
      //                                }
      //                            }
      //                        });
      //                    }
      //                })
      //            });
      //        })
      //    })
      //}

      //// Loan Action Reprocess      
      //function Reprocess() {
      //    loanDocumentRepository.GetByLoanAccountId($scope.LoanAccountId, function (call1) {
      //        $scope.LoanDocuments = call1;

      //        angular.forEach($scope.LoanDocuments, function (result, i) {
      //            if (result.FKDocumentTypeId == 18) {
      //                $scope.LoanDocuments[i].IsDocSent = false;
      //                $scope.LoanDocuments[i].IsIncluded = false;
      //                loanDocumentRepository.UpdateFebLoandocument($scope.LoanDocuments[i].IsDocSent, $scope.LoanDocuments[i].LoanDocumentId, 0, $scope.LoanDocuments[i].IsIncluded, 0, function (callback) {
      //                })
      //            }
      //        })
      //        loanActionRepository.HideBorrowerLA_Doc($scope.LoanAccountId, function () {
      //            loanAccountRepository.GetLoanAccount($scope.LoanAccountId, function (res) {
      //                $scope.ResLoanAcc = res;
      //                $scope.ResLoanAcc.IsAccepted_OL = 'N';
      //                $scope.ResLoanAcc.IsCV = 'Y';
      //                $scope.ResLoanAcc.IsPreDoc = 'N';
      //                loanAccountRepository.Update($scope.ResLoanAcc, function (call1) {
      //                    loanStageRepository.ActivateCVStage($scope.LoanAccountId, function (res) {
      //                        getApplications(1);
      //                        console.log("get application reprocess");
      //                    })
      //                })
      //            })
      //        })
      //    })
      //}

      //Close popup
      //$scope.CloseDocPopup = function () {
      //    $('#upldDoc').modal('hide');
      //    $('#viewSanctionLetter').modal('hide');
      //    $('#uploadOfferLetter').modal('hide');
      //    $('#renewLoan').modal('hide');
      //    location.reload();
      //}

      //Save document
      //$scope.SaveDocument = function () {
      //    loanDocumentRepository.IsReqDoc_Uploaded_CV($scope.LoanAccount.LoanAccountId, function (callback) {
      //        console.log("callback", callback);
      //        if (callback == true) {
      //            //if ($scope.LoanAccount.HasApplied == true) {
      //            loanActionRepository.HideUploadDocLA_Borrower($scope.LoanAccount.LoanAccountId, function (callback) {
      //                $('#upldDoc').modal('hide');
      //                location.reload();
      //            })
      //            //}
      //            //else {
      //            //    loanAccountRepository.UpdateLoanApplicationStatu($scope.LoanAccount.LoanAccountId, 'Applied', function (callback) {
      //            //        loanActionRepository.HideUploadDocLA_Borrower($scope.LoanAccount.LoanAccountId, function (callback) {
      //            //            $('#upldDoc').modal('hide');
      //            //            location.reload();
      //            //        })
      //            //    })
      //            //}
      //        }
      //        else {
      //            $('#upldDoc').modal('hide');
      //            location.reload();
      //        }
      //    })

      //}

      //call the function
      function Init() {
          if ($state.current.name == 'borrower.dashboard.loans') {
              // getLoans();
          }
          else {
              //    getApplications(1);
          }
          //console.log("init state name", $state.current.name);
          //getLoans();
          //getApplications(1);
          //console.log("inside init functions");
      }

      Init();
      var applicationId2;
      var index2;

      /*----------------------  Step 4 ------------------------*/

      function loadDefaultDocuments() {

          loadDocumentType();
          loanApplicantDetail();
          loadDocumentCategory();
      }
      $scope.AddLoanDocument = function (documentType, criteria, id, loanAccountId, doc) {
          var flag = false;
          //angular.forEach(documentType.LoanDocuments, function (lDoc) {
          //    if (criteria == 0)
          //        if (!(lDoc.FKDocumentId > 0) && lDoc.ForBusiness == true && lDoc.FKBusinessId == $scope.MainApplicant.FKBusinessId) {
          //            flag = true;
          //        }
          //    if (criteria == 1)
          //        if (!(lDoc.FKDocumentId > 0) && lDoc.ForPerson == true && lDoc.FKPersonId == id) {
          //            flag = true;
          //        }
          //})
          if (!flag) {
              documentType.LoanDocuments.push({
                  FKLoanAccountId: $state.params.Id,
                  FKDocumentTypeId: documentType.DocumentTypeId,
                  IsMandatory: false,
                  IsDocSent: false,
                  ForPerson: criteria == 1 ? true : '',
                  FKPersonId: criteria == 1 ? id : '',
                  ForBusiness: criteria == 0 ? true : '',
                  FKBusinessId: criteria == 0 ? $scope.MainApplicant.FKBusinessId : '',
                  FKDocumentId: '',
                  IsDeleted: false,
                  //FKDocuemntCategoryId: documentType.HasSameCategory ? documentType.DocumentCategories[0].DocumentCategoryId : '',
                  Document: {
                      DocumentId: '',
                  }
              })
              var documentToUpload = documentType;
              $scope.UploadDocument(documentToUpload, documentType, criteria, id, loanAccountId, doc);
          }
      }

      $scope.UploadDocument = function (loanDocument, docType, criteria, id, LoanId, doc) {
          loanDocument.FKDocumentTypeId = docType.DocumentTypeId;

          loanDocument.FKLoanAccountId = LoanId;
          if (criteria == 0) {
              loanDocument.ForBusiness = true;
              loanDocument.FKBusinessId = $scope.MainApplicant.FKBusinessId;
          } else {
              loanDocument.ForPerson = true;
              loanDocument.FKPersonId = id;
          }

          var pass = "";

          var formData = new FormData();
          formData.append('File', doc);
          //loanDocument.Document[0]
          documentRepository.Create(formData, LoanId, pass, function (callback) {
              loanDocument.FKDocumentId = callback.DocumentId;
              loanDocument.Document = callback;
              if (loanDocument.LoanDocumentId > 0) {
                  loanDocumentRepository.Update(loanDocument, function (loanDocumentCallback) {
                      loadDefaultDocuments();
                  })
              } else {
                  loanDocumentRepository.Create(loanDocument, function (loanDocumentCallback) {
                      loadDefaultDocuments();
                  })
              }

          })
      }
      $scope.DeleteLoanDocument = function (lDocId) {
          loanDocumentRepository.Delete(lDocId, function (callback) {
              loadDefaultDocuments();
          })
      }

      function loadDocumentCategory() {
          documentCategoryRepository.GetAll(function (callback) {
              $scope.documentCategories = callback;
          })
      }

      function loanApplicantDetail() {
          applicantRepository.GetCoApplicantsByLoanAccountId($scope.LoanAccountId, function (coapp) {
              $scope.CoApplicants = coapp
              console.log("$scope.CoApplicants", $scope.CoApplicants);
              applicantRepository.GetMainApplicantByLoanAccountId($scope.LoanAccountId, function (callback) {
                  $scope.MainApplicant = callback;
                  console.log("$scope.MainApplicant", $scope.MainApplicant);
              });

              applicantRepository.GetApplicantsByLoanAccountId($scope.LoanAccountId, function (callback) {
                  $scope.Applicants = callback;
                  console.log("$scope.Applicants", $scope.Applicants);
              });



          })
      }

      function loadDocumentType() {
          loanAccountRepository.getById($scope.LoanAccountId, function (callback) {
              $scope.loanAccount = callback;

              documentTypeRepository.GetNonFebrictdConfiguredDocByProduct_CV($scope.ProductId, function (callback) {
                  $scope.DocumentTypes = callback;
                  console.log("$scope.DocumentTypes", $scope.DocumentTypes);

                  //Get already uploaded Doc
                  angular.forEach($scope.DocumentTypes, function (documentType) {

                      documentType.HasSameCategory = true;
                      if (documentType.DocumentCategories.length == 1) {
                          if (documentType.DocumentCategories[0].Name != documentType.Name)
                              documentType.HasSameCategory = false;
                      }


                      loanDocumentRepository.GetByDocTypeAndLoanAccountId($scope.LoanAccount.LoanAccountId, documentType.DocumentTypeId, function (callback) {
                          documentType.LoanDocuments = callback;
                          var ForBusinessCount = 0;
                          var ForPersonCount = 0;
                          angular.forEach(documentType.LoanDocuments, function (loanDoc) {
                              //if (documentType.HasSameCategory)
                              //    loanDoc.FKDocuemntCategoryId = documentType.DocumentCategories[0].DocumentCategoryId

                              if (!(loanDoc.ForBusiness == true || loanDoc.ForPerson == true)) {
                                  loanDoc.ForBusiness = documentType.ForBusiness;
                                  loanDoc.ForPerson = documentType.ForPerson;
                              }

                              if (loanDoc.ForBusiness == true)
                                  ForBusinessCount++;
                              if (loanDoc.ForPerson == true)
                                  ForPersonCount++;
                          });


                          angular.forEach($scope.loanAccount.Applicants, function (applicant) {
                              applicant.HasLoanDocument = false;

                              angular.forEach(documentType.LoanDocuments, function (loanDoc) {
                                  if (loanDoc.ForPerson == true && loanDoc.FKPersonId == applicant.FKPersonId)
                                      applicant.HasLoanDocument = true;
                              });

                          })


                      })
                  });







                  console.log("$scope.DocumentTypes", $scope.DocumentTypes);
              })
          })
      }


      $scope.DownloadDocument = function (id, fileName, loanId) {
          console.log(fileName);
          if (id == 0)
              id = $scope.PopUpImageID;

          var serviceBase = CONSTANT.HOST;
          $http({
              method: 'GET',
              cache: false,
              url: serviceBase + '/api/DownloadDocument',
              params: { LoanAccountId: loanId, documentId: id },
              responseType: 'arraybuffer',
              //headers: {
              //    'Content-Type': 'application/json; charset=utf-8'
              //}
          }).success(function (data, status, headers) {

              var octetStreamMime = 'application/octet-stream';
              var success = false;

              // Get the headers
              headers = headers();
              // Get the filename from the x-filename header or default to "download.bin"
              var filename = headers['x-filename'] || fileName;

              // Determine the content type from the header or default to "application/octet-stream"
              var contentType = headers['content-type'] || octetStreamMime;
              try {

                  // Try using msSaveBlob if supported

                  var blob = new Blob([data], { type: contentType });
                  if (navigator.msSaveBlob)
                      navigator.msSaveBlob(blob, filename);
                  else {
                      // Try using other saveBlob implementations, if available
                      var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
                      if (saveBlob === undefined) throw "Not supported";
                      saveBlob(blob, filename);
                  }
                  success = true;
              } catch (ex) {
              }
              if (!success) {
                  // Get the blob url creator
                  var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                  if (urlCreator) {
                      // Try to use a download link
                      var link = document.createElement('a');
                      if ('download' in link) {
                          // Try to simulate a click
                          try {
                              // Prepare a blob URL
                              var blob = new Blob([data], { type: contentType });
                              var url = urlCreator.createObjectURL(blob);
                              link.setAttribute('href', url);

                              // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                              link.setAttribute("download", filename);

                              // Simulate clicking the download link
                              var event = document.createEvent('MouseEvents');
                              event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                              link.dispatchEvent(event);
                              success = true;

                          } catch (ex) {
                          }
                      }
                      if (!success) {
                          // Fallback to window.location method
                          try {
                              // Prepare a blob URL
                              // Use application/octet-stream when using window.location to force download
                              var blob = new Blob([data], { type: octetStreamMime });
                              var url = urlCreator.createObjectURL(blob);
                              window.location = url;
                              success = true;
                          } catch (ex) {
                          }
                      }

                  }
              }

              if (!success) {
                  // Fallback to window.open method
                  window.open(httpPath, '_blank', '');
              }
              /******************/


          }).error(function (data, status) {


              // Optionally write the error out to scope
          });
      }

      function loadAllApplicantsForKYC() {
          applicantRepository.GetByLoanAccountId($state.params.Id, function (callback) {
              $scope.applicants = callback;
              loanDocumentRepository.GetByLoanAccountId($state.params.Id, function (callback) {
                  $scope.businessBankDocs = [];
                  $scope.businessAddressProof = [];
                  $scope.businessPAN = [];
                  for (var i = 0; i < $scope.applicants.length; i++) {
                      if ($scope.applicants[i].IsMainApplicant == true) {
                          $scope.MainApplicant = $scope.applicants[i].IsMainApplicant;
                      }
                      $scope.applicants[i].docCount = 0;
                  }
                  var bankStatementsCount = 0;
                  var addressProofCount = 0;
                  var businessPANCount = 0;
                  for (var i = 0; i < callback.length; i++) {
                      if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 4) {
                          bankStatementsCount += 1;
                      }
                      else if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 1 && callback[i].ForBusiness == true) {
                          addressProofCount += 1;
                      }
                      else if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 2) {
                          businessPANCount += 1;
                      }
                      else if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 1 && callback[i].ForPerson == true) {
                          //$scope.applicants[j].
                          for (var j = 0; j < $scope.applicants.length; j++) {
                              if ($scope.applicants[j].FKPersonId == callback[i].FKPersonId) {
                                  $scope.applicants[j].docCount += 1;
                              }
                          }
                      }
                  }
                  if (bankStatementsCount == 0) {
                      $scope.defaultDoc = {};
                      $scope.defaultDoc.showDropdown = false;
                      $scope.businessBankDocs.push($scope.defaultDoc);
                  }
                  if (addressProofCount == 0) {
                      $scope.businessAddressProof = [
                        {
                            showDropdown: false
                        }]
                  }
                  if (businessPANCount == 0) {
                      $scope.businessPAN = [{
                          showDropdown: false
                      }]
                  }
                  for (var i = 0; i < $scope.applicants.length; i++) {
                      if ($scope.applicants[i].docCount == 0) {
                          $scope.applicants[i].guarantorKycAddressProofDocs = [{
                              showDropdown: false
                          }]
                      }
                  }
                  angular.forEach(callback, function (Loandoc, index) {
                      if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 4) {
                          documentRepository.GetById(Loandoc.FKDocumentId, 0, function (documentCallback) {
                              //$scope.businessBankDocs.Document = documentCallback.Name;
                              $scope.businessBankDocs.push(Loandoc);
                          })
                      }
                      else if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 1 && Loandoc.ForBusiness == true) {
                          $scope.businessAddressProof.push(Loandoc);
                      }
                      else if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 2) {
                          $scope.businessPAN.push(Loandoc);
                      }
                      else if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 1 && Loandoc.ForPerson == true) {
                          for (var j = 0; j < $scope.applicants.length; j++) {
                              if (typeof ($scope.applicants[j].guarantorKycAddressProofDocs) === "undefined") {
                                  $scope.applicants[j].guarantorKycAddressProofDocs = [];
                              }
                              if ($scope.applicants[j].FKPersonId == Loandoc.FKPersonId) {
                                  $scope.applicants[j].guarantorKycAddressProofDocs.push(Loandoc);
                              }
                          }
                      }
                  })
              })

          })
      }

      function loadDucumentCategories() {
          documentCategoryRepository.GetAll(function (callback) {
              $scope.documentCategories = callback;
          })
      }

      function loadAllApplicantsForKYC() {
          applicantRepository.GetByLoanAccountId($scope.LoanAccountId, function (callback) {
              $scope.applicants = callback;
              loanDocumentRepository.GetByLoanAccountId($scope.LoanAccountId, function (callback) {
                  $scope.businessBankDocs = [];
                  $scope.businessAddressProof = [];
                  $scope.businessPAN = [];
                  for (var i = 0; i < $scope.applicants.length; i++) {
                      $scope.applicants[i].docCount = 0;
                  }
                  var bankStatementsCount = 0;
                  var addressProofCount = 0;
                  var businessPANCount = 0;
                  for (var i = 0; i < callback.length; i++) {
                      if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 4) {
                          bankStatementsCount += 1;
                      }
                      else if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 1 && callback[i].ForBusiness == true) {
                          addressProofCount += 1;
                      }
                      else if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 2) {
                          businessPANCount += 1;
                      }
                      else if (callback[i].FKDocumentId > 0 && callback[i].FKDocumentTypeId == 1 && callback[i].ForPerson == true) {
                          //$scope.applicants[j].
                          for (var j = 0; j < $scope.applicants.length; j++) {
                              if ($scope.applicants[j].FKPersonId == callback[i].FKPersonId) {
                                  $scope.applicants[j].docCount += 1;
                              }
                          }
                      }
                  }
                  if (bankStatementsCount == 0) {
                      $scope.defaultDoc = {};
                      $scope.defaultDoc.showDropdown = false;
                      $scope.businessBankDocs.push($scope.defaultDoc);
                  }
                  if (addressProofCount == 0) {
                      $scope.businessAddressProof = [
                        {
                            showDropdown: false
                        }]
                  }
                  if (businessPANCount == 0) {
                      $scope.businessPAN = [{
                          showDropdown: false
                      }]
                  }
                  for (var i = 0; i < $scope.applicants.length; i++) {
                      if ($scope.applicants[i].docCount == 0) {
                          $scope.applicants[i].guarantorKycAddressProofDocs = [{
                              showDropdown: false
                          }]
                      }
                  }
                  angular.forEach(callback, function (Loandoc, index) {
                      if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 4) {
                          documentRepository.GetById(Loandoc.FKDocumentId, 0, function (documentCallback) {
                              //$scope.businessBankDocs.Document = documentCallback.Name;
                              $scope.businessBankDocs.push(Loandoc);
                          })
                      }
                      else if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 1 && Loandoc.ForBusiness == true) {
                          $scope.businessAddressProof.push(Loandoc);
                      }
                      else if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 2) {
                          $scope.businessPAN.push(Loandoc);
                      }
                      else if (Loandoc.FKDocumentId > 0 && Loandoc.FKDocumentTypeId == 1 && Loandoc.ForPerson == true) {

                          for (var j = 0; j < $scope.applicants.length; j++) {
                              if (typeof ($scope.applicants[j].guarantorKycAddressProofDocs) === "undefined") {
                                  $scope.applicants[j].guarantorKycAddressProofDocs = [];
                              }
                              if ($scope.applicants[j].FKPersonId == Loandoc.FKPersonId) {
                                  $scope.applicants[j].guarantorKycAddressProofDocs.push(Loandoc);
                              }
                          }
                      }
                  })
              })

          })
      }




      function loadProductTypes() {
          productDocumentTypeRepository.GetProductTypeByProductId($scope.ProductId, function (callback) {
              $scope.productTypes = callback;
          })
      }

      /*---------------------- End Step 4 ------------------------*/

      function editApplication(loanAccountId, productId) {
          $state.go('borrower.application.business_details', { productId: productId, Id: loanAccountId })
      }

      $scope.cancelBusinessBankDoc = function (index) {
          loanDocumentRepository.Delete($scope.businessBankDocs[index].LoanDocumentId, function (callback) {
              $scope.businessBankDocs.splice(index, 1);
          })
      }

      $scope.cancelBusinessAddressProof = function (index) {
          loanDocumentRepository.Delete($scope.businessAddressProof[index].LoanDocumentId, function (callback) {
              $scope.businessAddressProof.splice(index, 1);
          })
      }

      $scope.cancelBusinessPan = function (index) {
          loanDocumentRepository.Delete($scope.businessPAN[index].LoanDocumentId, function (callback) {
              $scope.businessPAN.splice(index, 1);
          })
      }

      $scope.cancelGuarantorKycAddressProofDoc = function (parentindex, index) {
          loanDocumentRepository.Delete($scope.personalDetails[parentindex].guarantorKycAddressProofDocs[index].LoanDocumentId, function (callback) {
              $scope.personalDetails[parentindex].guarantorKycAddressProofDocs[index].splice(index, 1);
          })
          //$scope.personalDetails[parentindex].guarantorKycAddressProofDocs[index];
      }

      $scope.uploadMoreBusinessBankDoc = function () {
          $scope.defaultDoc = {};
          $scope.defaultDoc.showDropdown = false;
          $scope.businessBankDocs.push($scope.defaultDoc);
      }

      $scope.uploadMoreBusinessAddressProof = function () {
          $scope.defaultBusinessAddressDoc = {};
          $scope.defaultBusinessAddressDoc.showDropdown = false;
          $scope.businessAddressProof.push($scope.defaultBusinessAddressDoc);
      }

      $scope.uploadMoreBusinessPan = function () {
          $scope.businessPAN.push({
              showDropdown: false
          })
      }

      $scope.uploadMoreGuarantorKycAddressProofDoc = function (index) {
          $scope.applicants[index].guarantorKycAddressProofDocs.push({
              showDropdown: false
          })
      }

      $scope.uploadBankStatement = function (businessDoc) {
          if (businessDoc.LoanDocumentId) {
              loanDocumentRepository.Delete(businessDoc.LoanDocumentId, function (loanDocDeleteCallback) {
                  //Deleted
                  uploadOrUpdateDocument(businessDoc);
              })
          }
          else {
              uploadOrUpdateDocument(businessDoc);
          }
      }

      $scope.uploadAddressProof = function (addressProof) {
          var stageId;
          for (var i = 0; i < $scope.productTypes.length; i++) {
              if ($scope.productTypes[i].FKDocumentTypeId == 4) {
                  stageId = $scope.productTypes[i].FKStageId;
              }
          }
          addressProof.FKLoanAccountId = $scope.LoanAccountId;
          addressProof.FKDocumentTypeId = 1;
          addressProof.IsDeleted = false;
          addressProof.FKStageId = stageId;
          var formData = new FormData();
          formData.append('File', addressProof.Document[0]);
          documentRepository.Create(formData, $scope.LoanAccountId, function (callback) {
              addressProof.FKDocumentId = callback.DocumentId;
              addressProof.ForPerson = false;
              addressProof.ForBusiness = true;
              addressProof.FKBusinessId = $scope.businessDetails.BusinessId;
              loanDocumentRepository.Create(addressProof, function (loanDocumentCallback) {
                  loadDefaultDocuments();
              })
          })
      }

      $scope.uploadBusinessKycDocs = function (businessPAN) {
          var stageId;
          for (var i = 0; i < $scope.productTypes.length; i++) {
              if ($scope.productTypes[i].FKDocumentTypeId == 4) {
                  stageId = $scope.productTypes[i].FKStageId;
              }
          }
          businessPAN.FKLoanAccountId = $scope.LoanAccountId;
          businessPAN.FKDocumentTypeId = 2;
          businessPAN.IsDeleted = false;
          businessPAN.FKStageId = stageId;
          var formData = new FormData();
          formData.append('File', businessPAN.Document[0]);
          documentRepository.Create(formData, $scope.LoanAccountId, function (callback) {
              businessPAN.FKDocumentId = callback.DocumentId;
              businessPAN.ForPerson = false;
              businessPAN.ForBusiness = true;
              businessPAN.FKBusinessId = $scope.businessDetails.BusinessId;
              loanDocumentRepository.Create(businessPAN, function (loanDocumentCallback) {
                  loadDefaultDocuments();
              })
          })
      }

      $scope.uploadGuarantorKycDocs = function (personKYC, personDetail) {
          var stageId;
          for (var i = 0; i < $scope.productTypes.length; i++) {
              if ($scope.productTypes[i].FKDocumentTypeId == 4) {
                  stageId = $scope.productTypes[i].FKStageId;
              }
          }
          personKYC.FKLoanAccountId = $scope.LoanAccountId;
          personKYC.FKDocumentTypeId = 1;
          personKYC.IsDeleted = false;
          personKYC.FKStageId = stageId;
          var formData = new FormData();
          formData.append('File', personKYC.Document[0]);
          documentRepository.Create(formData, $scope.LoanAccountId, function (callback) {
              personKYC.FKDocumentId = callback.DocumentId;
              personKYC.ForPerson = true;
              personKYC.ForBusiness = false;
              personKYC.FKPersonId = personDetail.FKPersonId;
              loanDocumentRepository.Create(personKYC, function (loanDocumentCallback) {
                  loadDefaultDocuments();
              })
          })
      }

      function uploadOrUpdateDocument(businessDoc) {
          var stageId;
          for (var i = 0; i < $scope.productTypes.length; i++) {
              if ($scope.productTypes[i].FKDocumentTypeId == 4) {
                  stageId = $scope.productTypes[i].FKStageId;
              }
          }
          businessDoc.FKLoanAccountId = $scope.LoanAccountId;
          businessDoc.FKDocumentTypeId = 4; //Hard Coding for bank statement
          businessDoc.IsDeleted = false;
          businessDoc.FKStageId = stageId;
          var formData = new FormData();
          formData.append('File', businessDoc.Document[0]);
          documentRepository.Create(formData, $scope.LoanAccountId, function (callback) {
              businessDoc.FKDocumentId = callback.DocumentId;
              businessDoc.ForPerson = false;
              businessDoc.ForBusiness = true;
              businessDoc.FKBusinessId = $scope.businessDetails.BusinessId;
              loanDocumentRepository.Create(businessDoc, function (loanDocumentCallback) {
                  loadDefaultDocuments();
              })
          })
      }

      $scope.finalSubmitApplication = function (arg) {
          if ($scope.businessBankDocs[0].Document != null && $scope.businessPAN[0].Document != null && $scope.loanDetail.isAuthorized && $scope.loanDetail.isClearify && $scope.loanDetail.isDeclare) {
              loanAccountRepository.getById($scope.LoanAccountId, function (callback) {
                  callback.IsDraft = false;
                  callback.IsInComplete = false;
                  loanAccountRepository.Update(callback, function (loanaccountCallback) {
                      loanAccountRepository.UpdateLoanApplicationStatu(callback.LoanAccountId, 'Applied', function () {
                          window.location.href = "#/borrower/dashboard/applications";
                      })
                  })
              })
          }
      }

      $scope.goToDocuments = function () {
          var total = 0;
          for (var i = 0; i < $scope.applicantsArray.length; i++) {
              if ($scope.applicantsArray[i].Person.OwnershipPer) {
                  total += parseFloat($scope.applicantsArray[i].Person.OwnershipPer);
              }
          }
          if ($scope.businessDetails.FKBusinessConstitutionId != 2) {
              if (total == 100 || ((100 / $scope.applicantsArray.length) * $scope.applicantsArray.length) == total) {
                  $scope.ownershipErrr = false;
                  $state.go("borrower.application.uploads", { productId: $scope.ProductId, Id: $scope.LoanAccountId });
              }
              else {
                  $scope.ownershipErrr = true;
              }
          }
          else {
              $scope.ownershipErrr = false;
              $state.go("borrower.application.uploads", { productId: $scope.ProductId, Id: $scope.LoanAccountId });
          }
      }

      /*--------------------- / Step 4 ------------------------*/

      //------------Borrower Dashboard------------------------------------------------

      //$scope.SelectedLoanChanged = function (loan) {
      //    loanRepository.FCDashboardGetFilteredLoan(loan.LoanId, function (result) {
      //        console.log("loannss", result)

      //        $scope.SelectedLoan = result;
      //        console.log('$scope.SelectedLoan', $scope.SelectedLoan);
      //        $(".dropdown-toggle").attr("aria-expanded", false);
      //        $('#drop_down_loans').removeClass('open');
      //        $scope.LoanAccountId = $scope.SelectedLoan.FKLoanAccountId;
      //        //installmentRepository.GetFilterList('GetByLoan', $scope.SelectedLoan.LoanId, function (installments) {
      //        //$scope.Installments = $scope.SelectedLoan.Installments;
      //        //    console.log("$scope.Installments", $scope.Installments);
      //        //});
      //        //if ($scope.SelectedLoan.LoanType.Name == "OverDraft") {
      //        //    installmentRepository.GetDLODTransactionByLoan($scope.SelectedLoan.LoanId, function (callback) {
      //        //        $scope.DLODTransactions = callback;
      //        //        console.log("$scope.DLODTransactions ", $scope.DLODTransactions);
      //        //    });
      //        //}
      //        //loanDocumentRepository.GetNonFabLoanDocumentByLoanId(parseInt($scope.SelectedLoan.LoanId), function (lDocuments) {
      //        $scope.LoanDocuments = $scope.SelectedLoan.loanDocuments;
      //        //console.log("$scope.LoanDocuments", $scope.LoanDocuments);
      //        // });
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
              params: { "LoanAccountId": $scope.SelectedLoan.FKLoanAccountId, "DocumentId": id, type: "GetImage" },

          }).success(function (callback) {
              var newTag = "<object data='data:" + callback.DocType + ";base64, " + callback.data + "' type='" + callback.DocType + "' style='width:871px;height:500px;'></object>"
              $('#ShowDocument').html(newTag);
              $('#document-popup').modal('show');
              $scope.imgData = callback.data;
              $scope.doctype = callback.DocType;
              $scope.modalInstance.result.then(function () {
                  $scope.Init();
                  $state.go($state.current.name);
              }, function () {
                  $scope.Init();
                  $state.go($state.current.name);
              });
          })
      }

      //$scope.CloseApplication = function (loanId) {
      //    loanAccountRepository.UpdateLoanApplicationStatu(loanId, 'Closed', function () {
      //        getApplications();
      //        console.log("CloseApplication");

      //    })
      //}

      $scope.HasDocuments = function (DocType, forbusiness) {
          var result = false;
          angular.forEach(DocType.LoanDocuments, function (ldoc) {
              if (forbusiness && ldoc.ForBusiness == true) {
                  if (!result) {
                      if (ldoc.FKDocumentId > 0)
                          result = true;
                  }
              }
              else if (forbusiness == false && ldoc.ForPerson == true) {
                  if (!result) {
                      if (ldoc.FKDocumentId > 0)
                          result = true;
                  }
              }
          })
          return result;
      }

      //function RequestForDisburse() {
      //    loanRepository.RequestForDisburse($scope.SelectedLoan.LoanId, function (callback) {
      //        getLoans();
      //    })
      //}

      $scope.OtpRequestofDisburse = function () {
          // Open OTP modal
          otpRepository.GetForLoggedinUser(function (callback) {
              $scope.otp = ""
              $timeout(function () {
                  $rootScope.otpModal = true;
                  $('#verifyOTP').modal('show');
              }, 200);
              $scope.showOtpSuccesMessage = true;
              $timeout(function () {
                  $scope.showOtpSuccesMessage = false;
              }, 10000);
          })
      }

      $scope.VerifyOTP = function (otp) {
          personRepository.GetById($scope.SelectedLoan.FKCustomerId, function (callback) {
              var otpData = {
                  PhoneNumber: parseInt(callback.MobilePhone),
                  Otp: otp,
              }
              authTokenRepository.authenticateByOtp(otpData, function (success) {
                  if (success != null) {
                      RequestForDisburse();
                      $('#verifyOTP').modal('hide');
                  }
                  else {
                      $scope.showOtpFailMessage = true;
                  }

              }, function (err) {
                  $scope.showOtpFailMessage = true;
              })
          })
      }

      //$scope.GenerateLoanStatement = function (id) {
      //    loanDocumentRepository.GenerateLoanStatement(id, function (callback) {
      //        $scope.GetLoanStatement(id);
      //    })
      //}

      $scope.GetLoanStatement = function (id) {
          if (id > 0) {
              loanDocumentRepository.GetLStmntLDoc(id, function (callback) {
                  $scope.DownloadDocument(callback.FKDocumentId, callback.DocumentType.Name, callback.FKLoanAccountId);

              })
          }
      }

      ////Renew loan application
      //function loanproductGroup() {
      //    productGroupRepository.GetAll($state.params.productId, function (callback) {
      //        $scope.ProductGroups = callback;
      //        console.log('productgroup', $scope.ProductGroups);
      //    })
      //}
      //pop up of renew loan application


      //renew loan application


      //$scope.isRenewButtonVisibile = function () {
      //    $scope.authRoles = $auth.authentication.roles;
      //    angular.forEach($scope.authRoles, function (value) {
      //        if (value.Role != null) {
      //            if (value.Role.Name == "Sales Agent") {

      //                $scope.isSalesAgent = true;
      //            }
      //        }
      //    });
      //}
      //  $scope.isRenewButtonVisibile();
      //$scope.RenewLoanApplication = function (loanApplication) {

      //    console.log("role", $auth.authentication.roles);

      //    if ($scope.choosedRenewAccount.Amount > $scope.renewLoanAccountProduct.MaxAmount || $scope.choosedRenewAccount.Amount < $scope.renewLoanAccountProduct.MinAmount) {
      //        return;
      //    }
      //    loanAccountRepository.renewApplication($scope.choosedRenewAccount, function (result) {
      //        console.log("after renew result", result);
      //        $scope.CloseDocPopup();
      //    })
      //}
      //when product is changed

      //$scope.productChanged = function (id) {

      //    productRepository.GetById(id, function (callback) {
      //        console.log("Product By Id", callback)
      //        $scope.renewLoanAccountProduct = callback;

      //        $scope.choosedRenewAccount.Amount = callback.MinAmount;
      //        $scope.choosedRenewAccount.FKProductId = callback.ProductId;
      //    })
      //}


  });



