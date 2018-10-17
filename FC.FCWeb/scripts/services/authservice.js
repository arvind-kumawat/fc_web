app.factory('$auth', ['LOCAL_STORAGE', '$rootScope', function (LOCAL_STORAGE, $rootScope) {
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        personId: 0,
        loginId: 0,
        roles: [],
        RoleId: 0,
        displayName: '',
        permissions: [],
        CompanyName: '',
        Mobile:''
    };

    var _loggedIn = function (data) {
        _authentication.isAuth = true;
        _authentication.loginId = data.LoginDetailId;
        _authentication.personId = data.Person.PersonId;
        _authentication.displayName = data.Person.Name;
        _authentication.CompanyName = data.Person.CompanyName;
        _authentication.roles = data.Person.PersonRoles;
        _authentication.RoleId = data.Role.RoleId;
        _authentication.token = data.Token;
        _authentication.Mobile = data.Person.MobilePhone;
        
        // Set authentication data to local storage
        _storeToLocalStorage();
        $rootScope.$broadcast("LOGGEDIN");
    }

    var _setPermissions = function (permissions) {
        _authentication.permissions = permissions;
        _storeToLocalStorage();
    }

    var _emptyLocalStorage = function () {
        localStorage.removeItem(LOCAL_STORAGE.AUTHENTICATION + ".isAuth");
        localStorage.removeItem(LOCAL_STORAGE.AUTHENTICATION + ".loginId");
        localStorage.removeItem(LOCAL_STORAGE.AUTHENTICATION + ".personId");
        localStorage.removeItem(LOCAL_STORAGE.AUTHENTICATION + ".displayName");
        localStorage.removeItem(LOCAL_STORAGE.AUTHENTICATION + ".token");
        localStorage.removeItem(LOCAL_STORAGE.AUTHENTICATION + ".roles");
        localStorage.removeItem(LOCAL_STORAGE.AUTHENTICATION + ".RoleId");
        localStorage.removeItem(LOCAL_STORAGE.AUTHENTICATION + ".permissions");
        localStorage.removeItem(LOCAL_STORAGE.AUTHENTICATION + ".companyName");
        localStorage.clear();
        _authentication.permissions = [];
    }

    var _storeToLocalStorage = function () {
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".isAuth", _authentication.isAuth);
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".loginId", _authentication.loginId);
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".personId", _authentication.personId);
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".displayName", _authentication.displayName);
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".token", _authentication.token);
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".roles", JSON.stringify(_authentication.roles));
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".RoleId", _authentication.RoleId);
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".permissions", JSON.stringify(_authentication.permissions));
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".companyName", _authentication.CompanyName);
        localStorage.setItem(LOCAL_STORAGE.AUTHENTICATION + ".mobile", _authentication.Mobile);
    }

    var _getFromLocalStorage = function () {
        _authentication.isAuth = localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".isAuth");
        _authentication.loginId = localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".loginId");
        _authentication.personId = localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".personId");
        _authentication.displayName = localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".displayName");
        _authentication.token = localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".token");
        _authentication.roles = eval(localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".roles"));
        _authentication.RoleId = eval(localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".RoleId"));
        _authentication.permissions = eval(localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".permissions"));
        _authentication.CompanyName = localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".companyName");
        _authentication.Mobile = localStorage.getItem(LOCAL_STORAGE.AUTHENTICATION + ".mobile");
    }

    var _loggedOut = function (data) {
        _authentication.isAuth = false;
        _authentication.loginId = 0;
        _authentication.personId = 0;
        _authentication.displayName = '';
        _authentication.token = '';
        _authentication.roles = [];
        _authentication.RoleId = 0;
        _authentication.CompanyName = '';
        _authentication.permissions = [];
        // Remove authentication data from local storage
        _emptyLocalStorage();
        localStorage.clear();
        $rootScope.$broadcast("LOGGEDOUT");
    }

    var _init = function () {
        // Check if  user is already logged in 
        _getFromLocalStorage();
        //alert('brcs');
        $rootScope.$broadcast("SESSIONRESTORED");
    }

    //var _hasPermission = function (permission) {
    //    console.log("...Have permissions");
    //    var found = false;
    //    var permissions = permission.split('|');

    //    if (_authentication.permissions) {
    //        for (var p = 0; p < permissions.length; p++) {
    //            for (var i = 0; i < _authentication.permissions.length; i++) {
    //                if (_authentication.permissions[i].PermissionName == permissions[p]) {
    //                    found = true;
    //                    break;
    //                }
    //            }
    //        }
    //    }

    //    return found;
    //}
    var _hasPermission = function (permission) {
        //console.log(_authentication.permissions);
        var found = false;
        var permissions = permission.split('|');

        if (_authentication.permissions) {
            for (var p = 0; p < permissions.length; p++) {
                for (var i = 0; i < _authentication.permissions.length; i++) {
                    //console.log(_authentication.permissions[i].PermissionName);
                    if (_authentication.permissions[i].Name == permissions) {
                        found = true;
                        break;
                    }
                }
            }
        }

        return found;
    }

    var _isAuthenticated = function () {
        _getFromLocalStorage();
        if (_authentication.loginId != null) {
            return true;
        }
        else {
            return false;
        }
    }

    var _getPayLoad = function () {
        _getFromLocalStorage();
        return _authentication;
    }

    authServiceFactory.authentication = _authentication;
    authServiceFactory.loggedIn = _loggedIn;
    authServiceFactory.loggedOut = _loggedOut;
    authServiceFactory.init = _init;
    authServiceFactory.hasPermission = _hasPermission;
    authServiceFactory.setPermissions = _setPermissions;
    authServiceFactory.isAuthenticated = _isAuthenticated;
    authServiceFactory.getPayload = _getPayLoad;

    return authServiceFactory;
}]);

app.factory('authTokenRepository', ['$http', 'CONSTANT', 'AUTH_DATA', '$injector', function ($http, CONSTANT, AUTH_DATA, $injector) {
    return {
        authenticate: function (loginData, callback, error) {
            var serviceBase = CONSTANT.HOST;
            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
            data = data + "&client_id=" + AUTH_DATA.clientId + "&client_secret=" + AUTH_DATA.clientSecret;
            $http({
                method: 'POST',
                url: serviceBase + "token",
                data: data,
                contentType: 'application/x-www-form-urlencoded',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(callback).error(error);
        },
        obtainAccessToken: function(externalData, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/Account/ObtainLocalAccessToken',
                method: 'GET',
                params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken, email: externalData.email },
            }).success(callback);
        },
        authenticateByOtp: function (otpData, callback, error) {
            var serviceBase = CONSTANT.HOST;
            var data = "grant_type=otp&phone_number=" + otpData.PhoneNumber + "&otp_code=" + otpData.Otp;
            data = data + "&client_id=" + AUTH_DATA.clientId + "&client_secret=" + AUTH_DATA.clientSecret;
            $http({
                method: 'POST',
                url: serviceBase + "/token",
                data: data,
                contentType: 'application/x-www-form-urlencoded',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(callback).error(error);
        },
        authenticateByMobile: function (authData, callback, error) {
            var serviceBase = CONSTANT.HOST;
            var data = "grant_type=mobile&phone_number=" + authData.phone + "&otp_code=" + authData.password;
            data = data + "&client_id=" + AUTH_DATA.clientId + "&client_secret=" + AUTH_DATA.clientSecret;
            $http({
                method: 'POST',
                url: serviceBase + "/token",
                data: data,
                contentType: 'application/x-www-form-urlencoded',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(callback).error(error);
        },
        refreshToken: function (authData) {
            var serviceBase = CONSTANT.HOST;
            var authData = JSON.parse(localStorage.getItem("AuthData"))
            var data = "grant_type=refresh_token&refresh_token=" + authData.refresh_token + "&client_id=" + AUTH_DATA.clientId + "&client_secret=" + AUTH_DATA.clientSecret;
            $.ajax({
                type: 'POST',
                url: serviceBase + "token",
                data: data,
                contentType: 'application/x-www-form-urlencoded',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                async: false,
                success: function (data, status, xhr) {
                    localStorage.setItem("AuthData", JSON.stringify(data));
                }
            })
        },
        authenticateWithPhone: function (loginData, callback, error) {
            var serviceBase = CONSTANT.HOST;
            var data = "grant_type=mobile&phone_number=" + loginData.phone + "&password=" + loginData.password;
            data = data + "&client_id=" + AUTH_DATA.clientId + "&client_secret=" + AUTH_DATA.clientSecret;
            $http({
                method: 'POST',
                url: serviceBase + "token",
                data: data,
                contentType: 'application/x-www-form-urlencoded',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(callback).error(error);
        }
    }
}])

app.factory('authInterceptorService', ['$q', '$injector', '$location', function ($q, $injector, $location) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {
        if (config.url.indexOf('/token') < 0) {
            config.headers = config.headers || {};
            var authData = localStorage.getItem("AuthData");
            if (authData) {
                //var expires_in = new Date(authData[".expires"]);
                //var current_time = new Date();
                //if (current_time >= expires_in) {
                //    var authTokenRepository = $injector.get("AuthTokenRepository");
                //    authTokenRepository.RefreshToken(authData);
                //    authData = JSON.parse(localStorage.getItem("AuthData"))
                //}
                config.headers.Authorization = 'Bearer ' + authData;
            }
        }
        else {
            config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var authService = $injector.get('$auth');
            var authData = localStorage.getItem("AuthData");
            //if (authData) {
            //        $location.path('/Login');
            //        return $q.reject(rejection);
            //}
            authService.loggedOut();
            $location.path('#/');
        }
        return $q.reject(rejection);
    }

    

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);
