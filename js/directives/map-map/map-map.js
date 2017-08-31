(function () {
    'use strict';
    angular
        .module('bubblot')
        .directive('mapMap', mapMapDirective);

    function mapMapDirective() {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/map-map/map-map.html',
            controller: 'mapMapCtrl',
            controllerAs: 'vm',
            scope: {extractingData: '=', displayPath: '=', displayVa: '=', displayTurbi: '=', displayMovie: '=',displayFe: '=', displayPb: '=', displayCu: '=', displaySn: '=', isVa: '=', isFe: '=', isPb: '=', 
                    infoVa: '=', isCu: '=', isSn: '=', avgMagnetism: '=', infoMagnetism: '=', dataxPump:'=', datayPump: '=', datax:'=', datay: '=' ,  displayMagn: '=', 
                    isTurbi: '=', isMovie: '=', zoom: '=', ximage: '=', yimage: '=', xnew: '=', ynew: '=', vaCursor: '=', turbiCursor: '=', magnCursor: '=', movieCursor: '=', avgTurbi: '=', updatePanel:'=',
                    dates: '=', dateCursor:'=', latitudeCursor: '=', longitudeCursor:'=', depthCursor:'=', tempCursor:'=', infoTurbiRed: '=', infoTurbiGreen: '=', infoTurbiBlue: '=', xlast:'=', ylast:'=', bubblotCursor: '=', bubblots: '='},
            link: function(scope, element, attr) {
                scope.$watch('displayFe', function () {
                    scope.drawData(element.find('canvas')[0]);
                });    
                scope.$watch('displayPb', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
                scope.$watch('displayCu', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
                scope.$watch('displaySn', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
                scope.$watch('displayPath', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
                scope.$watch('displayVa', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
                scope.$watch('displayMovie', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
                scope.$watch('displayMagn', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
                scope.$watch('displayTurbi', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
                scope.$watch('zoom', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
                scope.$watch('extractingData', function () {
                    scope.drawData(element.find('canvas')[0]);
                });
            }
        } 
    }
}());
