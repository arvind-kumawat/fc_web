app.factory('applicantRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //posting Person details in Person controller
        Save: function (accounts, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant',
                method: "POST",
                data: JSON.stringify(accounts),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        //GetByLoanId
        GetByLoanAccountId: function (LoanAccountId, callback) {
            console.log("PERFLOFG:GetByLoanAccountId");
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant/GetByLoanAccountId',
                method: "GET",
                params: { LoanAccountId: LoanAccountId }
            }).success(callback);
        },
        //Get for document section
        FCDocument_Applicants: function (LoanAccountId, callback) {
            console.log("PERFLOFG:GetByLoanAccountId");
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant/FCDocument_Applicants',
                method: "GET",
                params: { LoanAccountId: LoanAccountId }
            }).success(callback);
        },
        
        Delete: function(applicantId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant',
                method: "DELETE",
                params: { ApplicantId: applicantId }
            }).success(callback);
        },


        Update: function (Applicant, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant',
                method: "PUT",
                data: JSON.stringify(Applicant),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        updateApplicantList: function (Applicants, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant/updateApplicantList',
                method: "PUT",
                data: JSON.stringify(Applicants),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        
        GetBusinessByPersonId: function (request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant',
                method: "GET",
                params: request
            }).success(callback);
        },

        GetLoanDetail: function (loanId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant/GetLoanDetail',
                method: "GET",
                params: { LoanId: loanId }
            }).success(callback);
        },
        
        GetMainApplicantBusinessByLoanAccountId: function (loanAccountId, callback) {
                var serviceBase = CONSTANT.HOST;
                $http({
                    url: serviceBase + 'api/Applicant/GetMainApplicantLoanAccountBusinessByLoanAccountId',
                    method: "GET",
                    params: { LoanAccountId: loanAccountId }
                }).success(callback);
        },
        GetWithPersonByLoanAccountId: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Applicant/GetWithPersonByLoanAccountId',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },
        
        GetMainApplicantByLoanAccountId: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Applicant/GetMainApplicantByLoanAccountId',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },

        GetCoApplicantsByLoanAccountId: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant/GetCoApplicantsByLoanAccountId',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },


        //Loan Applicant : To be removed after refactor
        //GetApplicants: function (LoanId, callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/LoanApplicant',
        //        method: "GET",
        //        params: { LoanApplicantId: LoanId }
        //    }).success(callback);
        //},

        //Get All Applicants By LoanAccountId
        GetMainApplicants: function (Request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanApplicant',
                method: "GET",
                params: Request
            }).success(callback);
        },

        GetApplicantsByLoanAccountId: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Applicant/GetApplicantsByLoanAccountId',
                method: "GET",
                params: { LoanAccountId: loanAccountId }
            }).success(callback);
        },

    }
}])