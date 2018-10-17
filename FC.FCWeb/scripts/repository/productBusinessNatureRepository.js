app.factory('productBusinessNatureRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get all Accounts
        GetAll: function ( callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/ProductBusinessNature',
                method: "GET",
            }).success(callback);
        },


    }
}])