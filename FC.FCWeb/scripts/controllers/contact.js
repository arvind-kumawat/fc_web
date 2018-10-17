'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('ContactCtrl', function ($auth, $location, toastr, $scope, $state, $rootScope, $timeout, $http, CONSTANT, CommonService) {

      //STATIC MODELS
      $scope.Products = [
          {
              id: 1,
              name: 'Online Merchant Loan'
          },
          {
              id: 1,
              name: 'POS/Wallet Merchant Loan'
          },
          {
              id: 1,
              name: 'Purchase Order Loan'
          },
      ]
      $scope.MailSent = false;

      // METHOD DECLARATION
      $scope.submit = submit;

      function submit() {
          CommonService.sendMail($scope.Info, function (data) {
              $scope.Info = {}
              $scope.MailSent = true;
              $timeout(function () {
                  $scope.MailSent = false;
              }, 2500);
          })
      }

      $scope.init = function () {
          var locations = [
              [
                  "Art District XIII, Lado Sarai, New Delhi, Delhi", 28.523378, 77.194676, 2
              ],
              [
                  "1-8-526, Jatkar Bhavan Chikkadpally, Hyderabad, Telangana", 17.403168, 78.495321, 1
              ]
          ]
          var map = new google.maps.Map(document.getElementById('map'), {
              zoom: 4, 
              center: new google.maps.LatLng(17.403168, 78.495321),
              mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          var infowindow = new google.maps.InfoWindow();

          var marker, i;

          for (i = 0; i < locations.length; i++) {
              marker = new google.maps.Marker({
                  position: new google.maps.LatLng(locations[i][1], locations[i][2]),
                  map: map
              });

              google.maps.event.addListener(marker, 'click', (function (marker, i) {
                  return function () {
                      infowindow.setContent(locations[i][0]);
                      infowindow.open(map, marker);
                  }
              })(marker, i));
          }
      }

      $scope.init();

  });
