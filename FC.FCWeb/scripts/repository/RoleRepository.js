app.factory('RoleRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        //Get all Role
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Role',
                method: "GET",
            }).success(callback);
        },

        // Get FrontEnd Borrower's Role
        getRoleOfBoorower: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Role/GetRoleOfBorrower',
                method: "GET",
            }).success(callback);
        },




    }
}])