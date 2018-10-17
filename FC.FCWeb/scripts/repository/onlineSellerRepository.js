app.factory('onlineSellerRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //posting Product details in Product controller
        Save: function (onlineseller, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Organization',
                method: "POST",
                data: JSON.stringify(onlineseller),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        Update: function (onlinseller, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Organization',
                method: "PUT",
                data: JSON.stringify(onlinseller),
                params: { Val: "" },
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        //Get all Accounts
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Organization',
                method: "GET",
            }).success(callback);
        },

        //Get all Accounts
        GetByProductId: function (productId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Organization/GetByProductId',
                method: "GET",
                params: { ProductId: productId }
            }).success(callback);
        },

        //Get all Accounts
        GetByName: function (name, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Organization/GetByName',
                method: "GET",
                params:{Name:name}
            }).success(callback);
        },
    }
}])