app.factory('businessDetailOnlineSellerRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        Save: function (businessDtl, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BusinessDetailOnlineSeller',
                method: "POST",
                data: JSON.stringify(businessDtl),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        GetById: function (SellerDtlId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BusinessDetailOnlineSeller',
                method: "GET",
                params: { businessDtlId: SellerDtlId }
            }).success(callback);
        },
        GetDetail: function (loanId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BusinessDetailOnlineSeller/GetLoanDtl',
                method: "GET",
                params: { LoanAccountId: loanId }
            }).success(callback);
        },
        Update: function (businessDtl, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/BusinessDetailOnlineSeller',
                method: "PUT",
                data: JSON.stringify(businessDtl),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

    }
}])