app.factory('loanRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //posting Product details in Product controller
        //Save: function (loan, callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/Loan',
        //        method: "POST",
        //        data: JSON.stringify(loan),
        //        contentType: "application/json",
        //        dataType: 'json',
        //    }).success(callback);
        //},
        //GetbyLoanAccountId: function (LoanAcoountId,callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/Loan/GetByLoanAccount',
        //        method: "GET",
        //        params: { FkLoanAccountId: LoanAcoountId }
        //    }).success(callback);
        //},
        //GetbyLoanId: function (LoanId,callback) {
        //var serviceBase = CONSTANT.HOST;
        //$http({
        //    url: serviceBase + '/api/Loan',
        //    method: "GET",
        //    params: { LoanId: LoanId }
        //}).success(callback);
        //},
        //GetFilteredLoanList: function (Request, callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/Loan',
        //        method: "GET",
        //        params: Request
        //    }).success(callback);
        //},

        //Update: function (loan, callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/Loan',
        //        method: "PUT",
        //        data: JSON.stringify(loan),
        //        contentType: "application/json",
        //        dataType: 'json',
        //    }).success(callback);
        //},
        //GetByFacilityId: function (facilityId, callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/Loan/GetByFacility',
        //        method: "GET",
        //        params: { FacilityId: facilityId },
        //    }).success(callback);
        //},
        GetByPersonId: function (personId, callback) {
            //GetAllLoansByPersonId
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Loan/GetByPersonId',
                method: "GET",
                params: { personId: personId },
            }).success(callback);
        },
        GetbyLoanId: function (LoanId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Loan',
                method: "GET",
                params: { LoanId: LoanId }
            }).success(callback);
        },
        FCDashboardGetFilteredLoan: function (LoanId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Loan/FCDashboardGetFilteredLoan',
                method: "GET",
                params: { LoanId: LoanId }
            }).success(callback);
        },

        FCDashboardGetFirstLoan: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Loan/FCDashboardGetFirstLoan',
                method: "GET",
            }).success(callback);
        },
        GetForLoggedInUser_FE: function (callback) {
            //GetAllLoansByPersonId
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Loan/GetForLoggedInUser_FE',
                method: "GET",
            }).success(callback);
        },

        //Disburse Request
        RequestForDisburse: function (loanId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Loan/RequestForDisburse',
                method: "GET",
                params: { LoanId: loanId },
            }).success(callback);
        },
    }
}])