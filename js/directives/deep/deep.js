(function () {
    'use strict';
    angular
        .module('bubblot')
        .directive('deep', deepDirective);

    function deepDirective() {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/deep/deep.html',
            replace: true,
            controller: 'deepCtrl',
            controllerAs: 'vm',
            scope: {security: '=', securityAlert: '=', ballastState: '=', ballastFill: '=', ballastEmpty: '=', circleSize: '=', circleThickness: '=', depth: '=', focusIndex: '='},
            link: function(scope, element, attr) {
                scope.$watch('security', function (value) {
                    scope.checkSecurity(value);
                });
            }
        }
    }

}());
