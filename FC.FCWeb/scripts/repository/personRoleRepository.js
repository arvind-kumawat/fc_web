app.factory('personRoleRepository', ['$http', 'CONSTANT', function ($http, CONSTANT) {
    return {
       
        //Check if user is a borrower or not
        CheckForBorrower: function (PersonId, callback) {
            var serviceBase = CONSTANT.HOST;
            $http({
                url: serviceBase + 'api/PersonRole/CheckForBorrower',
                method: "GET",
                params: { PersonId: PersonId },
            }).success(callback);
        }
    

    }
}])