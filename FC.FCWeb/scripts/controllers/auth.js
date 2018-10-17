'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('AuthCtrl', function ($auth, $location, toastr, $scope, $state, $rootScope, $timeout, $http, CONSTANT, authTokenRepository, personRepository, loginDetailRepository, otpRepository,
      notificationRepository, AUTH_DATA, loanAccountRepository, permissionRepository, RoleRepository) {

      // VARIABLE DECLARATION/INITIALIZATION
      $scope.form = {};
      $scope.remember = true;
      $scope.loginInProgress = false;
      $scope.visiblePassword = false;
      $scope.passwordtype = "password";
      $scope.ShowPhoneValidation = false;
      $scope.showOtpFailMessage = false;
      $scope.PasswordMatch = true;
      $scope.IsValidated = true;

      $scope.user = {};
      $rootScope.Newuser = {
          FirstName: '',
          LastName: '',
          EmailId: '',
          MobilePhone: '',
          Password: '',
          ConfPassword: '',
          dnd_accepted: '',
          term_accepted: '',
      };
      $rootScope.localUser = {
          MobilePhone: '',
      };
      $scope.notifications = [];

      // METHOD DECLARATION
      $scope.userSignup = userSignup;
      $scope.sendOtp = sendOtp;
      $scope.VerifyOTP = VerifyOTP;
      $scope.VerifyAccount = VerifyAccount;
      $scope.logout = logout;
      $scope.login = login;
      $scope.socialAuthentication = socialAuthentication;
      $scope.openRegisterModal = openRegisterModal;
      $scope.openLogin = openLogin;
      $scope.switchToRegister = switchToRegister;
      $scope.switchToLogin = switchToLogin;
      $scope.checkMobile = checkMobile;
      $scope.checkEmail = checkEmail;
      $scope.pinForgot = pinForgot;
      $scope.IsMobileExist = IsMobileExist;
      //$scope.sendForgetOtp = sendForgetOtp;
      $scope.VerifyForgetAccount = VerifyForgetAccount;
      $scope.confirmPassword = confirmPassword;
      $scope.getNotifications = getNotifications;
      $scope.hideNotification = hideNotification;
      $scope.visitActionLink = visitActionLink;
      $scope.closeNotificationDropdown = closeNotificationDropdown;
      $scope.makePasswordVisible = makePasswordVisible;
      $scope.authExternalProvider = authExternalProvider;
      $scope.randomnum = randomnum;
      $scope.wrongCaptcha = false;
      $rootScope.loginDetailsNotAvailable = false;
      $scope.runLoginUpdate = false;




      function editApplication(loanAccountId, productId) {
          $state.go('borrower.application.business_details', { productId: productId, Id: loanAccountId })
      }

      function randomnum() {
          var number1 = 1;
          var number2 = 10;
          var randomnum = (parseInt(number2) - parseInt(number1)) + 1;
          $scope.randam1 = Math.floor(Math.random() * randomnum) + parseInt(number1);
          $scope.randam2 = Math.floor(Math.random() * randomnum) + parseInt(number1);
      }

      $scope.submitCaptcha = function () {
          $scope.total = $scope.randam1 + $scope.randam2;
          if ($scope.total != $scope.total1) {
              $scope.wrongCaptcha = true;
              randomnum();
              return false;

          }
          else {
              $scope.wrongCaptcha = false;
              return true;

          }
      }

      function authExternalProvider(provider) {
          var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

          var externalProviderUrl = CONSTANT.HOST + "api/Account/ExternalLogin?provider=" + provider
                                                                      + "&response_type=token&client_id=" + AUTH_DATA.clientId
                                                                      + "&redirect_uri=" + redirectUri;
          window.$windowScope = $scope;
          //window.location.href = externalProviderUrl;
          var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=1200,height=750");
          //var oauthWindow = window.open(externalProviderUrl, "Authenticate Account");
      }

      $scope.init = function () {
          $scope.currentState = $state;
          $scope.$watch("currentState", function () {
              if ($scope.currentState.params.loginParams != null) {
                  var externalAuthData = $scope.currentState.params.loginParams;
                  $rootScope.Newuser.FirstName = externalAuthData.firstName,
                  $rootScope.Newuser.LastName = externalAuthData.lastName;
                  $rootScope.Newuser.EmailId = externalAuthData.email
              }
          })

      }

      function fbLogoutUser(accessToken) {
          FB.getLoginStatus(function (response) {
              console.log("Logout response", response)
              if (response) {
                  response.access_token = accessToken;
                  FB.logout(function (response) {
                      //document.location.reload();
                      console.log("Logged out", response)
                  });
              }
          });
      }

      $scope.init();

      $scope.authCompletedCB = function (fragment) {
          $scope.$apply(function () {
              if (fragment.haslocalaccount == 'False') {
                  //logout();
                  var externalAuthData = {
                      provider: fragment.provider,
                      firstName: fragment.external_user_first_name,
                      lastName: fragment.external_user_last_name,
                      externalAccessToken: fragment.external_access_token,
                      email: fragment.email
                  };
                  $rootScope.Newuser.FirstName = externalAuthData.firstName,
                  $rootScope.Newuser.LastName = externalAuthData.lastName;
                  $rootScope.Newuser.EmailId = externalAuthData.email
                  $state.go('Registarion', { loginParams: externalAuthData })
                  // $rootScope.Newuser.FirstName = externalAuthData.firstName,
                  // $rootScope.Newuser.LastName = externalAuthData.lastName;
                  // $rootScope.Newuser.EmailId = externalAuthData.email

              }
              else {
                  //Obtain access token and redirect to main page
                  var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token, email: fragment.email };
                  authTokenRepository.obtainAccessToken(externalData, function (success) {
                      console.log("Success Callback", externalData)

                      $.ajax({
                          url: success.fbLogoutUrl,
                          type: 'GET',
                          dataType: 'jsonp'
                      })

                      loginDetailRepository.GetById(success.loginDetailId, function (loginDetailCallback) {
                          if (loginDetailCallback != null && loginDetailCallback.LoginDetailId > 0) {
                              $rootScope.loginDetailsForLoanWizard = loginDetailCallback;
                              $scope.loginInProgress = false;
                              $auth.loggedIn(loginDetailCallback);
                              localStorage.setItem('AuthData', success.access_token);
                              permissionRepository.Get(function (permissions) {
                                  $auth.setPermissions(permissions);
                                  getApplication($rootScope.loginDetailsForLoanWizard.Person.Id)
                                  //$state.go('borrower.dashboard.applications');
                                  $rootScope.isLoggedIn = true;
                                  $rootScope.loggedInUser = $auth.getPayload();
                              })
                          }
                          else {
                              $scope.loginInProgress = false;
                              $scope.IsValidated = false;
                          }
                      })
                  },
               function (err) {
                   $scope.message = err.error_description;
               });
              }
          });
      }
      //On refrashing go back to home
      //window.onbeforeunload = function () {
      //    $state.go('home');
      //}

      // get all user notifications
      function getNotifications() {

          notificationRepository.GetByLoggedInPerson(function (callback) {
              $scope.notifications = callback;
              console.log("Notifications", $scope.notifications);

          })
      }
      $scope.goToApplication = function () {
          closeNotificationDropdown();
          $state.go('borrower.dashboard.applications');
      }
      if ($auth.isAuthenticated()) {
          //getNotifications();
      }

      // populate information on header if user is logged in
      if ($auth.isAuthenticated()) {
          $rootScope.loggedInUser = $auth.getPayload();
          $rootScope.isLoggedIn = true;
      }
      else {
          $rootScope.loggedInUser = {};
          $rootScope.isLoggedIn = false;
      }

      //User will enter full name so extract name into firdt name, middle name and last name
      var extractName = function (name) {
          var allName = [];
          var names = name.trim().split(' ');
          var firstName, middleName, lastName;
          if (names.length == 3) {
              firstName = names[0];
              middleName = names[1];
              lastName = names[2];
          }
          else if (names.length > 3) {
              var firstNameArr = []
              for (var i = 0; i < names.length - 2; i++) {
                  firstNameArr.push(names[i]);
              }
              firstName = firstNameArr.join(' ');
              middleName = names[names.length - 2];
              lastName = names[names.length - 1];
          }
          else if (names.length == 1) {
              firstName = names[0];
              middleName = null;
              lastName = null;
          }
          else {
              firstName = names[0];
              middleName = null;
              lastName = names[1];
          }
          allName.push(firstName);
          allName.push(middleName);
          allName.push(lastName);
          return allName;
      }

      function makePasswordVisible() {
          $scope.visiblePassword = !$scope.visiblePassword;
          if ($scope.passwordtype == "password")
              $scope.passwordtype = "text";
          else
              $scope.passwordtype = "password";

      }

      //-------------------USER SIGN UP----------------------
      $scope.registrationInProgress = false;
      function userSignup(user) {
          $scope.registrationInProgress = true;
          $scope.isMobileExistsForRegistration = false;
          $scope.isEmailExists = false;
          $rootScope.user = user;
          if (!user.FirstName || !user.LastName || !user.EmailId || !user.MobilePhone || !user.Password || !user.ConfPassword || !user.term_accepted || !$scope.submitCaptcha()) {
              $scope.registrationInProgress = false;
              return '';
          }
          else if (user.Password != user.ConfPassword) {
              $scope.registrationInProgress = false;
              $scope.PasswordMatch = false;
          }
          else {
              $scope.wrongCaptcha = false;
              personRepository.IsLoginDetailAlreadyExist(user.EmailId, user.MobilePhone, function (callback) {
                  console.log("callbackkk", callback);
                  if (callback[0] != null) {
                      $scope.isEmailExists = true;
                      $scope.registrationInProgress = false;
                  }
                  console.log("callbackkk", callback);
                  if (callback[1] != null) {
                      $scope.isMobileExistsForRegistration = true;
                      $scope.registrationInProgress = false;
                  }


                  if (!$scope.isMobileExistsForRegistration && !$scope.isEmailExists) {
                      //var names = extractName(user.Name);
                      //user.FirstName = names[0];
                      //user.MiddleName = names[1];
                      //user.LastName = names[2];
                      user.UserName = user.EmailId;
                      user.IsLoginable = true;

                      RoleRepository.getRoleOfBoorower(function (callback) {
                          $scope.BorrowerRole = callback;
                          user.FKRoleId = $scope.BorrowerRole.RoleId;
                          if (user.FKRoleId > 0)
                              loginDetailRepository.Create(user, function (loginCallback) {
                                  user.FKLoginDetailId = loginCallback.LoginDetailId;
                                  personRepository.Save(user, function (personCallback) {

                                      $rootScope.user = user;
                                      //$scope.sendOtpNewUser(user.MobilePhone);
                                      sendOtp(user, 'Registration');
                                  })
                              });
                      })
                  }
                  else {
                      $scope.registrationInProgress = false;
                  }
              })


              //personRepository.IsEmailExists(user.EmailId, function (emailCallback) {
              //    $scope.isEmailExists = emailCallback;
              //    if (!$scope.isMobileExistsForRegistration && !$scope.isEmailExists) {
              //        //var names = extractName(user.Name);
              //        //user.FirstName = names[0];
              //        //user.MiddleName = names[1];
              //        //user.LastName = names[2];
              //        user.UserName = user.EmailId;
              //        user.IsLoginable = true;
              //        RoleRepository.getRoleOfBoorower(function (callback) {
              //            $scope.BorrowerRole = callback;
              //            user.FKRoleId = $scope.BorrowerRole.RoleId;
              //            if(user.FKRoleId > 0)
              //                loginDetailRepository.Create(user, function (loginCallback) {
              //                    user.FKLoginDetailId = loginCallback.LoginDetailId;
              //                    personRepository.Save(user, function (personCallback) {

              //                        $rootScope.user = user;
              //                        //$scope.sendOtpNewUser(user.MobilePhone);
              //                        sendOtp(user, 'Registration');
              //                    })
              //                });
              //        })                  
              //    }
              //    else {
              //        $scope.registrationInProgress = false;
              //    }
              //})
              //})
          }
      }
      $scope.closeOtpPopUp = function () {
          $('#myModal').modal('hide');
      }

      // send or resend otp and create a temp user in database
      $rootScope.userMobileNumber;
      function sendOtp(user, source) {
          console.log('user', user);
          if (user)
              $rootScope.userMobileNumber = user.MobilePhone;
          else
              $rootScope.userMobileNumber = $rootScope.user.MobilePhone;
          if ((typeof (user) == "undefined") || (user == "")) {
              user = $rootScope.user;
          }
          // Open OTP modal
          otpRepository.GetForMobileNumber(user.MobilePhone, function (callback) {
              $scope.otp = ""
              $scope.registrationInProgress = false;
              $('#myModal').modal('hide');
              $timeout(function () {
                  $rootScope.otpModal = true;
                  $scope.showOtpFailMessage = false;
                  $('#verifyOTPModelRegistration input').val("");
                  $('#verifyOTPModelRegistration').modal('show');
              }, 200);
              $scope.showOtpSuccesMessage = true;
              $timeout(function () {
                  $scope.showOtpSuccesMessage = false;
              }, 10000);
          })

      }

      $('#verifyModal').on('hidden.bs.modal', function (e) {
          // do something...
          $('#verifyModal input').val("");
      })

      $scope.VerifyOtpAuthentication = function (otpData, source) {
          authTokenRepository.authenticateByOtp(otpData, function (success) {
              loginDetailRepository.GetById(success.loginDetailId, function (loginDetailCallback) {
                  if (loginDetailCallback != null && loginDetailCallback.LoginDetailId > 0) {
                      $auth.loggedIn(loginDetailCallback);
                      localStorage.setItem('AuthData', success.access_token);

                      $('#verifyModal').modal('hide');

                      permissionRepository.Get(function (permissions) {
                          $auth.setPermissions(permissions);
                          if (source == 'login') {
                              $('#verifyForgetOtpModal input').val("");
                              $('#verifyForgetOtpModal').modal('show');
                          } else {
                              $('#verifyOTPModelRegistration').modal('hide');
                              $state.go('borrower.application.business_details', { productId: '', Id: '' });
                          }


                          //$state.go('borrower.application.business_details', { productId: '', Id: '' });
                          $rootScope.isLoggedIn = true;
                          $rootScope.loggedInUser = $auth.getPayload();
                      })
                  }

              });


              // if ($auth.getPayload().user_type == 'borrower')

          }, function (err) {
              $scope.showOtpFailMessage = true;
          })
      }

      $scope.showOtpInvalidMessage = false;

      $scope.VerifyOTPRegistration = function (otp, Invalid) {
          if (!$rootScope.user.MobilePhone) {
              $rootScope.user.MobilePhone = $rootScope.localUser.MobilePhone;
          }

          if (Invalid)
              $scope.showOtpInvalidMessage = true;
          else {
              $rootScope.user.otp = otp;
              var otpData = {
                  PhoneNumber: $rootScope.user.MobilePhone,
                  Otp: otp,
              }

              $scope.VerifyOtpAuthentication(otpData, 'Registraion');

          }

      }


      //---------------Validation------------

      $scope.showInvalidMessage = false;
      $scope.CheckMobileValidation = function () {
          $scope.ShowPhoneValidation = true;
      }

      function getApplication(personId) {
          if (personId) {
              loanAccountRepository.getDraftApplications(personId, function (loanApplications) {
                  console.log(loanApplications);
                  if (loanApplications)
                      $state.go('borrower.application.business_details', { productId: loanApplications.FKProductId, Id: loanApplications.LoanAccountId });
                  else
                      $state.go('borrower.dashboard.applications');
              })


          }
          else
              $state.go('borrower.dashboard.applications');

          //var noDraftApplicationExist = false;
          //var DraftApplicationExist = true;
          //if (loanApplications.length > 0) {
          //  for (var i in loanApplications) {
          //        if (loanApplications[i].Status == 'Draft') {
          //            $state.go('borrower.application.business_details', { productId: loanApplications[i].FKProductId, Id: loanApplications[i].LoanAccountId });
          //            DraftApplicationExist = false;
          //        }
          //        noDraftApplicationExist = DraftApplicationExist & true;
          //        //if (!DraftApplicationExist)
          //        //    break;
          //    }

          //    if (noDraftApplicationExist)
          //        $state.go('borrower.dashboard.applications');

          //  }
          //else
          //    $state.go('borrower.dashboard.applications');



      }

      $scope.userDoesNotExistError = false;
      function VerifyAccount(user, validitiy) {

          if (!validitiy) {
              console.log($rootScope.loginFrom);
              $scope.loginInProgress = true;
              //$rootScope.user.otp = otp;
              var autData = {
                  phone: user.MobilePhone,
                  password: user.Password
              }
              localStorage.setItem('$rootScope.user', JSON.stringify(autData));
              authTokenRepository.authenticateWithPhone(autData, function (success) {
                  console.log("Login response", success)
                  loginDetailRepository.getForLogin(parseInt(success.loginDetailId), user.MobilePhone, user.Password, function (loginDetailCallback) {
                      if (loginDetailCallback != null && loginDetailCallback.LoginDetailId > 0) {
                          $rootScope.loginDetailsForLoanWizard = loginDetailCallback;
                          $scope.loginInProgress = false;
                          $auth.loggedIn(loginDetailCallback);
                          localStorage.setItem('AuthData', success.access_token);
                          $('#myModal').modal('hide');

                          //Get Permission
                          permissionRepository.Get(function (permissions) {
                              $auth.setPermissions(permissions);
                              //window.location.href = CONSTANT.HOST + "/";


                              //$state.go('borrower.dashboard.applications');
                              $rootScope.isLoggedIn = true;
                              $rootScope.loggedInUser = $auth.getPayload();

                              if ($rootScope.loginFrom == 'applynow')
                                  $state.go('borrower.application.business_details', { productId: '', Id: '' });
                              else {

                                  getApplication($rootScope.loggedInUser.personId);
                              }
                          });
                      }
                      else {
                          $scope.loginInProgress = false;
                          $scope.IsValidated = false;
                      }
                  });
                  // if ($auth.getPayload().user_type == 'borrower')

              }, function (err) {
                  $scope.loginInProgress = false;
                  $scope.userDoesNotExistError = true;

              })



          }
          else {
              $scope.showInvalidMessage = true;
          }


      }
      $scope.applyNowHome = function (productId) {
          if ($rootScope.isLoggedIn)
              $state.go('borrower.application.business_details', { productId: productId });
          else
              $state.go('Login');
      }





      //-------------------USER LOGOUT----------------------
      function logout() {
          $auth.loggedOut();
          $rootScope.isLoggedIn = false;
          window.location.href = '/';
      }

      //------------------USER LOGIN-----------------------
      $scope.isMobileExists = true;
      function login(user) {
          if (user.MobilePhone == undefined) {
          }
          else {
              personRepository.CheckValidation(user.MobilePhone, user.Password, function (callback) {
                  console.log("Callback", callback)
                  if (callback) {
                      $rootScope.user = user;
                      sendOtp(user);
                  }
                  else {
                      $scope.isMobileExists = false;
                  }
              })

              //authTokenRepository.authenticateByMobile(user, function (success) {
              //    loginDetailRepository.GetById(success.loginDetailId, function (loginDetailCallback) {
              //        console.log("Success", loginDetailCallback)
              //        $auth.loggedIn(loginDetailCallback);
              //        localStorage.setItem('AuthData', success.access_token);
              //        toastr.info('You have successfully created a new account and have been signed-in');
              //        toastr.info('Successfully verify your FundsCorner account');
              //        $('#myModal').modal('hide');
              //        window.location.href = '#/borrower/dashboard/home';
              //        $rootScope.isLoggedIn = true;
              //        $rootScope.loggedInUser = $auth.getPayload();
              //    })


              //    // if ($auth.getPayload().user_type == 'borrower')

              //}, function (err) {
              //    toastr.error('Error while sign up. Please make sure if you are using correct otp.');
              //})
          }
      }

      // Event for open login modal
      $('#myModal').on('hidden.bs.modal', function (e) {
          $scope.$watch('validateLogin', function (form) {
              if (form) {
                  form.$setValidity();
                  form.$setPristine(true);
              }
          });
          $scope.$watch('validateRegister', function (form) {
              if (form) {
                  form.$setValidity();
                  form.$setPristine(true);
                  $scope.isEmailExists = false;
                  $scope.isMobileExistsForRegistration = false;
                  $scope.PasswordMatch = true;
              }
          });
          $rootScope.Newuser = {
              Name: '',
              EmailId: '',
              MobilePhone: '',
              Password: '',
              ConfPassword: '',
              dnd_accepted: '',
              term_accepted: '',
          };


          $rootScope.localUser = {
              MobilePhone: '',
              Password: '',
          };
          // $scope.user = {};
      });

      //Notification List Stop Propagation
      $(document).on('click', '.dropdown-menu', function (e) {
          e.stopPropagation();
      });

      $scope.HideNotification = function (id) {
          notificationRepository.HideById(id, function (callback) {
              getNotifications();
          })
      }

      //------------------SOCIAL LOGIN-----------------------
      function socialAuthentication(provider) {
          $auth.authenticate(provider)
            .then(function (response) {
                toastr.success('You have successfully signed in!');
                console.log('response', response);
                $('#myModal').modal('hide');
                if ($auth.getPayload().user_type == 'borrower')
                    window.location.href = '/borrower/dashboard/home';
                if ($auth.getPayload().user_type == 'operator' || $auth.getPayload().user_type == 'KC manager')
                    window.location.href = '/operator/applications';
                if ($auth.getPayload().user_type == 'super admin')
                    window.location.href = '/super-admin/products';
                if ($auth.getPayload().user_type == 'lender')
                    window.location.href = '/lender/dashboard';

            })
            .catch(function (error) {
                toastr.error(error.data.message, error.status);
            });
      }
      $rootScope.From = "";
      // function when click on login
      function openLogin(from) {
          console.log(from);
          $rootScope.loginFrom = from;
          $rootScope.hideHeader = true;
          $rootScope.hideFooter = true;
          $scope.IsValidated = true;
          $rootScope.localUser = {
              MobilePhone: '',
              Password: '',
          };

          $state.go('Login');

      }


      // function when click on apply
      function openRegisterModal() {
          $rootScope.Newuser = {
              Name: '',
              EmailId: '',
              MobilePhone: '',
              Password: '',
              ConfPassword: '',
              dnd_accepted: '',
              term_accepted: '',
          };
          $rootScope.registerModal = false;
          $rootScope.loginModal = true;
          $('#myModal').modal('show');
      }



      // switch to register
      function switchToRegister() {

          $rootScope.hideHeader = true;
          $rootScope.hideFooter = true;
          $state.go('Registarion');
      }

      // switch to login
      function switchToLogin() {

          $rootScope.hideHeader = true;
          $rootScope.hideFooter = true;
          $state.go('Login');
      }

      // register form validation
      function checkMobile(mobile) {
          if (ValidatePhone(mobile) == false) {
              $scope.invalidPhone = true;
          }
          else {
              $scope.invalidPhone = false;
          }
      }

      $scope.OpenTermOfUse = function () {
          $('#terms-modal').modal('show');
      }

      $scope.OpenPrivacyPolicy = function () {
          $('#privacy-modal').modal('show');
      }

      $scope.CloseTermOfUse = function () {
          $('#myModal').modal('show');
          $('#terms-modal').modal('hide');
      }

      $scope.ClosePrivacyPolicy = function () {
          $('#myModal').modal('show');
          $('#privacy-modal').modal('hide');
      }

      function checkEmail(email) {
          if (ValidateEmail(email) == false) {
              $scope.invalidEmail = true;
          }
          else {
              $scope.invalidEmail = false;
          }
      }

      //------------------Forget Pin-----------------------

      /*forgot pin modal*/
      function pinForgot() {
          $('#myModal').modal('hide');
          $rootScope.forgetModal = true;
          $('#forgotModal input').val("");
          $('#forgotModal').modal('show')
          $scope.mobile = "";
      }

      $scope.showMobileInvalidMessage = false;
      function IsMobileExist(mobile, source) {
          $rootScope.user = {};
          $rootScope.user.phone = mobile;
          $scope.password = "";
          $scope.confirm_password = "";
          $scope.otp = "";

          personRepository.IsPhoneExists($rootScope.user.phone, function (response) {
              console.log('response', response);
              if (response) {
                  if (source == 'fromForgotPass') {
                      checkMobileExistOnLoginDetail(mobile, source);
                      $('#forgotModal').modal('hide');
                      $rootScope.forgetOtpModal = true;
                      //$('#verifyForgetOtpModal').modal('show');
                  }
                  else
                      if (source == 'fromLogin') {
                          checkMobileExistOnLoginDetail(mobile, source);
                      }
              }
              else {
                  $scope.showMobileInvalidMessage = true;
                  return '';
              }
          }, function (error) {
              $scope.showMobileInvalidMessage = true;
          });
      }

      $scope.sendOtpNewUser = function (mobileno) {
          $scope.showOtpFailMessage = false;

          if ((typeof (mobileno) == "undefined") || (mobileno == "")) {
              mobileno = $rootScope.localUser.MobilePhone || $rootScope.Newuser.MobilePhone;
          }
          $rootScope.userMobileNumber = mobileno;
          otpRepository.GetForMobileNumber(mobileno, function (callback) {
              $scope.user.username = callback.UserName;
              $rootScope.user.phone = mobileno;
              if (callback.Message == "Success") {
                  $('#forgotModal').modal('hide');
                  $timeout(function () {
                      $rootScope.forgetOtpModal = true;
                      $('#verifyModal input').val("");
                      $('#verifyModal').modal('show');
                  }, 200);
                  $scope.showOtpSuccesMessage = true;
                  $timeout(function () {
                      $scope.showOtpSuccesMessage = false;
                  }, 10000);
              }
              else {
                  $scope.showMobileInvalidMessage = true;
              }
          });
      }
      //-----------OTP Model-------------------
      $scope.showOtpInvalidMessage = false;
      function VerifyOTP(otp, Invalid) {
          $rootScope.RoleIdIsNotAvailable = false;
          if (!$rootScope.user.MobilePhone) {
              $rootScope.user.MobilePhone = $rootScope.localUser.MobilePhone;
          }

          if (Invalid)
              $scope.showOtpInvalidMessage = true;
          else {
              $rootScope.user.otp = otp;
              var otpData = {
                  PhoneNumber: $rootScope.user.MobilePhone,
                  Otp: otp,
              }

              if ($rootScope.loginDetailsNotAvailable) {
                  otpRepository.VerifyOTPCode(otpData.Otp, otpData.PhoneNumber, function (callback) {
                      if (callback.Message == 'Success') {
                          $('#verifyModal').modal('hide');
                          $('#verifyForgetOtpModal input').val("");
                          $('#verifyForgetOtpModal').modal('show');

                      }

                  })
              }
              else
                  $scope.VerifyOtpAuthentication(otpData, 'login');
          }
      }

      function checkMobileExistOnLoginDetail(mobileno, source) {
          $rootScope.loginMobileExist = false;
          if ((typeof (mobileno) == "undefined") || (mobileno == "")) {
              mobileno = $rootScope.user.phone;
          }
          loginDetailRepository.GetLoginDetailIdByMobile(mobileno, function (id) {
              if (id > 0) {
                  if (source == 'fromForgotPass') {
                      $rootScope.user.loginId = id;
                      $scope.sendOtpNewUser(mobileno);
                  }
                  else
                      if (source == 'fromLogin') {
                          $rootScope.loginMobileExist = true;
                      }
              }
              else {
                  if (source == 'fromForgotPass') {
                      $scope.showMobileInvalidMessage = true;
                  }
                  else
                      if (source == 'fromLogin') {
                          $rootScope.loginDetailsNotAvailable = true;
                          $scope.sendOtpNewUser(mobileno);
                      }
              }
          })
      }
      $scope.passwordChanged = false;

      // function for verify forget account
      $scope.updateLoginDetails = function (loginDetailId, password) {
          loginDetailRepository.UpdatePasswordById(loginDetailId, password, function (callback) {
              if (callback == true) {
                  $scope.passwordChanged = true;

                  //toastr.info('You have successfully changed your password');
                  //$('#verifyForgetOtpModal').modal('hide');
                  $timeout(function () {
                      $scope.passwordChanged = false;
                      $('#verifyForgetOtpModal').modal('hide');
                      $('#verifyForgetOtpModal input').val("");
                      $rootScope.loginMobileExist = true;
                  }, 1000);
              }
              else {
                  toastr.error('error in signup');
              }
          })
      }




      function confirmPassword() {
          window.location.href = '/borrower/dashboard';
      }

      function hideNotification(id, index) {
          $http.put(CONSTANT.HOST + 'notifications', { id: id, data: { display: false } })
            .then(function (response) {
                toastr.success('Successfully removed!');
                $scope.notifications.splice(index, 1);
                $scope.countUneenNotifications = 0;
                for (var i in $scope.notifications) {
                    if ($scope.notifications[i].seen == false && $scope.notifications[i].display == true) {
                        $scope.countUneenNotifications++;
                    }
                }
            })
            .catch(function (response) {
                toastr.error('error in signup');
            });
      }

      function visitActionLink(id, index) {
          $http.put(CONSTANT.HOST + 'notifications', { id: id, data: { seen: true } })
            .then(function (response) {
                $scope.notifications[index].seen = true;
                $scope.countUneenNotifications = 0;
                for (var i in $scope.notifications) {
                    if ($scope.notifications[i].seen == false && $scope.notifications[i].display == true) {
                        $scope.countUneenNotifications++;
                    }
                }
                $location.path($scope.notifications[index].action_link);
            })
            .catch(function (response) {
                toastr.error('error in signup');
            });
      }


      $('.notificationDropdown .dropdown-menu').click(function (e) {
          e.stopPropagation();
      });

      function closeNotificationDropdown() {
          $('.notificationDropdown').removeClass(('open'));
      }

      //Checking if Mobile exist on LoginDetails or Not
      //then check on Person details
      //If it exist on Login details then show password field
      //If don't exist on login details nad exist on person table than send a otp and show verify otp screen and after verify otp show change password model
      //After changing password show password field
      $scope.MobileValidationOnLogin = function (MobileNumber, source) {

          $rootScope.loginMobileExist = false;
          loginDetailRepository.MobileValidation(MobileNumber, function (callback) {
              console.log("Mobile Varification Response", callback);
              $scope.mobileVarificationResponse = callback;
              if (callback.Message == "Registered User") {
                  $rootScope.loginMobileExist = true;
              }
              else
                  if (callback.Message == "Person Detail Available") {
                      $scope.sentOtpToPersonDetailUser(MobileNumber);
                  }
                  else
                      $scope.showMobileInvalidMessage = true;
          })
      }

      //Send Otp To The User And Open the Verify Otp Model 
      $scope.sentOtpToPersonDetailUser = function (mobileNumber) {
          $scope.showOtpFailMessage = false;
          otpRepository.GetForMobileNumber(mobileNumber, function (callback) {
              if (callback.Message == "Success") {
                  $('#verifyModal input').val("");
                  $('#verifyModal').modal('show');
                  $scope.showOtpSuccesMessage = true;
                  $timeout(function () {
                      $scope.showOtpSuccesMessage = false;
                  }, 10000);
              }
          });
      }


      //Verify Otp: And Open Change Password Model
      $scope.showOtpInvalidMessage = false;
      $scope.VerifyOTPAndOpenChangePasswordModel = function (mobileNo, otp, Invalid) {
          var otpdata = {
              PhoneNumber: mobileNo,
              Otp: otp
          }
          $rootScope.RoleIdIsNotAvailable = false;
          if (Invalid)
              $scope.showOtpInvalidMessage = true;
          else {
              //authTokenRepository.authenticateByOtp(otpdata, function (callback) {
              //    console.log("VerifyOTPAndOpenChangePasswordModel", success)     
              otpRepository.VerifyOTPCode(otp, mobileNo, function (callback) {
                  if (callback.Message == 'Success') {
                      $('#verifyModal').modal('hide');
                      $('#verifyForgetOtpModal input').val("");
                      $('#verifyForgetOtpModal').modal('show');
                  }
                  else {
                      $scope.showOtpFailMessage = true;
                  }
              })
              //}, function (err) {
              //    $scope.showOtpFailMessage = true;
              //})
          }

      }

      //CHnage Password if loginIdavailable
      //else create new user with new password
      //function VerifyForgetAccount(MobilePhone, password, confirm_password) {
      //    if (password == confirm_password) {
      //        if ($scope.mobileVarificationResponse.Message == "Person Detail Available") {
      //            $scope.createLoginDetail(MobilePhone, password);
      //        }
      //        else
      //            if ($scope.mobileVarificationResponse.Message == "Registered User") {
      //                $scope.updateLoginDetails($scope.mobileVarificationResponse.LoginDetailId, password);
      //            }
      //    }
      //    else {
      //        $scope.PasswordMatch = false;
      //        return '';
      //    }

      //}

      //Update LoginDetail with new password
      function VerifyForgetAccount(MobilePhone, password, confirm_password) {
          if (password == confirm_password) {
              loginDetailRepository.MobileValidation(MobilePhone, function (callback1) {
                  console.log("mobileVarificationResponse", callback1);
                  if (callback1 != null && callback1.LoginDetailId > 0) {
                      $scope.mobileVarificationResponse = callback1;
                      $scope.updateLoginDetails($scope.mobileVarificationResponse.LoginDetailId, password);
                  }
                  else
                      toastr.error('error in signup');
              }), function (err) {
                  $scope.showOtpFailMessage = true;;
              }
          }
          else {
              $scope.PasswordMatch = false;
              return '';
          }

      }
      //Create Login Detail if person detail Exist
      $scope.createLoginDetail = function (mobileno, password) {
          $rootScope.RoleIdIsNotAvailable = false;
          $rootScope.loginMobileExist = false;
          personRepository.getPersonByMobile(mobileno, password, function (personCallback) {
              $rootScope.personDetail = personCallback;
              console.log(personCallback);
              if (personCallback.FKLoginDetailId) {
                  $rootScope.loginMobileExist = true;
                  $('#verifyForgetOtpModal').modal('hide');
              }
              else
                  alert("Login Credentials Not Available.Contact FundsCorner");
          })
      }
  });
