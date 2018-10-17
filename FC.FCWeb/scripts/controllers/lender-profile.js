angular.module('craditKartApp')
  .controller('LenderProfileCtrl', function ($auth, $location, toastr, $scope, $state, $rootScope, $timeout, $http, CONSTANT) {

    $scope.updateLenderName= updateLenderName;
    $scope.updateLenderEmail= updateLenderEmail;
    $scope.getLenderData = getLenderData;
    $scope.updateLenderPassword = updateLenderPassword;

    // Profile Page Updation
    function getLenderData(){
      $http.get(CONSTANT.HOST + 'user/profile')
        .success(function (data, status, headers, config) {
          $scope.lenderProfile = data;
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    getLenderData();

    // LENDER NAME UPDATING
    function updateLenderName(name){
      $http.put(CONSTANT.HOST + 'lender/profile', {
        fullname: name
      })
        .success(function (data, status, headers, config) {
          toastr.success("Name Updated");
          $scope.disabledName=true;
          getLenderData();
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    // LENDER EMAIL UPDATING
    function updateLenderEmail(emailID){
      $http.put(CONSTANT.HOST + 'lender/profile', {
        email: emailID
      })
        .success(function (data, status, headers, config) {
          if(data=="email already exist"){
            toastr.error(data);
          }else {
            toastr.success("Email Updated");
            $scope.disabledEmail = true;
            getLenderData();
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }
    $scope.showLenderPanel = false;
    //LENDER PASSWORD UPDATING
    function updateLenderPassword(oldPassword, newPassword, confirmPassword){
      $http.put(CONSTANT.HOST + 'lender/profile', {
        password : oldPassword,
        newPassword : newPassword,
        confirmPassword : confirmPassword
      })
        .success(function (data, status, headers, config) {
          if(data=="Old password is incorrect"){
            toastr.error('Old password is incorrect');
          }else {
            toastr.success("Password Successfully Updated");
            console.log($scope.showLenderPanel);
            $scope.showLenderPanel = false;
            console.log($scope.showLenderPanel);
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

  });
