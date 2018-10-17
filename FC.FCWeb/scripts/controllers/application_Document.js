'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:BorrowerDashboardControllerCtrl
 * @description
 * # BorrowerDashboardControllerCtrl
 */
angular.module('craditKartApp')
  .controller('application_document', function ($scope, $auth, $state, $timeout, $http, CONSTANT, toastr, $location, $rootScope, documentTypeRepository, loanAccountRepository, loanDocumentRepository, documentRepository, applicantRepository) {
      $scope.Init = function () {
          if (typeof (Storage) !== "undefined") {
              var business = localStorage['businessDetail'];
              $scope.businessDetails = JSON.parse(business);
              loadDocumentType();
          }
          $scope.loanAccountId = $state.params.Id;
          GetApplicantsbyLoanAccountId();
      }
      $scope.AddLoanDocument = function (documentType, criteria, id, loanAccountId, doc) {
          var flag = false;
          if (!flag) {
              documentType.LoanDocuments.push({
                  FKLoanAccountId: $state.params.Id,
                  FKDocumentTypeId: documentType.DocumentTypeId,
                  IsMandatory: false,
                  IsDocSent: false,
                  ForPerson: criteria == 1 ? true : '',
                  FKPersonId: criteria == 1 ? id : '',
                  ForBusiness: criteria == 0 ? true : '',
                  FKBusinessId: criteria == 0 ? $scope.businessDetails.BusinessId : '',
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


      function loadDefaultDocuments() {

          //loadAllApplicantsForKYC();
          //loadProductTypes();
          //loadDucumentCategories();
          //loanAccountRepository.getById($state.params.Id, function (callback) {
          //    $scope.loanAccount = callback;
          //});
          loadDocumentType();

          //loanApplicantDetail();

      }
      //load related applicants
      function GetApplicantsbyLoanAccountId() {
          applicantRepository.FCDocument_Applicants($scope.loanAccountId, function (callback) {
              console.log("Applicants", callback)
              $scope.Applicants = callback;
          })
      }

      $scope.UploadDocument = function (loanDocument, docType, criteria, id, LoanId, doc) {
          LoanId = $scope.loanAccountId;
          loanDocument.FKDocumentTypeId = docType.DocumentTypeId;

          loanDocument.FKLoanAccountId = LoanId;
          if (criteria == 0) {
              loanDocument.ForBusiness = true;
              loanDocument.FKBusinessId = $scope.businessDetails.BusinessId;
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
      $scope.RemoveLoanDocument = function (documentType, criteria, id) {
          angular.forEach(documentType.LoanDocuments, function (lDoc, i) {
              if (criteria == 0 && lDoc.ForBusiness == true && !(lDoc.LoanDocumentId > 0) && documentType.Name == 'Bank Statement') {
                  documentType.LoanDocuments.splice(i, 1);
              }
              else if (criteria == 1 && lDoc.ForPerson == true && !(lDoc.LoanDocumentId > 0) && ($scope.businessDetails.FKBusinessConstitutionId != 2 && documentType.Name != 'PAN Card')) {
                  documentType.LoanDocuments.splice(i, 1);
              }
              else if (criteria == 3 && lDoc.ForPerson == true && !(lDoc.LoanDocumentId > 0) && lDoc.FKPersonId == id) {
                  documentType.LoanDocuments.splice(i, 1);
              }
          })
      }
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

      $scope.HasNullDocuments = function (DocType, forbusiness) {
          var result = false;
          angular.forEach(DocType.LoanDocuments, function (ldoc) {
              if (forbusiness && ldoc.ForBusiness == true) {
                  if (!result) {
                      if (!(ldoc.LoanDocumentId > 0))
                          result = true;
                  }
              }
              else if (forbusiness == false && ldoc.ForPerson == true) {
                  if (!result) {
                      if (!(ldoc.LoanDocumentId > 0))
                          result = true;
                  }
              }
          })
          return result;
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
      function loadDocumentType() {
          //loanAccountRepository.getById($state.params.Id, function (callback) {
          //    $scope.loanAccount = callback;
          documentTypeRepository.GetNonFebrictdConfiguredDocByProduct_CV($state.params.productId, function (callback) {
              $scope.DocumentTypes = callback;
              console.log("$scope.DocumentTypes", $scope.DocumentTypes);
              //Get already uploaded Doc
              angular.forEach($scope.DocumentTypes, function (documentType) {
                  documentType.HasSameCategory = true;
                  if (documentType.DocumentCategories.length == 1) {
                      if (documentType.DocumentCategories[0].Name != documentType.Name)
                          documentType.HasSameCategory = false;
                  }
                  loanDocumentRepository.GetByDocTypeAndLoanAccountId($state.params.Id, documentType.DocumentTypeId, function (callback) {
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
                      //angular.forEach($scope.loanAccount.Applicants, function (applicant) {
                      //    applicant.HasLoanDocument = false;
                      //    angular.forEach(documentType.LoanDocuments, function (loanDoc) {
                      //        if (loanDoc.ForPerson == true && loanDoc.FKPersonId == applicant.FKPersonId)
                      //            applicant.HasLoanDocument = true;
                      //    });
                      //})
                  })
              });

              console.log("$scope.DocumentTypes", $scope.DocumentTypes);
          })
          //  })
      }
      $scope.Init();
  });



