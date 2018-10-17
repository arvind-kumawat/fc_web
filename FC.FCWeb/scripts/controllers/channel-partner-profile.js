angular.module('craditKartApp')
  .controller('ChannelPartnerProfileCtrl', function ($scope, toastr, $rootScope, $http, CONSTANT) {
    $scope.channelPartnerProfile={};
    $scope.showPanel=false;
    $scope.updateChannelPartnerName= updateChannelPartnerName;
    $scope.updateChannelPartnerEmail= updateChannelPartnerEmail;
    $scope.getChannelPartnerData = getChannelPartnerData;
    $scope.updateChannelPartnerPassword = updateChannelPartnerPassword;

    function getChannelPartnerData(){
      $http.get(CONSTANT.HOST + 'user/profile')
        .success(function (data, status, headers, config) {
          $scope.channelPartnerProfile = data;
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    getChannelPartnerData();

    // CHANNEL PARTNER NAME UPDATING
    function updateChannelPartnerName(name){
      $http.put(CONSTANT.HOST + 'channelPartner/profile', {
        fullname: name
      })
        .success(function (data, status, headers, config) {
          toastr.success("Name Updated");
          $scope.disabledName=true;
          getChannelPartnerData();
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    // CHANNEL PARTNER EMAIL UPDATING
    function updateChannelPartnerEmail(emailID){
      $http.put(CONSTANT.HOST + 'channelPartner/profile', {
        email: emailID
      })
        .success(function (data, status, headers, config) {
          if(data=="email already exist"){
            toastr.error(data);
          }else {
            toastr.success("Email Updated");
            $scope.disabledEmail = true;
            getChannelPartnerData();
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    //CHANNEL PARTNER PASSWORD UPDATING
    function updateChannelPartnerPassword(oldPaasword, newPassword, confirmPassword){
      $http.put(CONSTANT.HOST + 'channelPartner/profile', {
        password : oldPaasword,
        newPassword : newPassword,
        confirmPassword : confirmPassword
      })
        .success(function (data, status, headers, config) {
          if(data=="Old password is incorrect"){
            toastr.error('Old password is incorrect');
          }else {
            toastr.success("Password Updated");
            $scope.showPanel=false;
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

  });
