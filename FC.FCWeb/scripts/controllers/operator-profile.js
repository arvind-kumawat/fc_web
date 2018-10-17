angular.module('craditKartApp')
  .controller('OperatorProfileCtrl', function ($scope, toastr, $rootScope, $http, CONSTANT) {
    $scope.operatorProfile={};
    $scope.showPanel=false;
    $scope.updateOperatorName= updateOperatorName;
    $scope.updateOperatorEmail= updateOperatorEmail;
    $scope.getOperatorData = getOperatorData;
    $scope.updateOperatorPassword = updateOperatorPassword;

    function getOperatorData(){
      $http.get(CONSTANT.HOST + 'user/profile')
        .success(function (data, status, headers, config) {
          $scope.operatorProfile = data;
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    getOperatorData();

    // OPERATOR NAME UPDATING
    function updateOperatorName(name){
      $http.put(CONSTANT.HOST + 'operator/profile', {
        fullname: name
      })
        .success(function (data, status, headers, config) {
          toastr.success("Name Updated");
          $scope.disabledName=true;
          getOperatorData();
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    // OPERATOR EMAIL UPDATING
    function updateOperatorEmail(emailID){
      $http.put(CONSTANT.HOST + 'operator/profile', {
        email: emailID
      })
        .success(function (data, status, headers, config) {
          if(data=="email already exist"){
            toastr.error(data);
          }else {
            toastr.success("Email Updated");
            $scope.disabledEmail = true;
            getOperatorData();
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    //OPERATOR PASSWORD UPDATING
    function updateOperatorPassword(oldPaasword, newPassword, confirmPassword){
      $http.put(CONSTANT.HOST + 'operator/profile', {
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
