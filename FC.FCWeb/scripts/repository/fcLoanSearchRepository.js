app.factory('fcLoanSearchRepository', ['$http', 'CONSTANT', '$q', function ($http, CONSTANT, $q) {
    return {



        //Get All loans
        Get: function (personId, search_text) {
            var serviceBase = CONSTANT.HOST;
            return $http({
                url: serviceBase + '/api/FCLoanSearch',
                method: "GET",
                ignoreLoadingBar: true,
                params: { personId: personId, searchText: search_text }
            });

        },
    }
}])