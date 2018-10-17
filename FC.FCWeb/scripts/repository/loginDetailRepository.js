app.factory('loginDetailRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //posting Logiv details in Login controller
        Login: function (login, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail',
                method: "POST",
                data: JSON.stringify(login),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        //Get by Id
        GetById: function (LoginId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail',
                method: "GET",
                params: { LoginId: LoginId },
            }).success(callback);
        },
        Update: function (Login, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail',
                method: "PUT",
                data: JSON.stringify(Login),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        UpdatePassword: function (login, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail/UpdatePassword',
                method: "POST",
                data: JSON.stringify(login),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        ResetPassword: function (username, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail/ResetPassword',
                method: "GET",
                params: { username: username },
            }).success(callback);
        },
        VerifyOTP: function (login, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail/VerifyOTP',
                method: "POST",
                data: JSON.stringify(login),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        UpdateNewPassword: function (login, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail/UpdateNewPassword',
                method: "POST",
                data: JSON.stringify(login),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        Create: function (loginDetail, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail/Create',
                method: "POST",
                data: JSON.stringify(loginDetail),
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        GetByMobileAndPassword: function (mobile, password, callback) {
        var serviceBase = CONSTANT.HOST;
        $http({
            url: serviceBase + 'api/LoginDetail/GetByMobileAndPassword',
            method: "GET",
            params: { Mobile: mobile ,Password:password},
        }).success(callback);
        },
        getForLogin: function (loginId,mobile, password, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail/getForLogin',
                method: "GET",
                params: {loginId:loginId, Mobile: mobile, Password: password },
            }).success(callback);
        },

        GetLoginDetailIdByMobile: function (mobile, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail/GetLoginDetailIdByMobile',
                method: "GET",
                params: { Mobile: mobile },
            }).success(callback);
        },

        UpdatePasswordById: function (loginDetailId, password, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail/UpdatePasswordById',
                method: "GET",
                params: { LoginDetailId: loginDetailId, Password: password },
            }).success(callback);
        },
        MobileValidation: function (mobile, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/LoginDetail/MobileValidation',
                method: "GET",
                params: { Mobile: mobile },
            }).success(callback);
        },
       




    }
}])