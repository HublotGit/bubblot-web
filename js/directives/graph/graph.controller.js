(function () {
    'use strict';
    angular
        .module('bubblot')
        .controller('graphCtrl', graphCtrl);

    function graphCtrl($scope) {
        var vm = this;
        $scope.getNewData = function () {
            $scope.data = [];
            for (var i = -1000; i <= 1000; i++) {
                var obj = { x: 10 * i, y: 5 * Math.random() };
                $scope.data.push(obj);
            }

        }
        if (graph != null) {
            graph.destroy();
        }
        var graph;
        $scope.drawGraph = function (element, data) {
            var vaData = {
                datasets: [{
                    borderColor: 'black',
                    pointBackgroundColor: 'black',
                    borderWidth: 1,
                    pointBorderWidth: 0,
                    pointRadius: 0,
                    fill: false,
                    data: $scope.data
                }]
            };
            if (graph != null) {
                graph.destroy();
            }
            var context = element.getContext("2d");
            graph = new Chart(context, {
                type: 'line',
                data: vaData,
                options: {
                    maintainAspectRatio: false,
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false,
                    },
                    scales: {
                        xAxes: [{
                            type: 'linear',
                            position: 'bottom',
                            scaleLabel: {
                                display: true,
                                fontColor: "black",
                                fontSize: 10,
                                labelString: '[mV]',
                            },
                            ticks: {
                                min: -1,
                                max: 1,
                                stepSize: 100,
                                fontColor: "black"
                            },
                            gridLines: {
                                display: true,
                                color: "black",
                            }
                        }],
                        yAxes: [{
                            type: 'linear',
                            position: 'left',
                            scaleLabel: {
                                display: true,
                                fontColor: "black",
                                fontSize: 10,
                                labelString: '[mV*2]',
                            },
                            ticks: {
                                min: 0,
                                max: 100,
                                fontColor: "black"
                            },
                            gridLines: {
                                display: true,
                                color: "black",
                            }
                        }]
                    }
                }
            });

        };
    }
} ());
