app.factory('salesChannelRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        GetAll: function (businessId,callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/SalesChannel',
                method: "GET",
                params: { BusinessId: businessId }
            }).success(callback);
        },

        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/SalesChannel',
                method: "GET",
            }).success(callback);
        },
    }
}])