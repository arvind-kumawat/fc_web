app.factory('bankRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Save BankLoanAccount
        SaveBankLoanAccount: function (loan, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BankLoanAccount',
                method: "POST",
                data: JSON.stringify(loan),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        UpdateBankLoanAccount: function (loan, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BankLoanAccount',
                method: "PUT",
                data: JSON.stringify(loan),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        //Get all Banks
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Bank/GetAll',
                method: "GET",
            }).success(callback);
        },

        // TODO : Move to BankLoanAccountRepository
        GetBankLoanAccount: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BankLoanAccount',
                method: "GET",
                params: { loanAccountId: loanAccountId }
            }).success(callback);
        },
    }
}])