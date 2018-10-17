app.factory('constitutionTypeRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get All
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BusinessConstitution',
                method: "GET",
            }).success(callback);
        },
    }
}])