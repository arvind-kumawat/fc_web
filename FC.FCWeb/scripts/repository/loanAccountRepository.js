app.factory('loanAccountRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        getById: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount',
                method: "GET",
                params: { LoanId: loanAccountId }
            }).success(callback);
        },

        OfferAcceptedByBorrower: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAccount/Accept_CApp_OfferLetter',
                method: "GET",
                params: { LoanAccountId: loanAccountId },
            }).success(callback);
        },

        Save: function (loan, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount',
                method: "POST",
                data: JSON.stringify(loan),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        Update: function (loan, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount',
                method: "PUT",
                data: JSON.stringify(loan),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        UpdateReferencePage: function (loan, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount/UpdateLoanAccountRefrences',
                method: "PUT",
                data: JSON.stringify(loan),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        UpdateFKBorrowerId: function (loanAccount, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount/updateBorrowerId',
                method: "PUT",
                data: JSON.stringify(loanAccount),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        
        GetByUserId: function (Request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount',
                method: "GET",
                params: Request
            }).success(callback);
        },

        GetLoanPurpose: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanPurpose',
                method: "GET",
            }).success(callback);
        },

        GetLoan: function (LoanId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount',
                method: "GET",
                params: { LoanId: LoanId }
            }).success(callback);
        },

        GetFilteredLoanList: function (Request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount',
                method: "GET",
                params: Request
            }).success(callback);
        },

        GetByPersonId: function (personId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount/GetByPersonId',
                method: "GET",
                params: { PersonId: personId }
            }).success(callback);

        },

        GetInCompleteByPersonId: function (personId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount/GetInCompleteByPersonId',
                method: "GET",
                params: { PersonId: personId }
            }).success(callback);

        },

        GetLoanAccount: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount',
                method: "GET",
                params: { LoanId: loanAccountId }
            }).success(callback);
        },

        GetByLoanAccountId: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount',
                method: "GET",
                params: loanAccountId
            }).success(callback);
        },

        SetLoanApp_Status: function (loanAccountId, statusId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAccount/SetLoanApp_Status',
                method: "GET",
                params: { LoanAccountId: loanAccountId, StatusId: statusId }
            }).success(callback);
        },

        GenerateRequestForDiscussion: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAccount/GenerateRequestForDiscussion',
                method: "GET",
                params: { LoanAccountId: loanAccountId}
            }).success(callback);
        },

        ApplicationSubmittedByBorrower: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAccount/ApplicationSubmittedByBorrower',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },

        ActivateCVStage: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAccount/ActivateCVStage',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },

        UpdateLoanApplicationStatu: function (loanAccountId, statusName, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAccount/UpdateLoanApplicationStatu',
                method: "GET",
                params: { LoanAccountId: loanAccountId, StatusName: statusName }
            }).success(callback);
        },

        GetApplicationsTimeLineDtl: function (personId, begin, end, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount/GetApplicationsTimeLineDtl',
                method: "GET",
                params: { PersonId: personId, begin: begin, end: end }
            }).success(callback);

        },

        getDraftApplications: function (personId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount/getDraftApplications',
                method: "GET",
                params: { PersonId: personId }
            }).success(callback);

        },
        getTotalApplicationCount: function (personId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanAccount/getTotalApplicationCount',
                method: "GET",
                params: { PersonId: personId }
            }).success(callback);

        },
        searchFromApplications: function (request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + "/api/LoanAccount/searchFromApplications",
                method: "GET",
                params: request
            }).success(callback);

        },
        searchFromApplicationsCount: function (request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + "/api/LoanAccount/searchFromApplicationsCount",
                method: "GET",
                params: request
            }).success(callback);

        },
        renewApplication: function (loanAccount, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanAccount/RenewApplication',
                method: "POST",
                data: JSON.stringify(loanAccount),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

    }
}])