app.factory('PlatformMonthlyDetailRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get all Accounts
        GetByProductId: function (productId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/PlatformMonthlyDetail/GetByProductId',
                method: "GET",
                params: { ProductId: productId }
            }).success(callback);
        },

        //posting Person details in Person controller
        Save: function (accounts, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/PlatformMonthlyDetail',
                method: "POST",
                data: JSON.stringify(accounts),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

       

    }
}])