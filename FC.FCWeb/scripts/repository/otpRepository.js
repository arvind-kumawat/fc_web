app.factory('otpRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        GenerateOTPCode: function (Request, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/OTP',
                method: "POST",
                params: Request,
                //contentType: "application/json",
                //dataType: 'json',
            }).success(callback);
        },
        GetForMobileNumber: function (mobileNumber, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/OTP',
                method: "GET",
                params: { mobileNumber: mobileNumber },
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },
        VerifyOTPCode: function (code, MobilePhone, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/OTP',
                method: "GET",
                params: { Code: code, MobilePhone: MobilePhone },
                contentType: "application/json",
                dataType: 'json',
            }).success(callback);
        },

        GetForLoggedinUser: function (callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + '/api/OTP/GetForLoggedinUser',
                method: "GET",
            }).success(callback);
        },
    }
}])