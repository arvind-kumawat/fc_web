app.factory('businessNatureRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        GetAllBusinessNature: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BusinessNature',
                method: "GET",
            }).success(callback);
        },
        GetBusinessNatureByCategoryId: function (id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BusinessNature',
                method: "GET",
                params: { Id: id }
            }).success(callback);
        }
    }
}]);