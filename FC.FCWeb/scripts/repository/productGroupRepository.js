app.factory('productGroupRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get all Accounts
        GetAll: function (productId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/productGroup/Get',
                method: "GET",
            }).success(callback);
        },
        GetAllFilter: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/productGroup/GetFilterProduct',
                method: "GET",
            }).success(callback);
        },

    }
}])