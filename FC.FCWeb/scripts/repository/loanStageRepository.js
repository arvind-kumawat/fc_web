app.factory('loanStageRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        //Update Record
        //Update: function (LoanStage, callback) {
        //    var serviceBase = APPLICATION_SETTINGS.BASE_URI;
        //    $http({
        //        url: serviceBase + '/api/LoanStage',
        //        method: "PUT",
        //        data: JSON.stringify(LoanStage),
        //        contentType: "application/json",
        //        dataType: 'json',
        //    }).success(callback);
        //},
        //GetActiveStage: function (callback) {
        //    var serviceBase = APPLICATION_SETTINGS.BASE_URI;
        //    $http({
        //        url: serviceBase + '/api/LoanStage',
        //        method: "GET",
        //        params: { Pass: 0, PassA: 0 }
        //    }).success(callback);
        //},

        //GetByLoanAccount: function (loanAccountId, callback) {
        //    var serviceBase = APPLICATION_SETTINGS.BASE_URI;
        //    $http({
        //        url: serviceBase + '/api/LoanStage/GetByLoanAccount',
        //        method: "GET",
        //        params: { LoanAccountId: loanAccountId }
        //    }).success(callback);
        //},

        ActivateCVStage: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanStage/ActivateCVStage',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },

    }
}])