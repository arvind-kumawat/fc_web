app.factory('loanActionRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {

        GetPendingAction: function (LoanAccountId, DepartmentId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAction',
                method: "GET",
                params: { LoanAccountId: LoanAccountId, DepartmentId: DepartmentId }
            }).success(callback);
        },

        GetPendingActionforBorrower: function (LoanAccountId, DepartmentId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAction/ActionsForBorrower',
                method: "GET",
                params: { LoanAccountId: LoanAccountId, DepartmentId: DepartmentId }
            }).success(callback);
        },

        HideBorrowerLA_Doc: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAction/HideBorrowerLA_Doc',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },

        CompleteAllLA_Doc: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAction/CompleteAllLA_Doc',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },

        GetFilterList: function (request, LoanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAction',
                method: "GET",
                params: { Request: request, Id: LoanAccountId }
            }).success(callback);
        },

        Update: function (loanAction, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAction',
                method: "PUT",
                data: JSON.stringify(loanAction),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        HideBorrowerLA_IV: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAction/HideBorrowerLA_IV',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },

        GetAdviceLetter: function (Id, AdviceId, paymentId, loanId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAction',
                method: "GET",
                params: { Id: Id, PaymentId: paymentId, LoanId: loanId, AdviceId: AdviceId },
            }).success(callback);
        },

        //OfferAcceptedByBorrower: function (loanAccountId, callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/LoanAction/OfferAcceptedByBorrower',
        //        method: "GET",
        //        params: { LoanAccountId: loanAccountId },
        //    }).success(callback);
        //},

        HideUploadDocLA_Borrower: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAction/HideUploadDocLA_Borrower',
                method: "GET",
                params: { LoanAccountId: loanAccountId },
            }).success(callback);
        },

    }
}])