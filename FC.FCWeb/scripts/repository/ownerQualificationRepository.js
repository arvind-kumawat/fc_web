app.factory('ownerQualificationRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        // TODO : Should be in BusinessNatureRepository
        GetOwnerQualification: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/OwnerQualification',
                method: "GET",
            }).success(callback);
        },
    }
}])