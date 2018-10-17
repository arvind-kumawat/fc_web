app.directive("permission", ["$auth", "APPLICATION_EVENTS", function ($auth, APPLICATION_EVENTS) {
    function link(scope, element, attributes) {
        var permission = attributes.permission;
        console.log("...In View Permission");
        if (!$auth.hasPermission(permission)) {
            //console.debug(element);
            element.hide();
        }
        scope.$on(APPLICATION_EVENTS.PER_CHANGE, function (event, args) {
            scope.$watch($auth.authentication.permissions, function (value) {
                if (!$auth.hasPermission(permission)) {
                    element.hide();
                }
                else {
                    element.show();
                }
            });
        })
        //scope.$watch(AuthService.authentication.permissions, function (value) {
        //    if (!AuthService.hasPermission(permission)) {
        //        element.hide();
        //    }
        //});
    }


    return ({
        link: link,
        restrict: "A"
    });

}]);