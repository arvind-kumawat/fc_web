app.factory('loanApplicationStatusRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {



        // GetBy loan AccountId
        GetByLoanAccount: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanApplicationStatus',
                method: "GET",
                params: { loanAccountId: loanAccountId }
            }).success(callback);
        },
    }
}])