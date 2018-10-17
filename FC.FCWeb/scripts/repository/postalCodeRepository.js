app.factory('postalCodeRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        // TODO : Should be in BusinessNatureRepository
        GetPostalCode: function (Code,callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/PostalCode',
                method: "GET",
                params: {
                    PostalCode:Code
                }
            }).success(callback);
        },
        GetFirstByPostalCode: function (Code, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/PostalCode/GetFirstByPostalCode',
                method: "GET",
                params: {
                    PostalCode: Code
                }
            }).success(callback);
        }
    }
}])