(function () {
    'use strict';
    angular
        .module('bubblot')
        .controller('deepCtrl', deepCtrl);

    function deepCtrl($scope, $element) {
        var vm = this;
        //var allScreen=document.getElementById('bubblotDisplay');
        //allScreen.addEventListener("wheel", scrollBallast, false);
        function scrollBallast(event) {
            var clientRect = allScreen.getBoundingClientRect();
            var minX = clientRect.left + (clientRect.width/5);
            var maxX = clientRect.right - (clientRect.width/5);
            if(event.screenX > minX && event.screenX < maxX){
                if($scope.ballastState>=0 && $scope.ballastState<=100){
                    $scope.ballastState=$scope.ballastState+3*event.deltaY/200;
                    if($scope.ballastState>100){
                        $scope.ballastState=100;
                    }
                    if($scope.ballastState<0){
                        $scope.ballastState=0;
                    }
                    $scope.$apply();
                }
            }
        }
        $scope.checkSecurity  = function () {
            if($scope.security>70 || $scope.security<30){
                $scope.securityAlert = true;
            }
            else{
                $scope.securityAlert = false;
            }
        }

        //To simulate change of security
        var cadran=document.getElementsByClassName('cadrans-container deep');
        for(var i=0; i<cadran.length; i++){
            cadran[i].addEventListener("wheel", scrollSecurity, false);
        }
        function scrollSecurity(event) {
            if($scope.focusIndex==2){
                if($scope.security>=0 && $scope.security<=100){
                    $scope.security=$scope.security+event.deltaY/100;
                    if($scope.security>100){
                        $scope.security=100;
                    }
                    else if($scope.security<0){
                        $scope.security=0;
                    }
                    $scope.$apply();
                }
            }
        }
    }

} ());
