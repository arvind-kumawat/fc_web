angular
    .module('craditKartApp').factory('panCardVerificationHubService', ["$rootScope", "INTEGRATIONS", function ($rootScope, INTEGRATIONS) {
    var proxy = null;
    var connection = null;
    var initialize = function () {
        //Getting the connection object
        try {

            connection = $.hubConnection(INTEGRATIONS.PAN_CARD_VERIFY_URL);
            //Creating proxy
            proxy = connection.createHubProxy(INTEGRATIONS.PAN_CARD_VERIFY_HUB);
            //Starting connection
            proxy.on(INTEGRATIONS.PAN_CARD_VERIFY_EVENTS.VERIFIED, function (panNumber, panStatus, firstNameMatched, lastNameMatched, isBusinessPAN) {
                $rootScope.$broadcast(INTEGRATIONS.PAN_CARD_VERIFY_EVENTS.VERIFIED, { PanNumber: panNumber, PanStatus: panStatus, FirstNameMatched: firstNameMatched, LastNameMatched: lastNameMatched, IsBusinessPAN: isBusinessPAN });
            });
            connection.start();
        }
        catch (ex) {
            console.log(ex);
        }
    };

    var verify = function (pan, firstName, lastName) {
        //Invoking verify method defined in hub
        /******** Comment these lines if don't want to verify pan details from nsdl ******************/

        try {

            connection.start().done(function () {
                console.log(firstName)
                proxy.invoke(INTEGRATIONS.PAN_CARD_VERIFY_EVENTS.VALIDATE, pan, firstName, lastName);
            });
        }
        catch (ex) {
            connection.start().done(function () {
                console.log(firstName)
                proxy.invoke(INTEGRATIONS.PAN_CARD_VERIFY_EVENTS.VALIDATE, pan, firstName, lastName);
            });
        }

        /******** Comment these lines if don't want to verify pan details from nsdl end**************/

        /******** Uncomment these lines if don't want to verify pan details from nsdl ******************/
        //setTimeout(function () {
        //    if (pan == "AAAAA0000B") {
        //        $rootScope.$broadcast(INTEGRATIONS.PAN_CARD_VERIFY_EVENTS.VERIFIED, { PanNumber: pan, PanStatus: true, FirstNameMatched: false, LastNameMatched: true, IsBusinessPAN: true });
        //    }
        //    else if (pan == "AAAAA0000C") {
        //        $rootScope.$broadcast(INTEGRATIONS.PAN_CARD_VERIFY_EVENTS.VERIFIED, { PanNumber: pan, PanStatus: true, FirstNameMatched: true, LastNameMatched: true, IsBusinessPAN: false });
        //    }
        //    else {
        //        $rootScope.$broadcast(INTEGRATIONS.PAN_CARD_VERIFY_EVENTS.VERIFIED, { PanNumber: pan, Status: "N", FirstName: "", MiddleName: "", LastName: "" });
        //    }
        //}, 1000)
        /******** Uncomment these lines if don't want to verify pan details from nsdl end***************/
    };

    return {
        initialize: initialize,
        verify: verify
    };
}])