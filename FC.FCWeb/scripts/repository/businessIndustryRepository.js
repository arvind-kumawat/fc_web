app.factory('businessIndustryRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        GetAllBusinessIndustry: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BusinessIndustry',
                method: "GET",
            }).success(callback);
        },
    }
}]);