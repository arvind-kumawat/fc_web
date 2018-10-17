app.factory('facilityRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
        //Save: function (facilty, callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/Facility',
        //        method: "POST",
        //        data: JSON.stringify(facilty),
        //        contentType: "application/json",
        //        dataType: 'json',
        //    }).success(callback);
        //},
        //GetAllData: function (Request, callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/Facility',
        //        method: "GET",
        //        params:Request,
        //    }).success(callback);
        //},
        //GetById: function (facilityId,callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/Facility',
        //        method: "GET",
        //        params:{FacilityId:facilityId}
        //    }).success(callback);
        //},

        //Update: function (facility, callback) {
        //    var serviceBase = CONSTANT.HOST;
        //    $http({
        //        url: serviceBase + '/api/Facility',
        //        method: "PUT",
        //        data: JSON.stringify(facility),
        //        contentType: "application/json",
        //        dataType: 'json',
        //    }).success(callback);
        //},

        GetForLoggedInUser: function (callback) {
                var serviceBase = CONSTANT.HOST;
                $http({
                    url: serviceBase + '/api/Facility/GetForLoggedInUser',
                    method: "GET",
                }).success(callback);
        },
    }
}])