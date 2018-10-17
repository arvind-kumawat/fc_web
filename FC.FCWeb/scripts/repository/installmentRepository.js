app.factory('installmentRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get by Id
        GetFilterList: function (request, Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Installment',
                method: "GET",
                params: { Request: request, LoanId: Id },
            }).success(callback);
        },

        GetDLODTransactionByLoan: function (loanId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/DLODTransaction/GetDLODTransactionByLoan',
                method: "GET",
                params: { LoanId: loanId },
            }).success(callback);
        }

    }
}])