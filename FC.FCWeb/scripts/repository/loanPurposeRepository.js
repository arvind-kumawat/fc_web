app.factory('loanPurposeRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get By Id
        GetById: function (LoanPurposeId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanPurpose',
                method: "GET",
                params: { LoanPurposeId: LoanPurposeId }
            }).success(callback);
        },
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanPurpose',
                method: "GET",
            }).success(callback);
        },
    }
}])