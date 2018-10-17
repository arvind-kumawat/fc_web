app.factory('productRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //posting Product details in Product controller
        Save: function (product, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product',
                method: "POST",
                data: JSON.stringify(product),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        Update: function (product, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product',
                method: "PUT",
                data: JSON.stringify(product),
                params: { Val: "" },
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        UpdateProductBasicDtl: function (product, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product/UpdateProductBasicDtl',
                method: "PUT",
                data: JSON.stringify(product),
                params: { Val: "" },
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        DeActivateProduct: function (product, value, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product',
                method: "PUT",
                data: JSON.stringify(product),
                params: { Val: value },
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        //Get all Accounts
        GetAll: function (Request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product',
                method: "GET",
                params: Request
            }).success(callback);
        },
        GetFilteredData: function (Request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product',
                method: "GET",
                params: Request
            }).success(callback);
        },

        SortByField: function (Request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product',
                method: "GET",
                params: Request
            }).success(callback);
        },
        //Get by Id
        GetById: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product/' + Id,
                method: "GET",
            }).success(callback);
        },
        //GetPreciseName by Id
        GetPreciseNameById: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product/GetPreciseNameByProductId',
                method: "GET",
                params: { productId : Id}
            }).success(callback);
        },
        DocumentGetById: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/ProductDocumentType',
                method: "GET",
                params: { ProductId: Id, GetProductDocument: "GetProduct" },
            }).success(callback);
        },
        GetFilterList: function (Request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product',
                method: "GET",
                params: Request,
            }).success(callback);
        },
        GetAllFiltered: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Product/GetAllFiltered',
                method: "GET",
            }).success(callback);
        },

        GetProductBasicDtl: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product/GetProductBasicDtl',
                method: "GET",
                params: { ProductId: Id },
            }).success(callback);
        },
        Get: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Product/GetProducts',
                method: "GET",
            }).success(callback);
        }
    }
}])