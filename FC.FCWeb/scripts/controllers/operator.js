'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:ScoreCtrl
 * @description
 * # ScoreCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('OperatorCtrl', function ($scope, $http, CONSTANT, $state, toastr, $auth, $timeout, $window, CommonService, $rootScope) {
    /*------------Service for get options-----------------------*/
    CommonService.getOptions('operator', function (data) {
      // assign options value
      $scope.contactOptions = JSON.parse(data.contact);
      $scope.familyStandingOptions = JSON.parse(data.family_standing);
      $scope.consignementororbOptions = JSON.parse(data.consignement_or_orb);
      $scope.assetClassficationOptions = JSON.parse(data.asset_classfication);
      $scope.matchingOptions = JSON.parse(data.matching);
      $scope.linkedinAndTwitterProfileOptions = JSON.parse(data.linkedin_and_twitter_profile);
    });
    /*------------End Service for get options-----------------------*/

      // VARIABLE DECLARATION/INITIALIZATION
      $scope.score = {};
      $scope.applicationPerPage = 7;
    //define current page for all applications
      $scope.submittedCurrentPage = 1;
      $scope.incompleteCurrentPage = 1;
      $scope.closedCurrentPage = 1;
      $scope.rejectedCurrentPage = 1;
      $scope.processedCurrentPage = 1;
      $scope.lenderApprovedCurrentPage = 1;
      $scope.lenderRejectedCurrentPage = 1;
      $scope.remindersCurrentPage = 1;
      $scope.amountModifiedCurrentPage = 1;
      $scope.totalAmountApprovedCurrentPage = 1;
      $scope.assignedToBorrowerCurrentPage = 1;
      $scope.borrowerAcceptedCurrentPage = 1;
      $scope.borrowerRejectedCurrentPage = 1;
      $scope.approvalExpiredCurrentPage = 1;

      $scope.activateTabs = {};
      $scope.totalScore = 0;
      $scope.FilledApplicationScore = false;
      $scope.lenders = [];
      $scope.channelPartners = [];
      $scope.filters = {};
      $scope.currentTab = 'incomplete';
      $scope.currentPageForWindowFocus = 1;

      // METHOD DECLARATION
      $scope.getApplications = getApplications;
      $scope.getLenderApprovedRejectApplications = getLenderApprovedRejectApplications;
      $scope.getApplicationScoreCard = getApplicationScoreCard;
      $scope.closeApplication = closeApplication;
      $scope.chequeReturn = chequeReturn;
      $scope.paymentReturn = paymentReturn;
      $scope.balance = balance;
      $scope.grossSurplus = grossSurplus;
      $scope.average = average;
      $scope.overdrawn = overdrawn;
      $scope.onlineStore = onlineStore;
      $scope.submitScore = submitScore;
      $scope.openCloseModal = openCloseModal;
      $scope.selectChannelPartner = selectChannelPartner;
      $scope.openRecommendedLendersModal = openRecommendedLendersModal;
      $scope.assignThisLender = assignThisLender;
      $scope.changeApplicationStatus = changeApplicationStatus;
      $scope.getRecommendedLendersWithSuggestedData = getRecommendedLendersWithSuggestedData;
      $scope.sumAssignedAmount = sumAssignedAmount;
      $scope.openPersonalDiscussionChatBox = openPersonalDiscussionChatBox;
      $scope.savePersonalDiscussion = savePersonalDiscussion;
      $scope.openFilter = openFilter;
      $scope.applyFilters = applyFilters;
      $scope.resetAllFilters = resetAllFilters;
      $scope.chatScrollToBottom = chatScrollToBottom;
      $scope.assignedToBorrowerForOfferAcceptance = assignedToBorrowerForOfferAcceptance;
      $scope.openRejectModal =openRejectModal;
      $scope.rejectApplication = rejectApplication;
      $scope.openSubmitForApprovalModal= openSubmitForApprovalModal;
      $scope.submitForApproval =submitForApproval;
      $scope.openApprovedModal = openApprovedModal;
      $scope.approveApplication = approveApplication;
      $scope.openResendToOperatorModal = openResendToOperatorModal;
      $scope.resendToOperator = resendToOperator;
      $scope.openAssignedToBorrowerForOfferAcceptanceModal =openAssignedToBorrowerForOfferAcceptanceModal;
      $scope.findDeselectedItem =findDeselectedItem;

      //call get function on window focus
      $(window).focus(function(e) {
        if($scope.currentTab == 'lender-approved'){
          getLenderApprovedRejectApplications($scope.lenderApprovedCurrentPage, 'lender-approved')
        }
        else if($scope.currentTab == 'lender-rejected'){
          getLenderApprovedRejectApplications($scope.lenderRejectedCurrentPage, 'lender-rejected')
        }
        else{
          getApplications($scope.currentPageForWindowFocus, $scope.currentTab);
        }
      });

        //function for get all application
     function getApplications(currentPage, applicationFormStatus, fromTab) {
       $scope.currentPageForWindowFocus = currentPage;
       if(fromTab){
         $scope.filters = {};
       }
        $scope.currentTab = applicationFormStatus;
        $scope.chatBoxOpened = false;
        $scope.applications = [];
        $scope.incompleteApplications = [];
        $scope.submittedApplications = [];
        $scope.processedApplications = [];
        $scope.closedApplications = [];
        $scope.rejectedApplications = [];
        $scope.lenderApprovedApplications = [];
        $scope.lenderRejectedApplications = [];
        $scope.remindersApplications = [];
        $scope.amountModifiedApplications = [];
        $scope.totalAmountApprovedApplications = [];
        $scope.assignedToBorrowerApplications = [];
        $scope.borrowerAcceptedApplications = [];
        $scope.borrowerRejectedApplications = [];

        if(applicationFormStatus == 'reminders'){
          $scope.filters.status = 'processed';
          $scope.filters.tabType = 'reminders';
        }
       else if(applicationFormStatus == 'amount-modified'){
          $scope.filters.status = 'KC-approved';
          $scope.filters.tabType = '';
          delete $scope.filters.is_assigned_for_offer_acceptance;
          delete $scope.filters.isTotalAmountApproved;
          $scope.filters.isAmountModified = true;
       }
        else if(applicationFormStatus == 'total-amount-approved'){
          $scope.filters.status = 'KC-approved';
          $scope.filters.tabType = '';
          delete $scope.filters.is_assigned_for_offer_acceptance;
          delete $scope.filters.isAmountModified;
          $scope.filters.isTotalAmountApproved= true;
        }
        else if(applicationFormStatus == 'assigned-to-borrower'){
          $scope.filters.status = 'KC-approved';
          $scope.filters.is_assigned_for_offer_acceptance = true;
          $scope.filters.tabType = '';
          delete $scope.filters.isTotalAmountApproved;
          delete $scope.filters.isAmountModified;
        }
        else if(applicationFormStatus == 'approval-expired'){
          $scope.filters.status = 'KC-approved';
          $scope.filters.is_assigned_for_offer_acceptance = true;
          $scope.filters.tabType = 'approval-expired';
          delete $scope.filters.isTotalAmountApproved;
          delete $scope.filters.isAmountModified;
        }
       else{
          delete $scope.filters.is_assigned_for_offer_acceptance;
          delete $scope.filters.isTotalAmountApproved;
          delete $scope.filters.isAmountModified;
          $scope.filters.status = applicationFormStatus;
          $scope.filters.tabType = '';
        }
        $http.post(CONSTANT.HOST + 'operator_applications/' + currentPage + '/' + $scope.applicationPerPage, $scope.filters)
          .success(function (data, status, headers, config) {
            console.log('data', data);
            // for loop for getting data of all 5 applications
            for (var i = 0; i < data.applications.length; i++) {
              data.applications[i].selectedLenders = [];
              data.applications[i].selectedChannelPartners = [];
              if (applicationFormStatus == 'incomplete' || applicationFormStatus == 'submitted'){
              for (var j = 0; j < data.applications[i].channel_partner_applications.length; j++) {
                if (data.applications[i].channel_partner_applications[j].userId)
                  data.applications[i].selectedChannelPartners.push(data.applications[i].channel_partner_applications[j].userId.toString());
              }
             }
            } // end for loop

            //assign values of applications
            $scope.applications = data.applications;
            if (applicationFormStatus == 'incomplete') {
              $scope.incompleteApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.incompleteTab = 'active';
            }
            else if (applicationFormStatus == 'submitted') {
              $scope.submittedApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.completeTab = 'active';
            }
            else if (applicationFormStatus == 'closed') {
              $scope.closedApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.closedTab = 'active';
            }
            else if (applicationFormStatus == 'processed') {
              $scope.processedApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.processedTab = 'active';
            }
            else if (applicationFormStatus == 'rejected') {
              $scope.rejectedApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.rejectedTab = 'active';
            }
            else if (applicationFormStatus == 'reminders') {
              $scope.remindersApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.remindersTab = 'active';
            }
            else if (applicationFormStatus == 'amount-modified') {
              $scope.amountModifiedApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.amountModifiedTab = 'active';
            }

            else if (applicationFormStatus == 'total-amount-approved') {
              $scope.totalAmountApprovedApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.totalAmountApprovedTab = 'active';
            }

            else if (applicationFormStatus == 'assigned-to-borrower') {
              $scope.assignedToBorrowerApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.assignedToBorrowerTab = 'active';
            }
            else if (applicationFormStatus == 'borrower-accepted') {
              $scope.borrowerAcceptedApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.borrowerAcceptedTab = 'active';
            }

            else if (applicationFormStatus == 'borrower-rejected') {
              $scope.borrowerRejectedApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.borrowerRejectedTab = 'active';
            }

            else if (applicationFormStatus == 'approval-expired') {
              $scope.approvalExpiredApplications = data.applications;
              $scope.activateTabs = {};
              $scope.activateTabs.approvalExpiredTab = 'active';
            }

            $scope.totalApplications = data.count;
            window.scrollTo(0, 0);
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      }
      // call getApplications function default incomplete list
      //getApplications(1, 'incomplete');

    // get applications which are approved or reject by lender
    function getLenderApprovedRejectApplications(currentPage, applicationFormStatus, fromTab){
      if(fromTab){
        $scope.filters = {};
      }
      $scope.currentTab = applicationFormStatus;
      $scope.chatBoxOpened = false;
      $scope.lenderApprovedApplications = [];
      $scope.lenderRejectedApplications = [];
      $scope.filters.status = applicationFormStatus;
      $http.post(CONSTANT.HOST + 'lender_side_applications/' + currentPage + '/' + $scope.applicationPerPage, $scope.filters)
        .success(function (data, status, headers, config) {
          console.log('data', data);
         if (applicationFormStatus == 'lender-approved') {
            $scope.lenderApprovedApplications = data.applications;
            $scope.activateTabs = {};
            $scope.activateTabs.lenderApprovedTab = 'active';
          }
          else if (applicationFormStatus == 'lender-rejected') {
            $scope.lenderRejectedApplications = data.applications;
            $scope.activateTabs = {};
            $scope.activateTabs.lenderRejectedTab = 'active';
          }
          $scope.totalApplications = data.count;
          window.scrollTo(0, 0);
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

      // initialization of gauge chart
      var gaugeChart = new JustGage({
        id: "gauge",
        value: $scope.totalScore,
        min: 0,
        max: 100
      });

      // function for get score of an application
       function getApplicationScoreCard(id) {
        $http.get(CONSTANT.HOST + 'generateScoreCard/' + id)
          .success(function (data, status, headers, config) {
            if (parseInt(data.total) >= 100) {
              $scope.totalScore = 100;
            }
            else {
              $scope.totalScore = parseInt(data.total);
            }
              $scope.guageLabel = 'Grade'+' '+data.grade;

            gaugeChart.refresh($scope.totalScore);
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      }

      // function for delete application
     function closeApplication(index, id, tabName) {
        var statusChange = {};
        statusChange.status = 'closed';
        $http.put(CONSTANT.HOST + 'application', {id: id, statusChange: statusChange})
          .success(function (data, status, headers, config) {
            toastr.success('Successfully closed!');
            getApplications(1, tabName);
            $("#closeApplications").modal('hide');
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      }


    // function for open delete modal
    function openRejectModal(index, product_id, tab) {
      $scope.applicationIndex = index;
      $scope.applicationId = product_id;
      $scope.tabName = tab;
      $scope.rejectionReason = $scope.applications[index].rejectedReasonByOperator;
      $("#rejectionReasonByOperatorModal").modal('show');
    }

    // function for delete application
    function rejectApplication(index, id, tabName, reason) {
      var statusChange = {};
      statusChange.status = 'rejected';
      statusChange.rejectedReasonByOperator = reason
      $http.put(CONSTANT.HOST + 'application', {id: id, statusChange: statusChange})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully rejected!');
          getApplications(1, tabName);
          $("#rejectionReasonByOperatorModal").modal('hide');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

      //add form values in score form
      if ($state.params.id) {
        $scope.CurrentApplicationId = $state.params.id;
        // get individual application data
        $http.get(CONSTANT.HOST + 'application/' + $state.params.id)
          .success(function (data, status, headers, config) {
            if (data.length > 0) {
              // get score of an application
              getApplicationScoreCard($state.params.id);
              $scope.score = data[0].application_scores[0];
              $scope.scoreArray = data[0].application_scores;
            }
            else {
              $scope.score = {};
            }
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      }

      // Function for percent validation
     function chequeReturn(check) {
        if (check < 0 || check > 100) {

          $scope.chequeError = "Not valid number";
        }
        else if (check == undefined) {
          $scope.chequeError = "";
        }
        else {
          $scope.chequeError = "";
        }
      }

      function paymentReturn(pay) {
        if (pay < 0 || pay > 100) {

          $scope.paymentError = "Not valid number";
        }
        else if (pay == undefined) {
          $scope.paymentError = "";
        }
        else {
          $scope.paymentError = "";
        }
      }

      function balance(bal) {
        if (bal < 0 || bal > 100) {

          $scope.balanceError = "Not valid number";
        }
        else if (bal == undefined) {
          $scope.balanceError = "";
        }
        else {
          $scope.balanceError = "";
        }
      }

     function grossSurplus(gross) {
        if (gross < 0 || gross > 100) {

          $scope.surplusError = "Not valid number";
        }
        else if (gross == undefined) {
          $scope.surplusError = "";
        }
        else {
          $scope.surplusError = "";
        }
      }

      function average(operate) {
        if (operate < 0 || operate > 100) {

          $scope.operatingError = "Not valid number";
        }
        else if (operate == undefined) {
          $scope.operatingError = "";
        }
        else {
          $scope.operatingError = "";
        }
      }

     function overdrawn(avg) {
        if (avg < 0 || avg > 100) {

          $scope.averageError = "Not valid number";
        }
        else if (avg == undefined) {
          $scope.averageError = "";
        }
        else {
          $scope.averageError = "";
        }
      }

      function onlineStore(store) {
        if (store < 0 || store > 100) {

          $scope.ratingError = "Not valid number";
        }
        else if (store == undefined) {
          $scope.ratingError = "";
        }
        else {
          $scope.ratingError = "";
        }
      }

      // Function for submit score
     function submitScore(formData, from) {
        if ($state.params.id) {
          if (from == 'calculator button') {
            //  if($scope.scoreArray.length > 0 || $scope.FilledApplicationScore == true){
            formData.applicationId = $state.params.id;
            $http.post(CONSTANT.HOST + 'score', formData)
              .success(function (data, status, headers, config) {
                toastr.success('Successfully updated application score!');
                getApplicationScoreCard($state.params.id);
              })
              .error(function (data, status, header, config) {
                console.log('err', data);
              });
          }
          else {
            formData.applicationId = $state.params.id;
            $http.post(CONSTANT.HOST + 'score', formData)
              .success(function (data, status, headers, config) {
                toastr.success('Successfully added application score!');
                $scope.FilledApplicationScore = true;
                getApplicationScoreCard($state.params.id);
                window.scrollTo(0, 0);
              })
              .error(function (data, status, header, config) {
                console.log('err', data);
              });
          }
        }
      }

      // function for open delete modal
     function openCloseModal(index, product_id, tab) {
        $scope.applicationIndex = index;
        $scope.applicationId = product_id;
        $scope.tabName = tab;
        $("#closeApplications").modal('show');
      }

      // -------------------BLOCK OF LENDER ASSIGNMENT--------------------------------

    function openRecommendedLendersModal(applicationId, isTotalAmountApproved){
      // get application grade
      $scope.applicationIdForRecommendedLenders = applicationId;
      $scope.showLendersTotalAmountApproved = isTotalAmountApproved;
      if($scope.currentTab == 'lender-approved') {
        for (var k = 0; k < $scope.lenderApprovedApplications.length; k++) {
          if ($scope.lenderApprovedApplications[k].application.id == applicationId) {
            $scope.currentApplicationGrade = $scope.lenderApprovedApplications[k].application.grade;
            $scope.currentApplicationAmount = $scope.lenderApprovedApplications[k].application.amount;
            $scope.currentApplicationTypeOfLoan = $scope.lenderApprovedApplications[k].application.typeOfLoan;
            $scope.currentApplicationScore = $scope.lenderApprovedApplications[k].application.score;
            $scope.currentApplicationDisplayId = $scope.lenderApprovedApplications[k].application.display_id;
            $scope.currentApplicationStatus = $scope.lenderApprovedApplications[k].application.status;
          }
        }
      }

      else  if($scope.currentTab == 'lender-rejected') {
        for (var k = 0; k < $scope.lenderRejectedApplications.length; k++) {
          if ($scope.lenderRejectedApplications[k].application.id == applicationId) {
            $scope.currentApplicationGrade = $scope.lenderRejectedApplications[k].application.grade;
            $scope.currentApplicationAmount = $scope.lenderRejectedApplications[k].application.amount;
            $scope.currentApplicationTypeOfLoan = $scope.lenderRejectedApplications[k].application.typeOfLoan;
            $scope.currentApplicationScore = $scope.lenderRejectedApplications[k].application.score;
            $scope.currentApplicationDisplayId = $scope.lenderRejectedApplications[k].application.display_id;
            $scope.currentApplicationStatus = $scope.lenderRejectedApplications[k].application.status;
          }
        }
      }
      else{
        for (var k = 0; k < $scope.applications.length; k++) {
          if ($scope.applications[k].id == applicationId) {
            $scope.currentApplicationGrade = $scope.applications[k].grade;
            $scope.currentApplicationAmount = $scope.applications[k].amount;
            $scope.currentApplicationTypeOfLoan = $scope.applications[k].typeOfLoan;
            $scope.currentApplicationScore = $scope.applications[k].score;
            $scope.currentApplicationDisplayId = $scope.applications[k].display_id;
            $scope.currentApplicationStatus = $scope.applications[k].status;
          }
        }
      }
      getRecommendedLendersWithSuggestedData(applicationId);

    }

    /*----------GET RECOMMENDED LENDERS DATA WITH SUGGESTED VALUES AND ASSIGNED LENDERS--------------*/
    function getRecommendedLendersWithSuggestedData(applicationId, callback){
      $scope.recommendedLendersWithData = [];
      var haveAssignedLenders = false;
      $http.get(CONSTANT.HOST + 'recommended_lenders/'+applicationId)
        .success(function (recommendedLendersData, status, headers, config) {
          $http.get(CONSTANT.HOST + 'lender_applications/'+applicationId)
            .success(function (lenderApplicationData, status, headers, config) {
             for(var i=0; i<recommendedLendersData.length; i++){
               var temp = {};
               for(var j=0; j<lenderApplicationData.length; j++){
                 if(recommendedLendersData[i].id == lenderApplicationData[j].lenderProductId && recommendedLendersData[i].userId == lenderApplicationData[j].lenderId && lenderApplicationData[j].applicationId == applicationId){
                   temp = lenderApplicationData[j];
                   temp.isAssigned = true;
                   $scope.recommendedLendersWithData.push(temp);
                   haveAssignedLenders = true;
                 }
               }
               if(temp.isAssigned != true){
                 for(var k=0; k<recommendedLendersData[i].grade_metrics.length; k++){
                   if(recommendedLendersData[i].grade_metrics[k].grade == $scope.currentApplicationGrade){
                     temp.PF = (recommendedLendersData[i].grade_metrics[k].min_pf + recommendedLendersData[i].grade_metrics[k].max_pf) / 2;
                     temp.ROI = (recommendedLendersData[i].grade_metrics[k].min_roi + recommendedLendersData[i].grade_metrics[k].max_roi) / 2;
                     temp.tenure = (recommendedLendersData[i].grade_metrics[k].min_tenure + recommendedLendersData[i].grade_metrics[k].max_tenure) / 2;
                   }
                 }
                 temp.applicationId = applicationId;
                 temp.lenderId = recommendedLendersData[i].userId;
                 temp.lenderProductId = recommendedLendersData[i].id;
                 temp.display_name = recommendedLendersData[i].display_name;
                 temp.isAssigned = false;
                 $scope.recommendedLendersWithData.push(temp);
               }
             }

              $scope.totalAssignedAmount = 0;
              $scope.recommendedLendersWithData.forEach(function (data) {
                if(data.isAssigned)
                  $scope.totalAssignedAmount = $scope.totalAssignedAmount + data.amount;
              });
              if(callback){
                if(haveAssignedLenders == true){
                  callback(true);
                }
                else{
                  callback(false);
                }
              }
              else{
                // check is recommended lenders are exist or not
                if($scope.recommendedLendersWithData.length > 0){
                  $('#recommendedLender').modal('show');
                }
                else{
                  toastr.info("This application does not match with any lender's product criteria!");
                }
              }

            })
            .error(function (data, status, header, config) {
              console.log('err', data);
            });

        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    function sumAssignedAmount(index) {
      if($scope.recommendedLendersWithData[index].amount<=0){
        $scope.recommendedLendersWithData[index].amount = '';
      }
      else {
        $scope.totalAssignedAmount = 0;
        $scope.recommendedLendersWithData.forEach(function (data) {
          if (data.isAssigned && data.amount)
            $scope.totalAssignedAmount = $scope.totalAssignedAmount + data.amount;
        })
      }
    }

    function assignThisLender(lenderProductDetails){
      if($scope.totalAssignedAmount != $scope.currentApplicationAmount){
        toastr.error('Assigned loan amount must be equal to the current application loan amount!')
      }
      else {
        $http.post(CONSTANT.HOST + 'lender_applications', {
          lenderProductDetails: lenderProductDetails,
          applicationId: $scope.applicationIdForRecommendedLenders
        })
          .success(function (application_process_data, status, headers, config) {
            getApplications( $scope.currentPageForWindowFocus, $scope.currentTab);
            toastr.success('Lenders have been successfully assigned!');
            $("#recommendedLender").modal('hide');
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      }
    }

      // -------------------BLOCK OF CHANNEL PARTNER ASSIGNMENT--------------------------------
      //get all lenders
    $scope.channelPartnersIds = [];
      $http.get(CONSTANT.HOST + 'channelPartners')
        .success(function (data, status, headers, config) {
          $scope.channelPartners = data;
          for(var i=0; i< $scope.channelPartners.length; i++){
            $scope.channelPartnersIds.push($scope.channelPartners[i].id.toString());
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });

    function findDeselectedItem(CurrentArray, PreviousArray) {
      var CurrentArrSize = CurrentArray.length;
      var PreviousArrSize = PreviousArray.length;
      // loop through previous array
      for(var j = 0; j < PreviousArrSize; j++) {
        // look for same thing in new array
        if (CurrentArray.indexOf(PreviousArray[j]) == -1)
          return PreviousArray[j];
      }
      return null;

    }

      function selectChannelPartner(channelPartners, applicationId, tab) {
        $http.post(CONSTANT.HOST + 'channel_partner_applications', {
          channelPartnersId: channelPartners,
          applicationId: applicationId
        })
          .success(function (data, status, headers, config) {

          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      }

    // open submit for approval modal
    function openSubmitForApprovalModal(index, product_id, tab){
      getRecommendedLendersWithSuggestedData(product_id, function(status){
        if(status == true){
          $scope.applicationIndex = index;
          $scope.applicationId = product_id;
          $scope.tabName = tab;
          $scope.rejectionReason = $scope.applications[index].rejectedReasonByOperator;
          $("#submitForApprovalModal").modal('show');
        }
        else{
          toastr.error('Please assign lenders for this application!')
        }
      })
    }

    // submit for approval function
    function submitForApproval(index, product_id, tab){
      var statusChange = {};
      statusChange.status = 'processed';
      $http.put(CONSTANT.HOST + 'application', {id: product_id, statusChange: statusChange})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully submitted!');
          getApplications(1, tab);
          $("#submitForApprovalModal").modal('hide');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    // open approval modal
    function openApprovedModal(index, product_id, tab){
          $scope.applicationIndex = index;
          $scope.applicationId = product_id;
          $scope.tabName = tab;
          $("#approvedModal").modal('show');
    }

    //  approval function
    function approveApplication(index, product_id, tab){
      var statusChange = {};
      statusChange.status = 'KC-approved';
      $http.put(CONSTANT.HOST + 'application', {id: product_id, statusChange: statusChange})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully approved!');
          getApplications(1, tab);
          $("#approvedModal").modal('hide');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    // open resend to operator modal
    function openResendToOperatorModal(index, product_id, tab){
      $scope.applicationIndex = index;
      $scope.applicationId = product_id;
      $scope.tabName = tab;
      $("#resendToOperatorModal").modal('show');
    }

    //  resend to operator function
    function resendToOperator(index, product_id, tab){
      var statusChange = {};
      statusChange.status = 'submitted';
      $http.put(CONSTANT.HOST + 'application', {id: product_id, statusChange: statusChange})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully send this application to operator!');
          getApplications(1, tab);
          $("#resendToOperatorModal").modal('hide');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    // change application status at different stages
    function changeApplicationStatus(id, applicationStatus, tabName, currentPage, action){
        $http.put(CONSTANT.HOST + 'application', {id: id, tabName: tabName, statusChange: {status: applicationStatus}})
          .success(function (data, status, headers, config) {
            if(tabName == 'reminders'){
              toastr.success('A notification sent to KC manager!');
            }
            else {
              toastr.success('Application status changed!');
            }
            getApplications(currentPage, tabName);
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
    }


    /*---------------------CODE---FOR----PERSONAL---DISCUSSION--------------*/
    function chatScrollToBottom(){
      $timeout(function(){
        var ppmsgHeight = document.getElementById('ppmsgHeight').offsetHeight;
        ppmsgHeight = ppmsgHeight +500;
        var elem = document.getElementById('popup-messages');
        elem.scrollTop = ppmsgHeight;
      },100);
    }

    function openPersonalDiscussionChatBox(applicationId, displayId){
      $scope.personalDiscussionApplicationId = applicationId;
      $scope.personalDiscussionApplicationDisplayId = displayId;
      $http.get(CONSTANT.HOST + 'personal_discussion/'+applicationId)
        .success(function (data, status, headers, config) {
         $scope.personalDiscussionData = data;
          $scope.chatBoxOpened = true;
          chatScrollToBottom();
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    function savePersonalDiscussion(personalDiscussionData, applicationId) {
      if (personalDiscussionData && personalDiscussionData.text!='') {
        personalDiscussionData.applicationId = applicationId;
        $http.post(CONSTANT.HOST + 'personal_discussion', {personal_discussion: personalDiscussionData})
          .success(function (data, status, headers, config) {
            $http.get(CONSTANT.HOST + 'personal_discussion/' + applicationId)
              .success(function (data, status, headers, config) {
                $scope.personalDiscussionData = data;
                $scope.personal_discussion.text = '';
                chatScrollToBottom();
              })
              .error(function (data, status, header, config) {
                console.log('err', data);
              });
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      }
    }

    // -------Filters------------------------------------
    $('.applicationFilterPanel .panel-body').slideUp();
    function openFilter(isOpen) {
      if(isOpen)
      $('.applicationFilterPanel .panel-body').slideUp();
      else
        $('.applicationFilterPanel .panel-body').slideDown();
    }

    function applyFilters(type){
      if(type == 'sortByUpdateDate') {
        if (!$scope.filters.sortByUpdateDate) {
          $scope.filters.sortByUpdateDate = 'ASC';
          delete $scope.filters.sortByCreateDate;
          delete $scope.filters.sortBySubmittedDate;
        }
        else if ($scope.filters.sortByUpdateDate == 'DESC') {
          $scope.filters.sortByUpdateDate = 'ASC';
          delete $scope.filters.sortByCreateDate;
          delete $scope.filters.sortBySubmittedDate;
        }
        else if ($scope.filters.sortByUpdateDate == 'ASC') {
          $scope.filters.sortByUpdateDate = 'DESC';
          delete $scope.filters.sortByCreateDate;
          delete $scope.filters.sortBySubmittedDate;
        }
      }
      if(type == 'sortByCreateDate') {
        if (!$scope.filters.sortByCreateDate) {
          $scope.filters.sortByCreateDate = 'DESC';
          delete $scope.filters.sortByUpdateDate;
          delete $scope.filters.sortBySubmittedDate;
        }
        else if ($scope.filters.sortByCreateDate == 'DESC') {
          $scope.filters.sortByCreateDate = 'ASC';
          delete $scope.filters.sortByUpdateDate;
          delete $scope.filters.sortBySubmittedDate;
        }
        else if ($scope.filters.sortByCreateDate == 'ASC') {
          $scope.filters.sortByCreateDate = 'DESC';
          delete $scope.filters.sortByUpdateDate;
          delete $scope.filters.sortBySubmittedDate;
        }
      }
      if(type == 'sortBySubmittedDate') {
        if (!$scope.filters.sortBySubmittedDate) {
          $scope.filters.sortBySubmittedDate = 'DESC';
          delete $scope.filters.sortByUpdateDate;
          delete $scope.filters.sortByCreateDate;
        }
        else if ($scope.filters.sortBySubmittedDate == 'DESC') {
          $scope.filters.sortBySubmittedDate = 'ASC';
          delete $scope.filters.sortByUpdateDate;
          delete $scope.filters.sortByCreateDate;
        }
        else if ($scope.filters.sortBySubmittedDate == 'ASC') {
          $scope.filters.sortBySubmittedDate = 'DESC';
          delete $scope.filters.sortByUpdateDate;
          delete $scope.filters.sortByCreateDate;
        }
      }


      if($scope.currentTab == 'lender-approved' || $scope.currentTab == 'lender-rejected'){
        getLenderApprovedRejectApplications(1, $scope.currentTab);
      }
      else{
        getApplications(1, $scope.currentTab);
      }
    }

    function resetAllFilters(){
      $scope.filters = {};
      if($scope.currentTab == 'lender-approved' || $scope.currentTab == 'lender-rejected'){
        getLenderApprovedRejectApplications(1, $scope.currentTab);
      }
      else{
        getApplications(1, $scope.currentTab);
      }
      $('.applicationFilterPanel .panel-body').slideUp();
      $scope.isOpen = false;
    }


    function openAssignedToBorrowerForOfferAcceptanceModal(index, product_id, type){
      $scope.applicationIndex = index;
      $scope.applicationId = product_id;
      $scope.assignmentType = type;
      $("#assignedToBorrowerForOfferAcceptance").modal('show');
    }

    // send a notification to borrower after all amount approval
    function assignedToBorrowerForOfferAcceptance(applicationId, index, type){
      $http.post(CONSTANT.HOST+'assigned_to_borrower_for_offer_acceptance', {type:type || '', applicationId: applicationId}).success(function(data, status, headers, config){
        $scope.totalAmountApprovedApplications[index].is_assigned_for_offer_acceptance = true;
        if(type)
        toastr.success('Notification successfully sent!');
        else
          toastr.success('Successfully assigned to borrower!');
        $("#assignedToBorrowerForOfferAcceptance").modal('hide');
      }).error(function(data, status, headers, config){
        toastr.error(data);
      })
    }

  });
