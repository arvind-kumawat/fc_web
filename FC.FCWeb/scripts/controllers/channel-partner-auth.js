angular.module('craditKartApp')
  .controller('ChannelPartnerAuthCtrl', function ($auth, $location, toastr, $scope, $state, $rootScope, $timeout, $http, CONSTANT) {

    $scope.showDiv = false;

    $scope.channelPartnerSignup =channelPartnerSignup;
    $scope.sendOtpToChannelPartner = sendOtpToChannelPartner;
    $scope.VerifyAccountOfChannelPartner =VerifyAccountOfChannelPartner;
    $scope.channelPartnerLogin = channelPartnerLogin;

    function channelPartnerSignup(user) {
      $scope.user = user;
      if (user.fullname == undefined || user.email == undefined || user.phone == undefined || user.password == undefined) {
        return '';
      }
      else {
        // if user is lender, than assign a user role
        $scope.user.user_type = 'channel partner';

        //check user is already exists
        $http.get(CONSTANT.HOST + 'auth/checkUser/' + $scope.user.email + "/" + $scope.user.phone).then(function (response) {
          console.log('response', response);
          if (response.data.error == 'user already exists!') {
            toastr.error('user already exists!');
            return '';
          }
          else {
            sendOtpToChannelPartner();
          }
        }, function (response) {
          toastr.error('Something went wrong');
        });
      }
    }

    // send or resend otp and create a temp user in database
    function sendOtpToChannelPartner() {
      // Open OTP modal
      $http.post(CONSTANT.HOST + 'auth/temp_signup', $scope.user)
        .success(function (data, status, headers, config) {
          if (data.message == 'success') {
            $timeout(function () {
              $rootScope.otpModal = true;
              $('#verifyModalForChannelPartner').modal('show');
            }, 200);
            $scope.showOtpSuccesMessage = true;
            $timeout(function () {
              $scope.showOtpSuccesMessage = false;
            }, 10000);
          }
          else {
            toastr.error('something went wrong!');
          }
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    //-----------OTP Model-------------------
    function VerifyAccountOfChannelPartner(otp) {
      $scope.user.otp = otp;
      $auth.signup($scope.user)
        .then(function (response) {
          if (response.data.message == 'OTP does not match') {
            toastr.error('OTP does not match!');
          }
          else {
            $auth.setToken(response);
            toastr.info('You have successfully created a new account and have been signed-in');
            toastr.info('Successfully verify your kreditcart account');
            $('#verifyModalForChannelPartner').modal('hide');
            window.location.href = '/channel-partner/dashboard/home';
          }
        })
        .catch(function (response) {
          toastr.error('error in signup');
        });
    }

    function channelPartnerLogin(user) {
      if (user.phone == undefined || user.password == undefined) {
      }
      else {
        $auth.login(user)
          .then(function (data) {
            if (data.data.error) {
              $scope.iserror = true;
              $scope.message = data.data.error;

            }
            else {
              window.location.href = '/channel-partner/dashboard/home';
            }

          }).catch(function (data) {
            console.log("error");

            toastr.error('Error: Login failed');
          });
      }
    }

  });
