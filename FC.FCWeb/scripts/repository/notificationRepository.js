app.factory('notificationRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get all by PersonId
        GetByLoggedInPerson: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Notification/GetByLoggedInPerson',
                method: "GET",
            }).success(callback);
        },

        //Loan Submitted
        Add_AppSubmission: function (personId, loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Notification/Add_AppSubmission',
                method: "GET",
                params: { PersonId: personId, LoanAccountId: loanAccountId }
            }).success(callback);
        },

        //Request for Pending notification
        Add_UploadDoc: function (personId, loanAccountId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Notification/Add_UploadDoc',
                method: "GET",
                params: { PersonId: personId, LoanAccountId: loanAccountId }
            }).success(callback);
        },

        HideById: function (id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/Notification/HideById',
                method: "GET",
                params: { NotificationId:id }
            }).success(callback);
        },

    }
}])