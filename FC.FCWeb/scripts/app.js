'use strict';

/**
 * @ngdoc overview
 * @name craditKartApp
 * @description
 * # craditKartApp
 *
 * Main module of the application.
 */
var app = angular
  .module('craditKartApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ui.router',
    'ui.bootstrap',
    'toastr',
    'slickCarousel',
    '720kb.datepicker',
    'ngFileUpload',
    'datatables',
    'datatables.buttons',
    'datatables.columnfilter',
    'ui.select2',
    'fsm',
    'angular-loading-bar',
    'ngDroplet'

  ]).constant('LOCAL_STORAGE', {
      AccountId: 'AccountId',
      UserName: 'UserName',
      ProductId: 'ProductId',
      LoanId: 'LoanId',
      Logins: 'Logins',
      TaskId: 'TaskId',
      LoginDetailId: 'LoginDetailId',
      RoleId: 'RoleId',
      AUTHENTICATION: 'AUTHENTICATION',
  }).config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
      $httpProvider.interceptors.push('authInterceptorService');
  })
    .config(['$provide', function ($provide) {
        // Set a suffix outside the decorator function 
        var cacheBuster = Date.now().toString();
        function templateFactoryDecorator($delegate) {
            var fromUrl = angular.bind($delegate, $delegate.fromUrl);
            $delegate.fromUrl = function (url, params) {
                if (url !== null && angular.isDefined(url) && angular.isString(url)) {
                    url += (url.indexOf("?") === -1 ? "?" : "&");
                    url += "v=" + cacheBuster;
                }
                return fromUrl(url, params);
            };
            return $delegate;
        }
        $provide.decorator('$templateFactory', ['$delegate', templateFactoryDecorator]);
    }])
    .constant('APPLICATION_EVENTS', {
        LOGGED_IN: 'LOGGED_IN',
        LOANWIZARD_SAVE_STEP: 'LOANWIZARD_SAVE_STEP',
        LOANWIZARD_SAVE_STEP_AND_NEXT: 'LOANWIZARD_SAVE_STEP_AND_NEXT',
        PER_CHANGE: 'PER_CHANGE',
        DASHBOARD_LOAD: 'DASHBOARD_LOAD',
        PAN_CARD_VERIFIED: 'PAN_CARD_VERIFIED'
    })
  .run(function ($rootScope, toastr, $state, $timeout, $auth) {
     
      $('body').addClass('display-none');
      //set default title of website
      document.title = 'FundsCorner- Small Business Loans made Simpler';
      //scroll top 0px when go to new page
      $rootScope.$on('$stateChangeSuccess', function () {
          
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          $('#js-navbar-collapse').removeClass('in');
          $('body').removeClass('display-none');

      })

      
      

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
          $rootScope.hideHeader = true;
          $rootScope.hideFooter = true;
      });


      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams) {
          $rootScope.hideHeader = true;
          $rootScope.hideFooter = true;
          if (toState.name == "Login" || toState.name == "Registarion") {
              $rootScope.hideHeader = true;
              $rootScope.hideFooter = true;

          }
          else {

              $rootScope.hideHeader = false;
              $rootScope.hideFooter = false;
          }

          /*************** Fix Footer Position  ***************/
          //setTimeout(function () {
              
          //  fFooter();
          //}, 10000)
             


          /*************** Fix Footer Position / **************/

          //set title
          if (toState.title) {
              document.title = toState.title;
          }
          if (toState.data) {
              var isAuthenticate = toState.data.authenticate;
              if (isAuthenticate == true) {
                  var authorizeGroup = toState.data.authorize.user_type;
                  if (!$auth.isAuthenticated()) {
                      event.preventDefault();
                      $state.transitionTo('home');
                      $timeout(function () {
                          $('#myModal').modal('show');
                      }, 100);
                  } else {
                      var currentUserRole = $auth.getPayload();
                  }
              }

              else if (isAuthenticate == false) {
                  if ($auth.isAuthenticated()) {
                      toastr.error('You are already logged in');
                      event.preventDefault();
                      $state.transitionTo('home');
                  }
                  else {

                  }
              }

              if (toState.data.hideHeader && !$auth.isAuthenticated()) {
                  $rootScope.hideHeader = true;
              }
              else {
                  $rootScope.hideHeader = false;
              }
              if (toState.data.hideFooter && !$auth.isAuthenticated()) {
                  $rootScope.hideFooter = true;
              }
              else {
                  $rootScope.hideFooter = false;
              }
          }
      });

     
      // some settings for scroll to top icon
      var offset = 400;
      var duration = 300;
      $(window).scroll(function () {
          if ($(this).scrollTop() > offset) {
              $(".back-to-top").fadeIn(duration);
          } else {
              $(".back-to-top").fadeOut(duration);
          }
      });
      $(".back-to-top").click(function (event) {
          event.preventDefault();
          $("html, body").animate({ scrollTop: 0 }, duration);
          return false;
      })
  }).directive('fileModel', ['$parse', function ($parse) {
      return {
          restrict: 'A',
          link: function (scope, element, attrs) {
              var model = $parse(attrs.fileModel);
              var modelSetter = model.assign;
              //alert(modelSetter);;
              element.bind('change', function () {
                  scope.$apply(function () {
                      // alert(JSON.stringify(element[0].files[0]));
                      //alert(modelSetter); 
                      modelSetter(scope, element[0].files);
                      //scope[attrs.fileModel] = element[0].files;
                  });
              });
          }
      };
  }])
.filter('for', function () {
    return function (object, docTypeId) {
        var array = [];
        angular.forEach(object, function (category) {
            if (category.FKDocumentTypeId == docTypeId)
                array.push(category);
        });
        return array;
    };
});
app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 100;
}]);

//call if enter press
app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});