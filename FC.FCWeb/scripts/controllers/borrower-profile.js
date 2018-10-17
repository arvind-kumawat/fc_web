angular.module('craditKartApp')
  .controller('BorrowerProfileCtrl', function ($scope, toastr, $rootScope, $http, CONSTANT) {
    $scope.borrowerProfile={};
    $scope.showPanel=false;
    $scope.updateBorrowerName= updateBorrowerName;
    $scope.updateBorrowerEmail= updateBorrowerEmail;
    $scope.getBorrowerData = getBorrowerData;
    $scope.updateBorrowerPassword = updateBorrowerPassword;

    function getBorrowerData(){
      $http.get(CONSTANT.HOST + 'user/profile')
        .success(function (data, status, headers, config) {
          $scope.borrowerProfile = data;
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    getBorrowerData();

    // BORROWER NAME UPDATING
    function updateBorrowerName(name){
      $http.put(CONSTANT.HOST + 'borrower/profile', {
        fullname: name
      })
        .success(function (data, status, headers, config) {
          toastr.success("Name Updated");
          $scope.disabledName=true;
          getBorrowerData();
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    // BORROWER EMAIL UPDATING
    function updateBorrowerEmail(emailID){
      $http.put(CONSTANT.HOST + 'borrower/profile', {
        email: emailID
      })
        .success(function (data, status, headers, config) {
          if(data=="email already exist"){
            toastr.error(data);
          }else {
            toastr.success("Email Updated");
            $scope.disabledEmail = true;
            getBorrowerData();
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    //BORROWER PASSWORD UPDATING
    function updateBorrowerPassword(oldPaasword, newPassword, confirmPassword){
      $http.put(CONSTANT.HOST + 'borrower/profile', {
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
