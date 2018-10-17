'use strict';

var urlHandle = {};
if (window.location.hostname === 'localhost') {
   urlHandle.HOST = 'http://localhost:28377/';
} else {
    urlHandle.HOST = 'http://uat-api.fundscorner.com/';
}

angular.module('craditKartApp').constant('CONSTANT', urlHandle);



angular.module('craditKartApp').constant('AUTH_DATA', {
    clientId: 'p2p',
    clientSecret: 'p2p@123'
});


angular.module('craditKartApp').constant('INTEGRATIONS', {
    PAN_CARD_VERIFY_URL: window.location.hostname === 'localhost' ? 'http://localhost:28377' : 'http://104.211.247.250/FundscornerAPI',
    PAN_CARD_VERIFY_HUB: 'PanVerificationHub',
    PAN_CARD_VERIFY_EVENTS: {
        VERIFIED: 'verified',
        VALIDATE: 'validate'
    }
})
