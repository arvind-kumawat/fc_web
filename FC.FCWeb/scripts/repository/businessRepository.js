app.factory('businessRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get by Id
        GetById: function (BusinessId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Business',
                method: "GET",
                params: { BusinessId: BusinessId },
            }).success(callback);
        },
        GetFilterList: function (Name, Pass, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Business',
                method: "GET",
                params: { Name: Name, Pass: Pass },
            }).success(callback);
        },
        Update: function (business, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Business',
                method: "PUT",
                data: JSON.stringify(business),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        GetMainApplicantBusiness: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Business/GetMainApplicantBusiness',
                method: "GET",
                params: { LoanAccountId: loanAccountId },
            }).success(callback);
        },
        GetWithBankingAnalysisDtl: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Business/GetWithBankingAnalysisDtl',
                method: "GET",
                params: { LoanAccountId: loanAccountId },
            }).success(callback);
        },

        GetForOnlineSellerDtl: function (businessId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Business/GetForOnlineSellerDtl',
                method: "GET",
                params: { BusinessId: businessId },
            }).success(callback);
        },

        GetByPersonId: function (personId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Business/GetByPersonId',
                method: "GET",
                params: { PersonId: personId },
            }).success(callback);
        },

        Create: function (business, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Business',
                method: "POST",
                data: business
            }).success(callback);
        },

        GetMainApplicantBusiness: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
        $http({
            url: serviceBase + '/api/Business/GetMainApplicantBusiness',
            method: "GET",
            params: { LoanAccountId: loanAccountId },
        }).success(callback);
        },

        GetByLoggedinUser: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Business/GetByLoggedinUser',
                method: "GET",
            }).success(callback);
        }
    }
}])