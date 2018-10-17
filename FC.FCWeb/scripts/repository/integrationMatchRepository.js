app.factory('integrationMatchRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        PanMatch: function (pan) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + "api/Integration/PanMatch",
                method: "Post",
                data: pan
            })
        }
    }
}])