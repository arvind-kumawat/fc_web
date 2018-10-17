app.factory('fCcategoryRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/fCcategory',
                method: "GET",
            }).success(callback);
        },
    }
}])