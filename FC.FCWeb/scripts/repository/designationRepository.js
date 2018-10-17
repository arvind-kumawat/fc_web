app.factory('designationRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        // TODO : Should be in BusinessNatureRepository
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Designation/GetFiltered',
                method: "GET",
            }).success(callback);
        },
    }
}])