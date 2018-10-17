angular.module('craditKartApp')
  .controller('ChannelPartnerDashboardCtrl', function ($auth, $location, toastr, $scope, $state, $rootScope, $timeout, $http, CONSTANT) {

    $scope.applicationPerPage = 5;
    $scope.CurrentPage = 1;

    $scope.getApplications = getApplications;
    $scope.openCloseModal = openCloseModal;
    $scope.closeApplication= closeApplication;

    //get all application for channel partner
    function getApplications(currentPage) {
      $scope.CurrentPage = currentPage || 1;
        $http.get(CONSTANT.HOST + 'channelPartner/applications/' + $scope.CurrentPage + '/' + $scope.applicationPerPage)
          .success(function (data, status, headers, config) {
            $scope.applications = data.applications;
            $scope.totalApplications = data.count;
            window.scrollTo(0, 0);
            console.log($scope.applications);
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
    }

    getApplications(1);

    // function for open delete modal
    function openCloseModal(index, applicationId) {
      $scope.applicationIndex = index;
      $scope.applicationId = applicationId;
      $("#closeApplicationsByChannelPartner").modal('show');
    }

    // function for delete application
    function closeApplication(index, id) {
      var statusChange = {};
      statusChange.status = 'closed';
      $http.put(CONSTANT.HOST + 'application', {id: id, statusChange: statusChange})
        .success(function (data, status, headers, config) {
          toastr.success('Successfully closed!');
          getApplications(1);
          $("#closeApplicationsByChannelPartner").modal('hide');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }


  });
