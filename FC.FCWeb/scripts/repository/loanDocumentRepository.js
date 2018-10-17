app.factory('loanDocumentRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        GetByLoanAccountId: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/GetByLoanAccountId',
                method: "GET",
                params: { LoanAccountId: Id },
            }).success(callback);
        },
        GetFilterList: function (Request, Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument',
                method: "GET",
                params: { Request: Request, Id: Id },
            }).success(callback);
        },
        UploadDocForLoanAccount: function(formData, loanAccountId, documentTypeId, businessId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http.put(serviceBase + '/api/LoanDocument/UploadInitialDocument', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined },
                params: { loanAccountId: loanAccountId, documentTypeId: documentTypeId, businessId: businessId }
            }).success(function (data) { callback(data) })
        },
        Update: function (formData, AccountId, ProductDocTypId, PersonId, BusinessId, FKDocumentUploadTypeId, LoanDocId, InvoiceID, callback) {
            var serviceBase = CONSTANT.HOST;
            $http.put(serviceBase + '/api/LoanDocument', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined },
                params: { AccountId: AccountId, ProductDocTypId: ProductDocTypId, PersonId: PersonId, BusinessId: BusinessId, FKDocumentUploadTypeId: FKDocumentUploadTypeId, LoanDocumentId: LoanDocId, invoiceId: InvoiceID }
            }).success(function (data) { callback(data) })
        },
        UpdateLoandocument: function (docSent, loanDocId,documentId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/UpdateLoandocument',
                method: "GET",
                params: { isdocSent: docSent, LoanDocumentId: loanDocId,DocumentId:documentId },

                dataType: 'json',
            }).success(callback);
        },

        UpdateFebLoandocument: function (docSent, loanDocId, documentId, Included, loanId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/UpdateLoandocument',
                method: "GET",
                params: { isdocSent: docSent, LoanDocumentId: loanDocId, DocumentId: documentId, IsIncluded: Included, LoanId: parseInt(loanId) },

                dataType: 'json',
            }).success(callback);
        },

        Delete: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument',
                method: "DELETE",
                params: { Id: Id }
            }).success(callback);
        },
        DeleteLoandocuemnt: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/DeleteLoandocuemnt',
                method: "DELETE",
                params: { personid: Id }
            }).success(callback);
        },
        Upload: function (formData,loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http.put(serviceBase + '/api/ImportExcelData', formData, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined },
                params: { LoanAccountId: loanAccountId }
            }).success(function (data) { callback(data) })
        },
        GetByPersonId: function (personId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/GetByPersonId',
                method: "GET",
                params: { personId: personId },
            }).success(callback);
        },
        Create: function (loanDocument, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/GetByPersonId',
                method: "POST",
                data: loanDocument
            }).success(callback);
        },
        IsReqDoc_Uploaded_CV: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/IsReqDoc_Uploaded_CV',
                method: "GET",
                params: { LoanAccountId: loanAccountId },
            }).success(callback);
        },

        GetSanctionedLetterLoanDoc: function (loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/GetSanctionedLetterLoanDoc',
                method: "GET",
                params: { LoanAccountId: loanAccountId },
            }).success(callback);
        },

        Update: function (LoanDocument, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoanDocument',
                method: "PUT",
                data: JSON.stringify(LoanDocument),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        GetByDocTypeAndLoanAccountId: function (loanAccountId, documentTypeId,  callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/GetByDocTypeAndLoanAccountId',
                method: "GET",
                params: { LoanAccountId: loanAccountId, DocumentTypeId: documentTypeId },
            }).success(callback);
        },

        GetNonFabLoanDocumentByLoanId: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/GetNonFabLoanDocumentByLoanId',
                method: "GET",
                params: { LoanId: Id },
            }).success(callback);
        },

        GenerateLoanStatement: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/GenerateLoanStatement',
                method: "GET",
                params: { LoanId: Id },
            }).success(callback);
        },

        GetLStmntLDoc: function (Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/LoanDocument/GetLStmntLDoc',
                method: "GET",
                params: { LoanId: Id },
            }).success(callback);
        },

    }
}])