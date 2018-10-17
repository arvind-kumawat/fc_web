app.factory('ownershipRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //posting Product details in Product controller
        Save: function (ownership, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/OwnerShip',
                method: "POST",
                data: JSON.stringify(ownership),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        Update: function (ownership, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/OwnerShip',
                method: "PUT",
                data: JSON.stringify(ownership),
                params: { Val: "" },
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        //Get all Accounts
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/OwnerShip',
                method: "GET",
            }).success(callback);
        },
    }
}])