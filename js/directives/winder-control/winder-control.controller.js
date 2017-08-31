(function () {
    'use strict';
    angular
        .module('bubblot')
        .controller('winderControlCtrl', winderControlCtrl);

    function winderControlCtrl($scope) {
        var vm = this;
        $scope.stop  = function () {  
            $scope.mainControl=0;
            $scope.winderControl1=0;
            $scope.winderControl2=0;
            $scope.winderControl3=0;
            $scope.winderControl4=0;
        }
        $scope.reset  = function () {  
            $scope.winderControl1=0;
            $scope.winderControl2=0;
            $scope.winderControl3=0;
            $scope.winderControl4=0;
        }
        $scope.rail  = function () { 
            $scope.railMode=!$scope.railMode; 
            $scope.mainControl=0;
            $scope.winderControl1=0;
            $scope.winderControl2=0;
            $scope.winderControl3=0;
            $scope.winderControl4=0;
        }
    }

}());
