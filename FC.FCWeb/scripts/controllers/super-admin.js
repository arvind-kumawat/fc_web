'use strict';

/**
 * @ngdoc function
 * @name craditKartApp.controller:SuperAdminCtrl
 * @description
 * # SuperAdminCtrl
 * Controller of the craditKartApp
 */
angular.module('craditKartApp')
  .controller('SuperAdminCtrl', function ($http, CONSTANT, $scope, $state, toastr,$location, CommonService) {

    // VARIABLE DECLARATION / INITIALIZATION
    $scope.products = [];
    $scope.scoreTypes = [];
    $scope.segment_scores = [];

    // FUNCTION DECLARATION
    $scope.getAllProducts = getAllProducts;
    $scope.getProductsById = getProductsById;
    $scope.submitProducts = submitProducts;
    $scope.addProducts = addProducts;
    $scope.openDeleteModal = openDeleteModal;
    $scope.deleteProduct = deleteProduct;
    $scope.addScoreTypes = addScoreTypes;
    $scope.submitScoreTypes = submitScoreTypes;
    $scope.openDeleteModalForScoretype = openDeleteModalForScoretype;
    $scope.deleteScoretype = deleteScoretype;
    $scope.addScoreSubTypes = addScoreSubTypes;
    $scope.resetAccordianData = resetAccordianData;
    $scope.submitScoreSubTypes = submitScoreSubTypes;
    $scope.openDeleteModalForScoreSubtype = openDeleteModalForScoreSubtype;
    $scope.deleteScoreSubtype = deleteScoreSubtype;
    $scope.getSegmentScoreById = getSegmentScoreById;
    $scope.calculateMainScore = calculateMainScore;
    $scope.calculateSubMainScore = calculateSubMainScore;

    // function for get all products
    function getAllProducts() {
      $http.get(CONSTANT.HOST + 'products')
        .success(function (data, status, headers, config) {
          if (data.length > 0)
            $scope.products = data;
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    //call the function
    getAllProducts();

    function getProductsById(calculatorId) {
      $http.get(CONSTANT.HOST + 'products/' + calculatorId)
        .success(function (data, status, headers, config) {
          if (data.length > 0)
            $scope.scoreTypes = data[0].main_scores;
          calculateMainScore();
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    if ($state.params.calculatorId) {
      getProductsById($state.params.calculatorId);
    }

    /*--------------------------------PRODUCT SECTION-----------------------------------------------------*/
    //submit products
    function submitProducts(formData, index) {
      $http.post(CONSTANT.HOST + 'products', {data: formData})
        .success(function (data, status, headers, config) {
          getAllProducts();
          $scope.products[index].editMode = !$scope.products[index].editMode;
          toastr.success('Successfully saved!');
          window.scrollTo(0, 0);
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    //add  products
    function addProducts() {
      $scope.products.push({name: '', type: '', loan_type: '', editMode: true})
    }

    //open delete modal
    function openDeleteModal(index, product_id) {
      if (product_id) {
        $scope.productIndex = index;
        $scope.calculatorId = product_id;
        $("#deleteProduct").modal('show');
      }
      else {
        $scope.products.splice(index, 1);
      }
    }

    //delete product
    function deleteProduct(index, product_id) {
      $http.delete(CONSTANT.HOST + 'products/' + product_id)
        .success(function (data, status, headers, config) {
          $scope.products.splice(index, 1);
          toastr.success('Successfully deleted!');
          $scope.productIndex = '';
          $scope.calculatorId = '';
          $("#deleteProduct").modal('hide');
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    /*--------------------------------SCORE TYPE SECTION-----------------------------------------------------*/
    //function for add score type
    function addScoreTypes() {
      $scope.scoreTypes.push({
        name: '',
        score: '',
        editMode: true,
        sub_main_scores: [{name: '', score: '', editMode: true}]
      });
      for (var i in $scope.scoreTypes) {
        $scope.scoreTypes[i].editMode = true;
      }
    }

    //function for submit score values
    function submitScoreTypes(formData, index) {
      var checkScoreTypeTotal = 0;
      for (var i = 0; i < $scope.scoreTypes.length; i++) {
        checkScoreTypeTotal = checkScoreTypeTotal + $scope.scoreTypes[i].score;
      }
      if (checkScoreTypeTotal > 100) {
        toastr.error('Total score can not be more than 100!');
        return;
      }
      formData.productId = $state.params.calculatorId;
      $http.post(CONSTANT.HOST + 'mainScores', {data: formData})
        .success(function (data, status, headers, config) {
          if (!formData.id) {
            getProductsById($state.params.calculatorId);
          }
          $scope.scoreTypes[index].editMode = !$scope.scoreTypes[index].editMode;
          calculateMainScore();
          toastr.success('Successfully saved!');
          window.scrollTo(0, 0);
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    //open delete modal
    function openDeleteModalForScoretype(index, scoreTypeId) {
      if (scoreTypeId) {
        $scope.scoreTypeIndex = index;
        $scope.scoreTypeId = scoreTypeId;
        $("#deleteScoreType").modal('show');
      }
      else {
        $scope.scoreTypes.splice(index, 1);
      }
    }

    //delete subtype
    function deleteScoretype(index, scoreTypeId) {
      $http.delete(CONSTANT.HOST + 'mainScores/' + scoreTypeId)
        .success(function (data, status, headers, config) {
          $scope.scoreTypes.splice(index, 1);
          toastr.success('Successfully deleted!');
          $scope.scoreTypeIndex = '';
          $scope.scoreTypeId = '';
          $("#deleteScoreType").modal('hide');
          calculateMainScore();
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    /*--------------------------------SCORE SUB TYPE SECTION-----------------------------------------------------*/
    function addScoreSubTypes(index) {
      $scope.scoreTypes[index].sub_main_scores.push({name: '', score: '', editMode: true});
      for (var i in $scope.scoreTypes[index].sub_main_scores) {
        $scope.scoreTypes[index].sub_main_scores[i].editMode = true;
      }
    }

    function resetAccordianData(index) {
      calculateSubMainScore(index);
      for (var i in $scope.scoreTypes[index].sub_main_scores) {
        $scope.scoreTypes[index].sub_main_scores[i].editMode = false;
        if (!$scope.scoreTypes[index].sub_main_scores[i].id) {
          $scope.scoreTypes[index].sub_main_scores.pop();
        }
      }
    }

    //function for submit score values
    function submitScoreSubTypes(formData, index, parentIndex, mainScoreId) {
      var checkScoreSubTypeTotal = 0;
      for (var i = 0; i < $scope.scoreTypes[parentIndex].sub_main_scores.length; i++) {
        checkScoreSubTypeTotal = checkScoreSubTypeTotal + $scope.scoreTypes[parentIndex].sub_main_scores[i].score;
      }
      if (checkScoreSubTypeTotal > 100) {
        toastr.error('Total score can not be more than 100!');
        return;
      }

      formData.mainScoreId = mainScoreId;
      $http.post(CONSTANT.HOST + 'subMainScores', {data: formData})
        .success(function (data, status, headers, config) {
          if (!formData.id) {
            for (var i in $scope.scoreTypes[parentIndex].sub_main_scores) {
              $scope.scoreTypes[parentIndex].sub_main_scores[i].editMode = false;
              $scope.scoreTypes[parentIndex].sub_main_scores[index].editMode = false;
              if (!$scope.scoreTypes[parentIndex].sub_main_scores[i].id && !$scope.scoreTypes[parentIndex].sub_main_scores[index]) {
                $scope.scoreTypes[parentIndex].sub_main_scores.pop();
              }
            }
          }
          $scope.scoreTypes[parentIndex].sub_main_scores[index].editMode = !$scope.scoreTypes[parentIndex].sub_main_scores[index].editMode;
          toastr.success('Successfully saved!');
          window.scrollTo(0, 0);
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    //open delete modal
    function openDeleteModalForScoreSubtype(index, scoreSubTypeId, parentIndex) {
      if (scoreSubTypeId) {
        $scope.scoreSubTypeIndex = index;
        $scope.scoreSubTypeId = scoreSubTypeId;
        $scope.scoreSubTypeParentIndex = parentIndex;
        $("#deleteScoreSubType").modal('show');
      }
      else {
        $scope.scoreTypes[parentIndex].sub_main_scores.splice(index, 1);
      }
    }

    //delete subtype
    function deleteScoreSubtype(index, scoreTypeId, parentIndex) {
      $http.delete(CONSTANT.HOST + 'subMainScores/' + scoreTypeId)
        .success(function (data, status, headers, config) {
          $scope.scoreTypes[parentIndex].sub_main_scores.splice(index, 1);
          toastr.success('Successfully deleted!');
          $scope.scoreSubTypeIndex = '';
          $scope.scoreSubTypeParentIndex = '';
          $scope.scoreSubTypeId = '';
          $("#deleteScoreSubType").modal('hide');
          calculateSubMainScore(parentIndex);
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    /*--------------------------------SEGMENT SCORE TYPE SECTION-----------------------------------------------------*/
    function getSegmentScoreById(id) {
      $http.get(CONSTANT.HOST + 'segmentScores/' + id)
        .success(function (data, status, headers, config) {
          if (data.length > 0)
            $scope.segment_scores = data;
        })
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }

    if ($state.params.subTypeId) {
      getSegmentScoreById($state.params.subTypeId);

      //add segment score row
      $scope.addSegmentScore = function () {
        $scope.segment_scores.push({
          key: '',
          condition: '',
          editMode: true,
          value: '',
          conditional_score: '',
          calculated: false,
          calculation_formula: ''
        });
      };

      //function for submit score values
      $scope.submitSegmentScore = function submitSegmentScore(formData, index) {
        formData.subMainScoreId = $state.params.subTypeId;
        $http.post(CONSTANT.HOST + 'segmentScores', {data: formData})
          .success(function (data, status, headers, config) {
            getSegmentScoreById($state.params.subTypeId);
            $scope.segment_scores[index].editMode = !$scope.segment_scores[index].editMode;
            toastr.success('Successfully saved!');
            window.scrollTo(0, 0);
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      };

      //open delete modal
      $scope.openDeleteModalForSegmentScore = function (index, segmentScoreId) {
        if (segmentScoreId) {
          $scope.segmentScoreIndex = index;
          $scope.segmentScoreId = segmentScoreId;
          $("#deleteSegmentScore").modal('show');
        }
        else {
          $scope.segment_scores.splice(index, 1);
        }
      };

      //delete subtype
      $scope.deleteSegmentScore = function (index, segmentScoreId) {
        $http.delete(CONSTANT.HOST + 'segmentScores/' + segmentScoreId)
          .success(function (data, status, headers, config) {
            $scope.segment_scores.splice(index, 1);
            toastr.success('Successfully deleted!');
            $scope.segmentScoreIndex = '';
            $scope.segmentScoreId = '';
            $("#deleteSegmentScore").modal('hide');
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      };
    }

    function calculateMainScore() {
      $scope.showMainScoreWarning = false;
      var checkScoreTypeTotal = 0;
      for (var i = 0; i < $scope.scoreTypes.length; i++) {
        checkScoreTypeTotal = checkScoreTypeTotal + $scope.scoreTypes[i].score;
      }
      $scope.totalMainScore = checkScoreTypeTotal;
      if (checkScoreTypeTotal != 100) {
        $scope.showMainScoreWarning = true;
      }
    }

    function calculateSubMainScore(parentIndex) {
      $scope.showSubMainScoreWarning = false;
      var checkScoreSubTypeTotal = 0;
      for (var i = 0; i < $scope.scoreTypes[parentIndex].sub_main_scores.length; i++) {
        checkScoreSubTypeTotal = checkScoreSubTypeTotal + $scope.scoreTypes[parentIndex].sub_main_scores[i].score;
      }
      $scope.totalSubMainScore = checkScoreSubTypeTotal;
      if (checkScoreSubTypeTotal != 100) {
        $scope.showSubMainScoreWarning = true;
      }

    }

    /*------------------------------------LENDER SECTION---------------------------------------------------------*/
    if($location.path() == '/super-admin/lenders') {
      $scope.lenderPerPage = 5;
      $scope.currentPage = 1;
      //get all lenders
      $scope.getLenders = function(currentPage) {
        $http.get(CONSTANT.HOST + 'lenders/' + currentPage + '/' + $scope.lenderPerPage)
          .success(function (data, status, headers, config) {
            $scope.lenders = data;
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      };
      // call lenders api for getting lenders for first page
      $scope.getLenders(1);

      // open delete lender modal
      $scope.openLenderDeleteModal = function(lenderId, index){
        $('#deleteLender').modal('show');
        $scope.lenderId = lenderId;
        $scope.lenderIndex = index;
      };

      // function for delete lender
      $scope.deleteLender = function(lenderId, index) {
        $http.delete(CONSTANT.HOST + 'lender/' + lenderId)
          .success(function (data, status, headers, config) {
            $scope.lenders.splice(index, 1);
            $('#deleteLender').modal('hide');
            toastr.success('Successfully deleted!');
          })
          .error(function (data, status, header, config) {
            console.log('err', data);
          });
      };

    }

  });
