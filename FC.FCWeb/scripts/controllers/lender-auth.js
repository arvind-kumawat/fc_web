angular.module('craditKartApp')
  .controller('LenderAuthCtrl', function ($auth, $location, toastr, $scope, $state, $rootScope, $timeout, $http, CONSTANT) {

    $scope.lenderSignup =lenderSignup;
    $scope.sendOtpToLender = sendOtpToLender;
    $scope.VerifyAccountOfLender =VerifyAccountOfLender;
    $scope.lenderLogin = lenderLogin;

    function lenderSignup(user) {
      $scope.user = user;
      if (user.fullname == undefined || user.email == undefined || user.phone == undefined || user.password == undefined) {
        return '';
      }
      else {
        // if user is lender, than assign a user role
        $scope.user.user_type = 'lender';

        //check user is already exists
        $http.get(CONSTANT.HOST + 'auth/checkUser/' + $scope.user.email + "/" + $scope.user.phone).then(function (response) {
          console.log('response', response);
          if (response.data.error == 'user already exists!') {
            toastr.error('user already exists!');
            return '';
          }
          else {
            sendOtpToLender();
          }
        }, function (response) {
          toastr.error('Something went wrong');
        });
      }
    }

    // send or resend otp and create a temp user in database
    function sendOtpToLender() {
      // Open OTP modal
      $http.post(CONSTANT.HOST + 'auth/temp_signup', $scope.user)
        .success(function (data, status, headers, config) {
          if (data.message == 'success') {
            $timeout(function () {
              $rootScope.otpModal = true;
              $('#verifyModalForLender').modal('show');
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
    function VerifyAccountOfLender(otp) {
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
            $('#verifyModalForLender').modal('hide');
            window.location.href = '/lender/dashboard';
          }
        })
        .catch(function (response) {
          toastr.error('error in signup');
        });
    }

    function lenderLogin(user) {
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
              window.location.href = '/lender/dashboard';
              $state.go('lender.dashboard');
            }

          }).catch(function (data) {
            console.log("error");

            toastr.error('Error: Login failed');
          });
      }
    }
  });
