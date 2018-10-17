app.factory('personRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Get all Accounts
        GetAll: function (Internal, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person',
                method: "GET",
                params: { IsInternal: Internal, FakeId: 0 },
            }).success(callback);
        },

        //Get by Id
        GetById: function (PersonId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person',
                method: "GET",
                params: { PersonId: PersonId },
            }).success(callback);
        },
        IsPhoneExists: function (phoneNumber, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/IsPhoneExists',
                method: "GET",
                params: { phoneNumber: phoneNumber }
            }).success(callback);
        },

        GetFilterList: function (Request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person',
                method: "GET",
                params: Request,
            }).success(callback);
        },

        PersonPanValication: function (personId, panNumber, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/PersonPanValication',
                method: "GET",
                params: { personId: personId, panNumber: panNumber },
            }).success(callback);
        },
        IsPersonExistWithphoneNumber: function (personId, phone, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/IsPersonExistWithphoneNumber',
                method: "GET",
                params: { personId: personId, phone: phone },
            }).success(callback);
        },
        IsPersonExistWithEmailId: function (personId, email, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/IsPersonExistWithEmailId',
                method: "GET",
                params: { personId: personId, email: email },
            }).success(callback);
        },
    
        //List of loan
        //GetLoans: function (BusinessId, callback) {
        //    var serviceBase = APPLICATION_SETTINGS.BASE_URI;
        //    $http({
        //        url: serviceBase + '/api/Person',
        //        method: "GET",
        //        params: { BusinessId: BusinessId, Pass: 0, PassA: 0 },
        //    }).success(callback);
        //},
        Save: function (person, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person',
                method: "POST",
                data: JSON.stringify(person),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        Update: function (person, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person',
                method: "PUT",
                data: JSON.stringify(person),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        GetOptionalPersonList: function (Name, Id, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person',
                method: "GET",
                params: { Name: Name, EmailId: Id },
            }).success(callback);
        },

        GetpersonList: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/GetbyLoggedin',
                method: "GET",
            }).success(callback);
        },
        Remove: function (PersonId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person',
                method: "DELETE",
                params: { PersonId: PersonId }
            }).success(callback);
        },

        IsEmailExists: function (emailId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/IsEmailExists',
                method: "GET",
                params: { EmailId: emailId }
            }).success(callback);
        },
        IsLoginDetailAlreadyExist: function (emailId, mobileNumber, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/IsLoginDetailAlreadyExist',
                method: "GET",
                params: { emailId: emailId, phoneNumber: mobileNumber }
            }).success(callback);
        },

        GetInternalUsers: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/GetInternalUsers',
                method: "GET",
            }).success(callback);
        },

        CheckValidation: function (mobileNo, password, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/CheckValidation',
                method: "GET",
                params: { MobileNo: mobileNo, Password: password }
            }).success(callback);
        },

        getPersonByMobile: function (mobileNo, password, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/getByMobile',
                method: "GET",
                params: { MobileNo: mobileNo, Password: password }
            }).success(callback);
        },

        //Getting person by PanCard Number
        getByPan: function (panNumber, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Person/getByPan',
                method: "GET",
                params: { panNumber: panNumber },
            }).success(callback);
        },
    }
}])