'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:LenderProductCtrl
 * @description
 * # LenderProductCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('LenderProductCtrl', function ($http, CONSTANT, $scope, $state, toastr, CommonService) {

    if($state.params.lenderId) {
      CommonService.getOptions('application', function (data) {
        $scope.entityTypeOptions = JSON.parse(data.constitution);
      });
      //get all lender products
      $scope.getLenderProducts = function () {
        $http.get(CONSTANT.HOST + 'lenderProducts' + '/' + $state.params.lenderId)
          .success(function (data, status, headers, config) {
            $scope.lenderProducts = data;

            for(var i=0; i< $scope.lenderProducts.length; i++){
              $scope.lenderProducts[i].eligible_entities = $scope.lenderProducts[i].eligible_entities.split(',');
              for(var j=0; j<$scope.lenderProducts[i].grade_metrics.length; j++){
                if($scope.lenderProducts[i].grade_metrics[j].grade == 'A'){
                  $scope.lenderProducts[i].A = $scope.lenderProducts[i].grade_metrics[j];
                }
                if($scope.lenderProducts[i].grade_metrics[j].grade == 'B'){
                  $scope.lenderProducts[i].B = $scope.lenderProducts[i].grade_metrics[j];
                }
                if($scope.lenderProducts[i].grade_metrics[j].grade == 'C'){
                  $scope.lenderProducts[i].C = $scope.lenderProducts[i].grade_metrics[j];
                }
                if($scope.lenderProducts[i].grade_metrics[j].grade == 'D'){
                  $scope.lenderProducts[i].D = $scope.lenderProducts[i].grade_metrics[j];
                }
              }
            }
            console.log('$scope.lenderProducts', $scope.lenderProducts);
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      };
      // call api for getting lender products
      $scope.getLenderProducts();

      //open delete lender modal
      $scope.openLenderProductDeleteModal = function(lenderProductId, index) {
        $("#deleteLenderProduct").modal('show');
        $scope.lenderProductId = lenderProductId;
        $scope.lenderProductIndex = index;
      }

      //delete lender product
      $scope.deleteLenderProduct = function(lenderProductId,index){
        $http.delete(CONSTANT.HOST + 'lenderProducts/' + lenderProductId)
          .success(function (data, status, headers, config) {
            $scope.lenderProducts.splice(index, 1);
            $('#deleteLenderProduct').modal('hide');
            toastr.success('Successfully deleted!');
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      }

      //open save lender modal
      $scope.openLenderProductEditModal = function(lenderProduct, index){
        $("#addLenderProduct").modal('show');
        $scope.lenderProductModal = lenderProduct;
      }

      //add lender product
      $scope.addLenderProduct = function(lenderProduct) {
        lenderProduct.eligible_entities = lenderProduct.eligible_entities.join();
        lenderProduct.userId = $state.params.lenderId;
        $http.post(CONSTANT.HOST + 'lenderProducts', {lenderProduct: lenderProduct})
          .success(function (data, status, headers, config) {
            $scope.getLenderProducts();
            $("#addLenderProduct").modal('hide');
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      }
    }

   /* $scope.hideSelect2Dropdown = function(){
      console.log('f');
      $(".select2-drop-active").css("display","none");
    }
    $(".select2-input").click(function(){
      console.log('g');
      $(".select2-drop-active").css("display","block");
    })*/

  });
