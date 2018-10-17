app.factory('businessConstitutionRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        // TODO : Should be in BusinessNatureRepository
        GetBusinessConstitution: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BusinessConstitution',
                method: "GET",
            }).success(callback);
        },
    }
}])