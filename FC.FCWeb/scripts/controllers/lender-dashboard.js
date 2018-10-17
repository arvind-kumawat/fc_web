'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:LenderCtrl
 * @description
 * # LenderCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('LenderDashboardCtrl', function ($auth, $location, toastr, $scope, $state, $rootScope, $timeout, $http, CONSTANT) {

    // VARIABLE DECLARATION/INITIALIZATION
    $scope.applicationPerPage = 5;
    $scope.currentPage = 1;
    $scope.applications = [];

    // FUNCTION DECLARATION
    $scope.openRegisterModal = openRegisterModal;
    $scope.openLoginModal = openLoginModal;
    $scope.getLenderApplications = getLenderApplications;
    $scope.editApplicationProcess = editApplicationProcess;
    $scope.openEditApplicationProcessModal = openEditApplicationProcessModal;
    $scope.openRejectionReasonModal = openRejectionReasonModal;
    $scope.openStatusChangeConfirmationModal = openStatusChangeConfirmationModal;
    $scope.lenderProfile={};

    // function when click on apply
    function openRegisterModal() {
      $rootScope.registerModal = true;
      $rootScope.loginModal = true;
      $('#myModal').modal('show');
    }

    // function when click on login
    function openLoginModal() {
      $rootScope.registerModal = false;
      $rootScope.loginModal = false;
      $('#myModal').modal('show');
    }

    if ($location.path() == '/lender/registration') {
      if ($rootScope.isLoggedIn && $auth.getPayload().user_type != 'lender') {
        toastr.error('Unauthorized: Access', 401);
        $state.transitionTo('home');
      }
    }


    //get all lender application
    function getLenderApplications(currentPage) {
      $http.get(CONSTANT.HOST + 'lender_applications/' + currentPage + '/' + $scope.applicationPerPage)
        .success(function (data, status, headers, config) {
          $scope.applications = data.applications;
          $scope.totalApplications = data.count;
          console.log(data);
          window.scrollTo(0, 0);
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    // open edit application process modal
    function openEditApplicationProcessModal(applicationProcessData, index) {
          $scope.lenderProductDetails = applicationProcessData;
          $scope.applicationProcessesId = applicationProcessData.id;
          $scope.applicationProcessIndex = index;
          $("#editApplicationProcessDetails").modal('show');
    }
    // edit application process
    function editApplicationProcess(lenderProductDetails, applicationProcessId, index){
      $http.put(CONSTANT.HOST + 'lender_applications', {editApplicationProcess: {applicationProcessId: applicationProcessId, lenderProductDetails: lenderProductDetails}})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully updated!');
          $("#editApplicationProcessDetails").modal('hide');
          console.log('editable dta', data);
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    if ($rootScope.isLoggedIn && $auth.getPayload().user_type == 'lender') {
      getLenderApplications(1);
      // change lender status
      $scope.changeLenderStatus = function (applicationProcessId, lender_status, index, rejectionReason) {
        if (lender_status == 'lender-approved') {
          $http.put(CONSTANT.HOST + 'lender_applications', {
            updateStatus: {
              applicationProcessId: applicationProcessId,
              status: lender_status
            }
          })
            .success(function (data, status, headers, config) {
              console.log('status dta', data);
              $scope.applications[index].lender_status = lender_status;
              toastr.success('Loan is approved');
              $("#statusChangeConfirmationModal").modal('hide');
            })
            .error(function (data, status, header, config) {
              console.log('err', data);
            });
        }
        else if(lender_status == 'lender-rejected'){
          $http.put(CONSTANT.HOST + 'lender_applications', {
            updateStatusWithRejectionReason: {
              applicationProcessId: applicationProcessId,
              status: lender_status,
              rejectionReason: rejectionReason
            }
          })
            .success(function (data, status, headers, config) {
              console.log('status dta', data);
              $scope.applications[index].lender_status = lender_status;
              toastr.success('Application is rejected!');
              $("#rejectionReasonModal").modal('hide');
            })
            .error(function (data, status, header, config) {
              console.log('err', data);
            });
        }
      }


    }// end check of user type

    function openRejectionReasonModal(applicationId, status, index){
      $scope.rejectionReason = '';
      $scope.rejectionReasonApplicationProcessId = applicationId;
      $scope.rejectionReasonStatus = status;
      $scope.rejectionReasonIndex = index;
      $("#rejectionReasonModal").modal('show');
    }

    function openStatusChangeConfirmationModal(applicationData, status, index){
      $scope.statusChangeApplicationProcessId = applicationData.id;
      $scope.applicationDataForApproval = applicationData;
      $scope.statusChangeStatus = status;
      $scope.statusChangeIndex = index;
      $("#statusChangeConfirmationModal").modal('show');
    }

  });
