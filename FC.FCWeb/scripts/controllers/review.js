'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:ReviewCtrl
 * @description
 * # ReviewCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('ReviewCtrl', function ($scope, $http, $state, CONSTANT, toastr) {

    // FUNCTION DECLARATION
    $scope.getApplicationDataById = getApplicationDataById;
    $scope.downloadDocs = downloadDocs;
    $scope.verifyDocs = verifyDocs;
    $scope.openNeedToResubmitModal =openNeedToResubmitModal;
    $scope.sendComments = sendComments;

    //VARIABLE DECLARATION

    function getApplicationDataById(appId) {
      $http.get(CONSTANT.HOST + 'applicationReview/' + appId)
        .success(function (data, status, headers, config) {
          if (data.length > 0) {
            $scope.totalDocuments = 0;
            $scope.totalVerifiedDocuments = 0;
            console.log(data);
            $scope.loanDetails = {
              id: data[0].id,
              amount: data[0].amount,
              display_id: data[0].display_id,
              entity_type: data[0].entity_type,
              status: data[0].status,
              lender_status: data[0].lender_status,
              months: data[0].months,
              typeOfLoan: data[0].typeOfLoan,
              score: data[0].score,
              purpose: data[0].purpose,
              is_completed: data[0].is_completed,
              userEmail:  data[0].user.email,
              userPhone:  data[0].user.phone,
              userName:  data[0].user.fullname
            };

            // assigning business details
            $scope.businessDetails = data[0].business_details[0];
            if (data[0].business_details.length > 0 && $scope.loanDetails.entityType != 'Salaried Professional') {
              if($scope.businessDetails.business_banking_docs.length>0) {
                for (var k = 0; k < $scope.businessDetails.business_banking_docs.length; k++) {
                  if ($scope.businessDetails.business_banking_docs[k].is_verified) {
                    $scope.totalVerifiedDocuments++;
                  }
                  $scope.totalDocuments++;
                }
              }
              if($scope.businessDetails.business_kyc_docs.length>0) {
                for (var x = 0; x < $scope.businessDetails.business_kyc_docs.length; x++) {
                  if ($scope.businessDetails.business_kyc_docs[x].is_verified) {
                    $scope.totalVerifiedDocuments++;
                  }
                  $scope.totalDocuments++;
                }
              }
            }

            // assigning employer details
            if (data[0].employer_details.length > 0)
              $scope.employerDetails = data[0].employer_details[0];

            // assigning partners
            if (data[0].partner_details.length > 0 && ($scope.loanDetails.typeOfLoan == 'Business') && ($scope.businessDetails.constitution!='self employed professional' && $scope.businessDetails.constitution!='proprietorship' && $scope.businessDetails.constitution!='huf')){
              $scope.partnerDetails = data[0].partner_details;
             if($scope.partnerDetails.length > 0) {
               for(var a=0; a<$scope.partnerDetails.length; a++) {
                 if ($scope.partnerDetails[a].partner_banking_docs.length > 0) {
                   for (var y = 0; y < $scope.partnerDetails[a].partner_banking_docs.length; y++) {
                     if ($scope.partnerDetails[a].partner_banking_docs[y].is_verified) {
                       $scope.totalVerifiedDocuments++;
                     }
                     $scope.totalDocuments++;
                   }
                 }
                 if ($scope.partnerDetails[a].partner_kyc_docs.length > 0) {
                   for (var z = 0; z < $scope.partnerDetails[a].partner_kyc_docs.length; z++) {
                     if ($scope.partnerDetails[a].partner_kyc_docs[z].is_verified) {
                       $scope.totalVerifiedDocuments++;
                     }
                     $scope.totalDocuments++;
                   }
                 }
               }
             }
            }

            // assigning personal details
            $scope.personalDetails = data[0].personal_details;
            if (data[0].personal_details.length > 1 && ($scope.loanDetails.typeOfLoan == 'Personal' || ($scope.loanDetails.entityType == 'Own Business') || ($scope.loanDetails.entityType == 'Self Employed Professional') || ($scope.loanDetails.entityType == 'Proprietor') || ($scope.businessDetails.constitution=='self employed professional' || $scope.businessDetails.constitution=='proprietorship' || $scope.businessDetails.constitution=='huf'))){
              if($scope.personalDetails.length > 1) {
                for(var a=1; a<$scope.personalDetails.length; a++) {
                  if ($scope.personalDetails[a].guarantor_kyc_docs.length > 0) {
                    for (var z = 0; z < $scope.personalDetails[a].guarantor_kyc_docs.length; z++) {
                      if( $scope.personalDetails[a].detail_for =='Co-Applicant' || $scope.personalDetails[a].detail_for =='Guarantor') {
                        if ($scope.personalDetails[a].guarantor_kyc_docs[z].is_verified) {
                          $scope.totalVerifiedDocuments++;
                        }
                        $scope.totalDocuments++;
                      }
                    }
                  }
                }
              }
            }
            // assigning references
            if (data[0].references.length > 0)
              $scope.references = data[0].references[0];

            // assigning application score
            if (data[0].application_scores.length > 0)
              $scope.applicationScores = data[0].application_scores[0];

            // assigning personal banking docs
            if (data[0].personal_banking_docs.length > 0){
              $scope.personal_banking_docs = data[0].personal_banking_docs;
              for(var i=0; i<$scope.personal_banking_docs.length;i++){
                if($scope.personal_banking_docs[i].is_verified){
                  $scope.totalVerifiedDocuments++;
                }
                $scope.totalDocuments++;
              }
            }
            // assigning personal KYC docs
            if (data[0].personal_kyc_docs.length > 0){
              $scope.personal_kyc_docs = data[0].personal_kyc_docs;
              for(var j=0; j<$scope.personal_kyc_docs.length;j++){
                if($scope.personal_kyc_docs[j].is_verified){
                  $scope.totalVerifiedDocuments++;
                }
                $scope.totalDocuments++;
              }
            }

            if($scope.totalDocuments == $scope.totalVerifiedDocuments){
              $http.post(CONSTANT.HOST + 'documents_status', {type:'all docs verified', id: $state.params.id})
                .success(function (data, status, headers, config) {
                })
                .error(function (data, status, header, config) {
                  console.log('err', data);
                });
            }
          }
          else {
            $state.go('home');
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    if ($state.params.id) {
      getApplicationDataById($state.params.id);
    }

    function downloadDocs(filepath) {
      $http.get(CONSTANT.HOST + 'download/?filepath=' + filepath)
        .success(function (data, status, headers, config) {
          if (data == 'File not found!') {
            toastr.error('File not found!');
          }
          else {
            location.href = CONSTANT.HOST + 'download?filepath=' + filepath;
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });

    }

    function verifyDocs(id, type) {
      $http.post(CONSTANT.HOST + 'verify_docs', {type: type, id: id})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully verified!');
          getApplicationDataById($state.params.id);
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }
    function openNeedToResubmitModal(id, type, comments){
      $scope.docId = id;
      $scope.docType = type;
      if (comments)
        $scope.commentsData = comments;
      else
        $scope.commentsData = '';
      $('#needToresubmitComment').modal('show');
    }

    function sendComments(id, type, comments){
      $http.post(CONSTANT.HOST + 'docs_resubmission_notification', {type: type, id: id, comments: comments, applicationId: $state.params.id})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully Sent!');
          getApplicationDataById($state.params.id);
          $('#needToresubmitComment').modal('hide');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

  });
