angular.module('craditKartApp')
  .controller('ChannelPartnerMyApplicationCtrl', function ($auth, $location, toastr, $scope, $state, $rootScope, $timeout, $http, CONSTANT) {

    $scope.applicationPerPage = 5;
    $scope.CurrentPage = 1;

    $scope.getApplications = getApplications;
    $scope.editApplication = editApplication;
    $scope.openRejectOfferModal = openRejectOfferModal;
    $scope.openAcceptOfferModal = openAcceptOfferModal;
    $scope.acceptOffer = acceptOffer;
    $scope.rejectOffer = rejectOffer;
    $scope.hideNotification = hideNotification;
    $scope.getNotifications =getNotifications;
    $scope.deleteApplication = deleteApplication;
    $scope.openDeleteApplicationModal= openDeleteApplicationModal;

    //get all application for channel partner
    function getApplications(currentPage) {
      $scope.CurrentPage = currentPage || 1;
      $http.get(CONSTANT.HOST + 'application/' + $scope.CurrentPage + '/' + $scope.applicationPerPage+'/all')
        .success(function (data, status, headers, config) {
          $scope.applications = data.applications;
          $scope.totalApplications = data.count;
          window.scrollTo(0, 0);
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    getApplications(1);

    //open edit application apge
    function editApplication(id, is_completed) {
      if(is_completed){
        $state.go('borrower.application.uploads', {id: id})
      }
      else{
        $state.go('borrower.application.loan_details', {id: id})
      }
   /*   $http.get(CONSTANT.HOST + 'application/' + id)
        .success(function (data, status, headers, config) {
          if (data.length > 0) {
            if (data[0].references.length > 0) {
              $state.go('borrower.application.uploads', {id: id})
            }
            else if (data[0].partner_details.length >= 1 || data[0].employer_details.length > 0) {
              $state.go('borrower.application.references', {id: id})
            }
            else if (data[0].business_details.length > 0 && data[0].typeOfLoan == 'Business') {
              $state.go('borrower.application.partner_details', {id: id})
            }
            else if (data[0].business_details.length > 0 && data[0].entityType != 'Salaried Professional') {
              $state.go('borrower.application.personal_details', {id: id})
            }
            else if (data[0].personal_details.length > 0 && data[0].entityType == 'Salaried Professional') {
              $state.go('borrower.application.employer_details', {id: id})
            }
            else if (data[0].personal_details.length > 0 && data[0].typeOfLoan == 'Personal' && data[0].entityType != 'Salaried Professional') {
              $state.go('borrower.application.references', {id: id})
            }
            else {
              $state.go('borrower.application.loan_details', {id: id})
            }
          }
          else {
            $state.go('dashboard');
          }
        })*/
    }

    // open modal for offer acceptance confirmation
    function openAcceptOfferModal(applicationId, index){
      $scope.offerAcceptedApplicationId = applicationId;
      $scope.offerAcceptedIndex = index;
      $("#acceptApplicationByChannelPartnerModal").modal('show');
    }

    // open modal for offer rejection confirmation
    function openRejectOfferModal(applicationId, index){
      $scope.offerRejectedApplicationId = applicationId;
      $scope.offerRejectedIndex = index;
      $scope.rejectionReason = $scope.applications[index].rejectedReasonByBorrower;
      $("#rejectApplicationByChannelPartnerModal").modal('show');
    }

    //function for accept offer
    function acceptOffer(applicationId, index){
      var statusChange = {};
      statusChange.status = 'borrower-accepted';
      $http.put(CONSTANT.HOST + 'application', {id: applicationId, statusChange: statusChange})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully accepted!');
          $scope.applications[index].status= 'borrower-accepted';
          $("#acceptApplicationByChannelPartnerModal").modal('hide');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    //function for reject offer
    function rejectOffer(applicationId, index, reason){
      var statusChange = {};
      statusChange.status = 'borrower-rejected';
      statusChange.rejectedReasonByBorrower = reason;
      $http.put(CONSTANT.HOST + 'application', {id: applicationId, statusChange: statusChange})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully rejected!');
          $scope.applications[index].status= 'borrower-rejected';
          $("#rejectApplicationByChannelPartnerModal").modal('hide');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    function hideNotification(id, index){
      $http.put(CONSTANT.HOST + 'notifications', {id: id, data: {display: false}})
        .then(function (response) {
          toastr.success('Successfully removed!');
          $scope.notifications.splice(index, 1);
        })
        .catch(function (response) {
          toastr.error('error in removal');
        });
    }

    function getNotifications(){
      $http.get(CONSTANT.HOST+'notifications').success(function(data){
        $scope.notifications = [];
        for(var i in data){
          if(data[i].display){
            $scope.notifications.push(data[i]);
          }
        }
      }).error(function(error){
        console.log('error: ', error);
      })
    }

    getNotifications();

    function deleteApplication(applicationId, index){
      $http.delete(CONSTANT.HOST + 'application/' + applicationId)
        .success(function (data, status, headers, config) {
          $scope.applications.splice(index, 1);
          $('#deleteAppBychannelPartner').modal('hide');
          toastr.success('Successfully deleted!');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    function openDeleteApplicationModal(applicationId, index){
      $scope.currentApplicationId = applicationId;
      $scope.currentApplicationIndex = index;
      $('#deleteAppBychannelPartner').modal('show');
    }

  });
