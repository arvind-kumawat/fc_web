app.factory('onlinePlatformSellerRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //posting Product details in Product controller
        Save: function (onlineseller, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/PlatformInfo',
                method: "POST",
                data: JSON.stringify(onlineseller),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        Update: function (onlinesellers, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/PlatformInfo/UpdateList',
                method: "PUT",
                data: JSON.stringify(onlinesellers),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        //Get all Accounts
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/PlatformInfo',
                method: "GET",
            }).success(callback);
        },

        //Get all Accounts
        GetByBusiness: function (businessId,callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/PlatformInfo/GetByBusinessIdForFE',
                method: "GET",
                params:{BusinessId:businessId}
            }).success(callback);
        },

        //Get all Accounts
        Delete: function (onlinePlatformId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/PlatformInfo',
                method: "DELETE",
                params: { OnlinePlatformId: onlinePlatformId }
            }).success(callback);
        },

       

    }
}])