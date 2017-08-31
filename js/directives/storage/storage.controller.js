(function () {
    'use strict';
    angular
        .module('bubblot')
        .controller('storageCtrl', storageCtrl);

    function storageCtrl($scope) {
        var vm = this;
        $scope.initTimer  = function () {  
            $scope.pumpOn=!$scope.pumpOn;
            $scope.filledOk=!$scope.filledOk; 
            //setTimeout($scope.filled, 25000);
        }
        $scope.filled  = function () { 
            $scope.pumpOn=false;  
            $scope.filledOk=true;        
        }
    }

}());
