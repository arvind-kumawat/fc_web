app.factory('documentRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //posting Product details in Product controller
        Save: function (formData, AccountId, ProductDocTypId, PersonId, BusinessId, FKDocumentUploadTypeId, LoanDocId,InvoiceNo, callback) {
            var serviceBase = CONSTANT.HOST;
            $http.post(serviceBase + '/api/Document', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined },
                params: { AccountId: AccountId, ProductDocTypId: ProductDocTypId, PersonId: PersonId, BusinessId: BusinessId, FKDocumentUploadTypeId: FKDocumentUploadTypeId, LoanDocumentId: LoanDocId, Invoicenumber:InvoiceNo }
            }).success(function (data) { callback(data) })
        },
        Create: function(formData, loanAccountId,password, callback) {
            var serviceBase = CONSTANT.HOST;
            $http.put(serviceBase + '/api/Document/UploadDocument', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined },
                params: { LoanAccountId: loanAccountId, Password: password }
            }).success(function (data) { callback(data) })
        },
        UpdateDocumentStatus: function (docId, verified, callback) {
            $http({
                url: serviceBase + '/api/Document/',
                method: "PUT",
                params: { docId: docId, verified: verified },
            }).success(callback);
        },

        //Get all Accounts
        GetAll: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Document',
                method: "GET",
            }).success(callback);
        },
        //Get all Accounts
        Delete: function (docId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Document',
                method: "DELETE",
                params: { DocumentId: docId },
            }).success(callback);
        },
        //Get by Id
        GetById: function (DocumentId, ApplicantId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Document/',
                method: "GET",
                params: { DocumentId: DocumentId, ApplicantId: ApplicantId },
            }).success(callback);
        },
        GetByStatusId: function (DocumentId, ApplicantId, statusId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Document/',
                method: "GET",
                params: { DocumentId: DocumentId, ApplicantId: ApplicantId, statusId: statusId },
            }).success(callback);
        },
        GetByLoanDocumentId: function (LoanDocumentId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Document/',
                method: "GET",
                params: { FKLoanDocumentId: LoanDocumentId },
            }).success(callback);
        },
       
    }
}])