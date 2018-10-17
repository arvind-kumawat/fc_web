app.factory('maritalstatusRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        Get: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/MaritalStatus',
                method: "GET",
            }).success(callback);
        },
    }
}])