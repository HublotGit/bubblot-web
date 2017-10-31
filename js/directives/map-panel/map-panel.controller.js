(function () {
    'use strict';
    angular
        .module('bubblot')
        .controller('mapPanelCtrl', mapPanelCtrl);

    function mapPanelCtrl($scope, $element) {
        var vm = this;
        $scope.graphName="V-A";
        //Initialiazing variables
        $scope.datax[0] = [], $scope.datay[0] = [], $scope.datax[1] = [], $scope.datay[1] = [], $scope.datax[2] = [], $scope.datay[2] = [];
        $scope.avgMagnetism[0] = [], $scope.avgMagnetism[1] = [], $scope.avgMagnetism[2] = [];
        $scope.isVa[0] = [], $scope.isVa[1] = [], $scope.isVa[2] = [];
        $scope.isFe[0] = [], $scope.isFe[1] = [], $scope.isFe[2] = [];
        $scope.isPb[0] = [], $scope.isPb[1] = [], $scope.isPb[2] = [];
        $scope.isCu[0] = [], $scope.isCu[1] = [], $scope.isCu[2] = [];
        $scope.isSn[0] = [], $scope.isSn[1] = [], $scope.isSn[2] = [];
        $scope.isTurbi[0] = [], $scope.isTurbi[1] = [], $scope.isTurbi[2] = [];
        $scope.avgTurbi[0] = [], $scope.avgTurbi[1] = [], $scope.avgTurbi[2] = [];
        $scope.isMovie[0] = [], $scope.isMovie[1] = [], $scope.isMovie[2] = [];
        $scope.dates[0] = [], $scope.dates[1] = [], $scope.dates[2] = [];

        //Callback functions for date input to update fond-marin and fond-marin2
        var startDay = document.getElementsByClassName("start-day");
        var startTime = document.getElementsByClassName("start-time");
        var stopDay = document.getElementsByClassName("stop-day");
        var stopTime = document.getElementsByClassName("stop-time");
        var submit = document.getElementsByClassName("submit-time");
        for (var i = 0; i < submit.length; i++) {
            if (i == 0) {
                startDay[i].addEventListener('change', updateDateDown);
                startTime[i].addEventListener('change', updateDateDown);
                stopDay[i].addEventListener('change', updateDateDown);
                stopTime[i].addEventListener('change', updateDateDown);
            }
            else {
                startDay[i].addEventListener('change', updateDateUp);
                startTime[i].addEventListener('change', updateDateUp);
                stopDay[i].addEventListener('change', updateDateUp);
                stopTime[i].addEventListener('change', updateDateUp);
            }
        }
        function updateDateDown() {
            startDay[1].value = startDay[0].value;
            startTime[1].value = startTime[0].value;
            stopDay[1].value = stopDay[0].value;
            stopTime[1].value = stopTime[0].value;
        }
        function updateDateUp() {
            startDay[0].value = startDay[1].value;
            startTime[0].value = startTime[1].value;
            stopDay[0].value = stopDay[1].value;
            stopTime[0].value = stopTime[1].value;
        }

        //Extract data from the database into the program memory when clicking submit
        $scope.extractData = function (element) {
            //Get time slot 
            var dataStartYear = parseInt(startDay[0].value[0] + startDay[0].value[1] + startDay[0].value[2] + startDay[0].value[3]);
            var dataStartMonth = parseInt(startDay[0].value[5] + startDay[0].value[6]);
            var dataStartDay = parseInt(startDay[0].value[8] + startDay[0].value[9]);

            var dataEndYear = parseInt(stopDay[0].value[0] + stopDay[0].value[1] + stopDay[0].value[2] + stopDay[0].value[3]);
            var dataEndMonth = parseInt(stopDay[0].value[5] + stopDay[0].value[6]);
            var dataEndDay = parseInt(stopDay[0].value[8] + stopDay[0].value[9]);

            //Initialiazing data
            $scope.dataxPump = [], $scope.datayPump = [], $scope.datax[0] = [], $scope.datay[0] = [], $scope.datax[1] = [], $scope.datay[1] = [], $scope.datax[2] = [], $scope.datay[2] = [];
            $scope.avgMagnetism[0] = [], $scope.avgMagnetism[1] = [], $scope.avgMagnetism[2] = [];
            $scope.isVa[0] = [], $scope.isVa[1] = [], $scope.isVa[2] = [];
            $scope.isFe[0] = [], $scope.isFe[1] = [], $scope.isFe[2] = [];
            $scope.isPb[0] = [], $scope.isPb[1] = [], $scope.isPb[2] = [];
            $scope.isCu[0] = [], $scope.isCu[1] = [], $scope.isCu[2] = [];
            $scope.isSn[0] = [], $scope.isSn[1] = [], $scope.isSn[2] = [];
            $scope.isTurbi[0] = [], $scope.isTurbi[1] = [], $scope.isTurbi[2] = [];
            $scope.avgTurbi[0] = [], $scope.avgTurbi[1] = [], $scope.avgTurbi[2] = [];
            $scope.isMovie[0] = [], $scope.isMovie[1] = [], $scope.isMovie[2] = [];
            $scope.dates[0] = [], $scope.dates[1] = [], $scope.dates[2] = [];

            const couch = new NodeCouchDb();
            const viewUrl = "_design/by_date/_view/allData";

            //Database key
            const queryOptions = {
                startkey: [dataStartYear, dataStartMonth, dataStartDay, 0, 0, 0, 1],
                endkey: [dataEndYear, dataEndMonth, dataEndDay, 0, 0, 0, 3]
            };
            //Searching in the database
            couch.get("bubblot", viewUrl, queryOptions).then(({ data, headers, status }) => {
                //Loop for running through each data received
                for (var i = 0; i < data.rows.length; i++) {
                    //Get from which bubblot comes the data
                    var bubblotIndex = data.rows[i].key[6] - 1;
                    //Get the date of the measurement
                    $scope.dates[bubblotIndex].push([data.rows[i].key[0], data.rows[i].key[1], data.rows[i].key[2], data.rows[i].key[3], data.rows[i].key[4], data.rows[i].key[5]]);
                    if (i == 0) {
                        $scope.dataxPump.push(500);
                        $scope.datayPump.push(600);
                    }
                    //Get x y coordinates
                    $scope.datax[bubblotIndex].push(parseInt($scope.dataxPump) + parseInt(data.rows[i].value.distancexToPump));
                    $scope.datay[bubblotIndex].push(parseInt($scope.datayPump) + parseInt(data.rows[i].value.distanceyToPump));
                    //Get magnetism
                    $scope.avgMagnetism[bubblotIndex].push(parseFloat(data.rows[i].value.magnetism.mean));
                    //Get if there is VA
                    if (data.rows[i].value.VA.available) $scope.isVa[bubblotIndex].push(true);
                    else $scope.isVa[bubblotIndex].push(false);
                    //Get if there is Fe
                    if (data.rows[i].value.VA.fe) $scope.isFe[bubblotIndex].push(true);
                    else $scope.isFe[bubblotIndex].push(false);
                    //Get if there is Pb
                    if (data.rows[i].value.VA.pb) $scope.isPb[bubblotIndex].push(true);
                    else $scope.isPb[bubblotIndex].push(false);
                    //Get if there is Cu
                    if (data.rows[i].value.VA.cu) $scope.isCu[bubblotIndex].push(true);
                    else $scope.isCu[bubblotIndex].push(false);
                    //Get if there is Sn
                    if (data.rows[i].value.VA.sn) $scope.isSn[bubblotIndex].push(true);
                    else $scope.isSn[bubblotIndex].push(false);
                    //Get if there is turbidity
                    if (data.rows[i].value.turbidity.available) {
                        $scope.isTurbi[bubblotIndex].push(true);
                        //Get turbidity average values for each color
                        $scope.avgTurbi[bubblotIndex].push([data.rows[i].value.turbidity.avgRed, data.rows[i].value.turbidity.avgGreen, data.rows[i].value.turbidity.avgBlue]);
                    }
                    else {
                        $scope.isTurbi[bubblotIndex].push(false);
                        $scope.avgTurbi[bubblotIndex].push([null, null, null]);
                    }
                    //Get if there is a movie
                    if (data.rows[i].value.movie.available) $scope.isMovie[bubblotIndex].push(true);
                    else $scope.isMovie[bubblotIndex].push(false);
                }
                $scope.extractingData = !$scope.extractingData;
                // data is json response 
                // headers is an object with all response headers 
                // status is statusCode number 
            }, err => {
                console.log(err.code);
                // either request error occured 
                // ...or err.code=EDOCMISSING if document is missing 
                // ...or err.code=EUNKNOWN if statusCode is unexpected 
            });
        }
        //Init datasets for graph
        var initData = {
            datasets: [{
                borderColor: 'white',
                pointBackgroundColor: 'white',
                borderWidth: 2,
                pointRadius: 1,
                data: 0,
            }]
        };
        //Init graph in information panel 
        var graphInfoData;
        var context = $element.find("canvas")[0].getContext("2d");
        var graphInfo = new Chart(context, {
            type: 'line',
            data: initData,
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
                            fontColor: "white",
                            fontSize: 20,
                            labelString: 'V',
                        },
                        ticks: {
                            min: 0,
                            max: 5,
                            stepSize: 1,
                            fontColor: "white"
                        },
                        gridLines: {
                            display: true,
                            color: "white",
                        }
                    }],
                    yAxes: [{
                        type: 'linear',
                        position: 'left',
                        scaleLabel: {
                            display: true,
                            fontColor: "white",
                            fontSize: 20,
                            labelString: 'mA',
                        },
                        ticks: {
                            min: 0,
                            max: 1,
                            stepSize: 0.2,
                            fontColor: "white"
                        },
                        gridLines: {
                            display: true,
                            color: "white",
                        }
                    }]
                }
            }
        });
        //Update the information graph when clicking on map
        $scope.updateInfoPanel = function (element) {
            //If cursor is on VA spot, plot V-A graph
            if ($scope.vaCursor) {
                while(graphInfo.data.datasets.length>0){
                    graphInfo.data.datasets.pop();
                };
                graphInfo.data.datasets.push({
                    borderColor: 'white',
                    pointBackgroundColor: 'white',
                    borderWidth: 2,
                    pointRadius: 1,
                    data: $scope.infoVa,
                });
                graphInfo.options.scales.xAxes[0].ticks.max = 30;
                graphInfo.options.scales.xAxes[0].ticks.stepSize = 5;
                graphInfo.options.scales.xAxes[0].scaleLabel.labelString = "V";
                graphInfo.options.scales.yAxes[0].ticks.max = 20;
                graphInfo.options.scales.yAxes[0].ticks.stepSize = 5;
                graphInfo.options.scales.yAxes[0].scaleLabel.labelString = "mA";
                $scope.graphName = "V-A";
            }
            //If cursor click on turbidity spot, plot turbi graph
            else if ($scope.turbiCursor) {
                while(graphInfo.data.datasets.length>0){
                    graphInfo.data.datasets.pop();
                };
                graphInfo.data.datasets.push({
                    borderColor: 'red',
                    pointBackgroundColor: 'red',
                    borderWidth: 2,
                    pointRadius: 1,
                    data: $scope.infoTurbiRed,
                });
                graphInfo.data.datasets.push({
                    borderColor: 'green',
                    pointBackgroundColor: 'green',
                    borderWidth: 2,
                    pointRadius: 1,
                    data: $scope.infoTurbiGreen,
                });
                graphInfo.data.datasets.push({
                    borderColor: 'DodgerBlue',
                    pointBackgroundColor: 'DodgerBlue',
                    borderWidth: 2,
                    pointRadius: 1,
                    data: $scope.infoTurbiBlue,
                });
                graphInfo.options.scales.xAxes[0].ticks.max = 30;
                graphInfo.options.scales.xAxes[0].ticks.stepSize = 5;
                graphInfo.options.scales.xAxes[0].scaleLabel.labelString = "s";
                graphInfo.options.scales.yAxes[0].ticks.max = 100;
                graphInfo.options.scales.yAxes[0].ticks.stepSize = 20;
                graphInfo.options.scales.yAxes[0].scaleLabel.labelString = "%";
                $scope.graphName = "Turbidity";
            }
            //If cursor click on magnetic spot, plot magn graph
            else if ($scope.magnCursor) {
                while(graphInfo.data.datasets.length>0){
                    graphInfo.data.datasets.pop();
                };
                graphInfo.data.datasets.push({
                    borderColor: 'white',
                    pointBackgroundColor: 'white',
                    borderWidth: 2,
                    pointRadius: 1,
                    data: $scope.infoMagnetism,
                });
                graphInfo.data.datasets[0].data = $scope.infoMagnetism;
                graphInfo.options.scales.xAxes[0].ticks.max = 30;
                graphInfo.options.scales.xAxes[0].ticks.stepSize = 5;
                graphInfo.options.scales.xAxes[0].scaleLabel.labelString = "s";
                graphInfo.options.scales.yAxes[0].ticks.max = 5;
                graphInfo.options.scales.yAxes[0].ticks.stepSize = 1;
                graphInfo.options.scales.yAxes[0].scaleLabel.labelString = "T";
                $scope.graphName = "Magnetism";
            }
            //If cursor click on movie spot, plot movie
            else if ($scope.movieCursor) {
                $scope.graphName = "Video";
            }
            graphInfo.update();
        };
        function drawGraphVa(context) {
            var dataBar = [], dataX = [];

            for (var i = 0; i < 30; i++) {
                dataX.push("");
                if (i == 7 || i == 12 || i == 19 || i == 22) {
                    dataBar.push(1);
                }
                else {
                    dataBar.push(0);
                }
            }
            var vaData = {
                labels: dataX,
                datasets: [{
                    type: 'bar',
                    data: dataBar,
                    fill: true,
                    backgroundColor: 'red',
                    borderColor: 'red',
                },
                {
                    type: 'line',
                    data: $scope.infoVa,
                    borderColor: 'white',
                    pointBackgroundColor: 'white',
                    borderWidth: 2,
                    pointRadius: 1,
                }]
            };
            graphInfo = new Chart(context, {
                type: "bar",
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
                            position: "bottom",
                            display: true,
                            barPercentage: 0.8,
                            gridLines: {
                                display: false,
                                color: "white",
                            },
                            labels: {
                                show: false,
                            },
                            scaleLabel: {
                                display: true,
                                fontColor: "white",
                                fontSize: 20,
                                labelString: '[V]',
                            }
                        }],
                        yAxes: [{
                            type: 'linear',
                            position: 'left',
                            scaleLabel: {
                                display: true,
                                fontColor: "white",
                                fontSize: 20,
                                labelString: '[mA]',
                            },
                            ticks: {
                                min: 0,
                                max: 1,
                                fontColor: "white"
                            },
                            gridLines: {
                                display: true,
                                color: "white",
                            }
                        }]
                    }
                }
            });
        }
        function drawGraphMagnetism(context) {
            var magnetismData = {
                datasets: [{
                    borderColor: 'white',
                    pointBackgroundColor: 'white',
                    pointHoverBackgroundColor: '#000',
                    pointHoverBorderColor: '#000',
                    borderWidth: 2,
                    pointRadius: 1,
                    data: $scope.infoMagnetism
                }]
            };
            graphInfo = new Chart(context, {
                type: 'line',
                data: magnetismData,
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
                                fontColor: "white",
                                fontSize: 20,
                                labelString: '[s]',
                            },
                            ticks: {
                                min: 0,
                                max: 30,
                                stepSize: 5,
                                fontColor: "white"
                            },
                            gridLines: {
                                display: true,
                                color: "white",
                            }
                        }],
                        yAxes: [{
                            type: 'linear',
                            position: 'left',
                            scaleLabel: {
                                display: true,
                                fontColor: "white",
                                fontSize: 20,
                                labelString: '[T]',
                            },
                            ticks: {
                                min: 0,
                                max: 5,
                                fontColor: "white"
                            },
                            gridLines: {
                                display: true,
                                color: "white",
                            }
                        }]
                    }
                }
            });
        }
        function drawGraphTurbi(context) {
            var turbiData = {
                datasets: [{
                    borderColor: 'red',
                    pointBackgroundColor: 'red',
                    pointHoverBackgroundColor: '#000',
                    pointHoverBorderColor: '#000',
                    borderWidth: 2,
                    pointRadius: 1,
                    data: $scope.infoTurbiRed
                }, {
                    borderColor: 'green',
                    pointBackgroundColor: 'green',
                    pointHoverBackgroundColor: '#000',
                    pointHoverBorderColor: '#000',
                    borderWidth: 2,
                    pointRadius: 1,
                    data: $scope.infoTurbiGreen
                }, {
                    borderColor: 'blue',
                    pointBackgroundColor: 'blue',
                    pointHoverBackgroundColor: '#000',
                    pointHoverBorderColor: '#000',
                    borderWidth: 2,
                    pointRadius: 1,
                    data: $scope.infoTurbiBlue
                }
                ]
            };
            graphInfo = new Chart(context, {
                type: 'line',
                data: turbiData,
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
                                fontColor: "white",
                                fontSize: 20,
                                labelString: '[s]',
                            },
                            ticks: {
                                min: 0,
                                max: 30,
                                stepSize: 5,
                                fontColor: "white"
                            },
                            gridLines: {
                                display: true,
                                color: "white",
                            }
                        }],
                        yAxes: [{
                            type: 'linear',
                            position: 'left',
                            scaleLabel: {
                                display: true,
                                fontColor: "white",
                                fontSize: 20,
                                labelString: '[%]',
                            },
                            ticks: {
                                min: 0,
                                max: 100,
                                stepSize: 20,
                                fontColor: "white"
                            },
                            gridLines: {
                                display: true,
                                color: "white",
                            }
                        }]
                    }
                }
            });
        }
    }

}());
