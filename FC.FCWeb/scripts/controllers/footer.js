'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('FooterCtrl', function ($auth, $location, toastr, $scope, $state, $rootScope, $timeout, $http, CONSTANT) {

      // METHOD DECLARATION
      $scope.openTermsModal = openTermsModal;
      $scope.openPrivacyModal = openPrivacyModal;
      $scope.scrollToTop = scrollToTop;
      $scope.goToOurProcess = goToOurProcess;

      function goToOurProcess() {
          $location.hash('');
          $location.path("/home#ourProcess");
      }

      function scrollToTop() {
          $('html,body').animate({
              scrollTop: $(".navbar").offset().top
          }, 'slow');
      }
      
      function openTermsModal() {
          $('#terms-modal').modal('show');
      }

      function openPrivacyModal() {
          $('#privacy-modal').modal('show');
      }
  });
