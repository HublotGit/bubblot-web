(function () {
    'use strict';
    angular
        .module('bubblot')
        .directive('circleProgress', circleProgress);

    /**@ngInject*/
    function circleProgress($parse) {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/circle-progress/circle-progress.html',
            scope: { circleSize: '=', circleThickness: '=', value: '=', reverse: '=', circleRatio: '=', circleColor: '=' },
            replace: true,
            link: function (scope, element, attr) {
                var createCircle = function() {
                    $(element).circleProgress({
                        value: scope.value*scope.circleRatio,
                        size: scope.circleSize,
                        reverse: scope.reverse ? true : false,
                        emptyFill: "rgba(0, 0, 0, 0)",
                        thickness: scope.circleThickness,
                        fill:{
                            gradient: (scope.circleColor==true? ["#FF0000"] : ["#c3f900"])
                        }
                    });
                };
                createCircle();
                var oldValue = scope.value;
                scope.$watch('value', function (value) {
                    if (value && value != oldValue) {
                        $(element).circleProgress('value', scope.value*scope.circleRatio);
                        oldValue = value;
                    }
                });
                var oldCircleSize = scope.circleSize;
                scope.$watch('circleSize', function (size) {
                    if (size && oldCircleSize != size) {
                        createCircle();
                        oldCircleSize = size;
                    }
                });     
                scope.$watch('circleColor', function (size) {
                        $(element).circleProgress('fill', {gradient: (scope.circleColor==true? ["#FF0000"] : ["#c3f900"])});
                        createCircle();
                });       
            }
        };
    }
} ());
