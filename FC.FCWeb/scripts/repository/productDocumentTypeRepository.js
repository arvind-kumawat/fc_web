app.factory('productDocumentTypeRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        GetProductTypeByProductId: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/ProductDocumentType',
                method: "GET",
                params: { ProductId: Id, GetProductDocument: "GetProduct" },
            }).success(callback);
        },
        SaveProductdocumentType: function (productDocumentType, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/ProductDocumentType',
                method: "POST",
                data: JSON.stringify(productDocumentType),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        UpdateProductdocumentType: function (productDocumentType, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/ProductDocumentType',
                method: "PUT",
                data: JSON.stringify(productDocumentType),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        Delete: function (productDocumentTypeId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/ProductDocumentType',
                method: "DELETE",
                params: { Id: productDocumentTypeId }
            }).success(callback);
        },

        GetNonFabricatedDocumentType: function (productId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/ProductDocumentType/GetNonFabricatedDocumentType',
                method: "GET",
                params: { ProductId: productId }
            }).success(callback);
        },

        GetNonFebrictdConfiguredDocByProduct_CV: function (productId, callback) {
            var serviceBase = APPLICATION_SETTINGS.BASE_URI;
            $http({
                url: serviceBase + '/api/DocumentType/GetNonFebrictdConfiguredDocByProduct_CV',
                method: "GET",
                params: { ProductId: productId }
            }).success(callback);
        },

    }
}])