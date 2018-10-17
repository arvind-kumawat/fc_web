app.factory('ownership_HeaderRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get all Accounts
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/OwnerShip_Header/GetAll',
                method: "GET",
            }).success(callback);
        },

    }
}])