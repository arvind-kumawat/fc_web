(function () {
  'use strict';

  angular
    .module('craditKartApp')
    .factory('CommonService', CommonService);

  CommonService.$inject = ['$http', 'CONSTANT'];
  function CommonService($http, CONSTANT) {
    var service = {};
    service.getOptions = getOptions;
    service.sendMail = sendMail;
    return service;
      
    function sendMail(info, callback) {
        $http({
            method: 'POST',
            url: 'http://104.211.247.250/FundscornerAPI/api/SendEmail/SendContactUsMail',
            data: info
        }).success(callback);
    }

    function getOptions(type, callback) {
      $http.get(CONSTANT.HOST + 'options?type=' + type)
        .success(function (data, status, headers, config) {
          return callback(data);
        }) // end loading of dropdown listing
        .error(function (data, status, header, config) {
          console.log('err', data);
        });
    }
  }

})();
