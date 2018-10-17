app.factory('documentCategoryRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        // Get ABB Detail by BusinessId
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/DocumentCategory',
                method: "GET",
            }).success(callback);
        },
    }
}])