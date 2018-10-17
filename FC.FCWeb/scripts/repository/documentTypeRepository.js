app.factory('documentTypeRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        GetNonFebrictdConfiguredDocByProduct_CV: function (productId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/DocumentType/GetNonFebrictdConfiguredDocByProduct_CV',
                method: "GET",
                params: { ProductId: productId }
            }).success(callback);
        },

    }
}])