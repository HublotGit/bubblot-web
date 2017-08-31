(function () {
    'use strict';
    angular
        .module('bubblot')
        .directive('graph', graphDirective);

    function graphDirective() {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/graph/graph.html',
            replace: true,
            controller: 'graphCtrl',
            scope: { data: '=', computeVa: '='} ,
            link: function(scope, element, attr) {
                scope.drawGraph(element.find('canvas')[0], scope.data);

                scope.$watch('data', function (data) {
                    scope.drawGraph(element.find('canvas')[0], scope.data);
                });            
            }
        }
    }

}());
