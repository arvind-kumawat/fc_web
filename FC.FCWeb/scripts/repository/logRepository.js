app.factory('logRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        GetNotifications: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Log/GetNotifications',
                method: "GET",
            }).success(callback);
        },

        GenerateCallBackRequest: function (loanAccountId,callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Log/GenerateCallBackRequest',
                method: "GET",
                params:{LoanAccountId:loanAccountId}
            }).success(callback);
        },

        GenerateUploadDocForBorrower: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Log/GenerateUploadDocForBorrower',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },
    }
}])