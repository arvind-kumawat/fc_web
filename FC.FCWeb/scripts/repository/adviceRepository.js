app.factory('adviceRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get all Accounts
        GetByProductId: function (productId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Advice/GetByProductId',
                method: "GET",
                params: { ProductId: productId }
            }).success(callback);
        },

        //Get all Accounts
        GetByProduct: function (productId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Advice/GetByProduct',
                method: "GET",
                params: {ProductId: productId }
            }).success(callback);
        },

    }
}])