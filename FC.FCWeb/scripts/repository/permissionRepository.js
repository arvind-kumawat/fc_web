app.factory('permissionRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        //Get all Accounts
        Get: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Permission/GetByLoggedInUser',
                method: "GET",
            }).success(callback);
        },
    }
}])