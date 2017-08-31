/*jshint esversion: 6 */
angular.module('bubblot', []).controller('mainController', ['$scope', '$timeout', '$interval', function ($scope, $timeout, $interval) {
    var mainVm = this,
        serial = '',
        digitalio,
        digitalIoState = 64,
        servo1,
        servo2,
        servo3,
        servo4,
        tilt1,
        tilt2,
        compass,
        latitude,
        divHorizon,
        divHorizon2,
        div3DConnexion,
        div3DConnexion2,
        computeStyle = '',
        transitionTimeout,
        captureTimeout,
        receivedPitch = false,
        receivedRoll = false,
        receivedCompass = false,
        spacerx = 50,
        spacery = 50,
        errmsg = new YErrorMsg(),
        VSPRadiusMax = 400,
        VSP1Radius = 0,
        VSP1Angle = 0,
        VSP1AngleServo1 = 0,
        VSP1AngleServo2 = 0,
        VSP2Radius,
        VSP2Angle,
        VSP2AngleServo1,
        VSP2AngleServo2,
        VSP3Radius,
        VSP3Angle,
        VSP3AngleServo1,
        VSP3AngleServo2,
        VSP4Radius,
        VSP4Angle,
        VSP4AngleServo1,
        VSP4AngleServo2;

    mainVm.previousRoll = 0;
    mainVm.roll = 0;
    mainVm.previousPitch = 0;
    mainVm.pitch = 0;
    mainVm.previousYaw = 40;
    mainVm.yaw = 0;
    var previousSpeed1 = 0;
    var switchDirection1 = false;
    $scope.leftData = {
        focusLeftIndex: 0,
        positionClass: ["focus-left", "left-one", "left-two", "left-three", "left-four"],
        focusOrigClass: "left-five",
        horizonPitch: 0,
        horizonRoll: 0,
        twistLeft: false,
        twistRight: false,
        threeDAngle: 30,
        turbidity: 0.2,
        turbidityRed: 0.2,
        turbidityBlue: 0.2,
        turbidityGreen: 0.2,
        magnetism: 0.5,
        computeVa: false,
        vaData: [],
        pumpOn: false,
        filledOk: false,
        help: false
    };
    $scope.rightData = {
        focusRightIndex: 0,
        positionClass: ["focus-right", "right-one", "right-two", "right-three", "right-four"],
        focusOrigClass: "right-five",
        depth: 0.3,
        security: 60,
        securityAlert: false,
        ballastFill: 30,
        thrust: 0.1,
        thrustTopSwitchOn: true,
        thrustBottomSwitchOn: true,
        thrustDragOn: false,
        engine1Angle: -90,
        engine1Radius: 0,
        engine2Angle: -45,
        engine2Radius: 0,
        engine3Angle: 45,
        engine3Radius: 0,
        engine4Angle: 180,
        engine4Radius: 0,
        angleB1: 30,
        angleB2: 240,
        angleB3: 90,
        angleStorage: 30,
        angleNorth: 180,
        distancexToPump: 20,
        distanceyToPump: 20,
        spotlightIntensity: 75,
        foglightIntensity: 75,
        spotlightSwitchOn: true,
        foglightSwitchOn: true,
        cameraRec: false,
        cameraRecMenu: true,
        cameraPlay: false,
        help: false
    };
    $scope.leftDataPump = {
        focusLeftIndex: 0,
        positionClass: ["focus-left", "left-one"],
        focusOrigClass: "left-two",
        gpsCompass: -15,
        localLat: 12.583967,
        localLong: 32.985734,
        targetLat: 46.123432,
        targetLong: 36.023563,
        horizonPitch: 0,
        horizonRoll: 0

    };
    $scope.rightDataPump = {
        focusRightIndex: 0,
        positionClass: ["focus-right", "right-one", "right-two"],
        focusOrigClass: "right-three",
        powerNeedleAngle: 0,
        thrust: 0.4,
        depth: 0.7,
        security: 40,
        securityAlert: false,
        ballastFill: 70,
        thrust: 0.2,
        isCtrl: false,
        help: false
    };
    $scope.winderData = {
        mainControl: 0,
        winderControl1: 0,
        winderControl2: 0,
        winderControl3: 0,
        winderControl4: 0,
        winderLength1: 0,
        winderSpeed1: 0,
        pressure1: 0.93,
        minPressure1: 0.8,
        pressureAlert1: false,
        reset1: false,
        winderLength2: 0,
        winderSpeed2: 0,
        pressure2: 0.97,
        minPressure2: 0.7,
        pressureAlert2: false,
        reset2: false,
        winderLength3: 0,
        winderSpeed3: 0,
        pressure3: 0.95,
        minPressure3: 0.7,
        pressureAlert3: false,
        reset3: false,
        winderLength4: 0,
        winderSpeed4: 0,
        pressure4: 0.9,
        minPressure4: 0.7,
        pressureAlert4: false,
        reset4: false,
        railMode: false,
        railLength1: 0,
        railLength2: 0,
        help: false
    };
    $scope.mapData = {
        displayFe: false,
        displayPb: false,
        displayCu: false,
        displaySn: false,
        displayPath: true,
        displayVa: true,
        displayMovie: false,
        displayMagn: false,
        displayTurbi: false,
        extractingData: false,
        bubblots: [],
        bubblotCursor: 1,
        dates: [],
        dateCursor: [],
        latitudeCursor: [],
        longitudeCursor: [],
        depthCursor: [],
        tempCursor: [],
        dataxPump: [],
        datayPump: [],
        datax: new Array(3),
        datay: new Array(3),
        isVa: new Array(3),
        isFe: new Array(3),
        isPb: new Array(3),
        isCu: new Array(3),
        isSn: new Array(3),
        infoVa: [],
        isMovie: new Array(3),
        avgMagnetism: new Array(3),
        infoMagnetism: [],
        isTurbi: new Array(3),
        avgTurbi: new Array(3),
        infoTurbiRed: [],
        infoTurbiGreen: [],
        infoTurbiBlue: [],
        zoom: 1,
        xImage: 0,
        yImage: 0,
        xNew: 0,
        yNew: 0,
        xLast: 0,
        yLast: 0,
        vaCursor: false,
        turbiCursor: false,
        magnCursor: false,
        movieCursor: false,
        updatePanel: false
    };
    $scope.notifData = {
        bubblotSecurity: false,
        bubblotTwistLeft: false,
        bubblotTwistRight: false,
        audioBubblot: false,
        pumpSecurity: false,
        audioPump: false,
        winderPressure1: false,
        winderReset1: false,
        winderPressure2: false,
        winderReset2: false,
        winderPressure3: false,
        winderReset3: false,
        winderPressure4: false,
        winderReset4: false,
        audioWinder: false,
        recData: false,
        help: false
    };
    var bubblot1YoctoModules = {
        yPwmOutput1_LedTop: null,
        yPwmOutput1_LedBottom: null,
        yPwmOutput2_Jabsco: null,
        yGenericSensor_Security: null,
        yGenericSensor_Depth: null,
        yDigitalIO: null,
        yTilt_Roll: null,
        yTilt_Pitch: null,
        yCompass: null,
        yAccelerometer: null,
        yServo1_Camera: null,
        yServo1_VSPTopLeft_X: null,
        yServo1_VSPTopLeft_Y: null,
        yServo1_VSPTopRight_X: null,
        yServo1_VSPTopRight_Y: null,
        yServo2_Thrust: null,
        yServo2_VSPBottomLeft_X: null,
        yServo2_VSPBottomLeft_Y: null,
        yServo2_VSPBottomRight_X: null,
        yServo2_VSPBottomRight_Y: null,
        yGps_Longitude: null,
        yGps_Latitude: null,
        yColorLedCluster_Turbidity: null,
        yTemperature: null,
        yAnButton_turbidity: null
    }

    var serialBubblot1 = {
        yPwmOutput1: 'PWM1_12345',
        yPwmOutput2: 'PWM2_12345',
        yGenericSensor: 'RX010V_12345',
        yDigitalIO: 'MAXIO_12345',
        yTilt: 'Y3DMK001-68844',
        yCompass: 'Y3DMK001-69321',
        yAccelerometer: 'Y3DMK001-69321',
        yGps: 'GPS_12345',
        //yServo1: 'SERVORC1-510C2',
        yServo2: 'SERVORC1-510C2',
        yColorLedCluster: 'YRGBLED2-7F244',
        yTemperature: 'TMPSENS1-68156',
        yAnButton: 'YBUTTON1-80841',
    }

    var pumpYoctoModules = {
        yGenericSensor_Security: null,
        yGenericSensor_Depth: null,
        yDigitalIO: null,
        yTilt_Roll: null,
        yTilt_Pitch: null,
        yCompass: null,
        yServo1_VSPTopLeft_X: null,
        yServo1_VSPTopLeft_Y: null,
        yServo1_VSPTopRight_X: null,
        yServo1_VSPTopRight_Y: null,
        yServo2_Thrust: null,
        yServo2_VSPBottomLeft_X: null,
        yServo2_VSPBottomLeft_Y: null,
        yServo2_VSPBottomRight_X: null,
        yServo2_VSPBottomRight_Y: null,
        yGps_Longitude: null,
        yGps_Latitude: null,
        yPwmOutput_pump: null,
    }

    var serialPump = {
        yPwmOutput:'YPWMTX01-4FFB9',
    }

    var winderYoctoModules = {
        yRelay1_Winder1Forward: null,
        yRelay1_Winder1Backward: null,
        yPwmOutput1_Winder1Speed: null,
        yPwmInput1_Winder1Length: null
    }

    var serialWinder = {
        yRelay1: 'RELAYLO1-79765',
        yPwmOutput1: 'YPWMTX01-4FFB9',
        yPwmInput1: 'YPWMRX01-79FB9'
    }

    function connectYoctoBubblot(ipaddress, serials, modules) {
        var YAPI = _yocto_api.YAPI;
        YAPI.LogUnhandledPromiseRejections().then(() => {
            return YAPI.DisableExceptions();
        }
        ).then(() => {
            // Setup the API to use the VirtualHub on local machine
            return YAPI.RegisterHub('http://' + ipaddress + ':4444', errmsg);
        }
            ).then((res) => {
                if (res != YAPI.SUCCESS) {
                    console.log('Cannot contact VirtualHub on ' + ipaddress + ': ' + errmsg.msg);
                    return;
                }
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to tilt module
                modules.yTilt_Roll = YTilt.FindTilt(serials.yTilt + ".tilt1");
                modules.yTilt_Roll.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device 3D Tilt ' + serials.yTilt);
                        modules.yTilt_Roll.registerValueCallback(computeRoll);
                    }
                    else {
                        console.log("Can't find module " + serials.yTilt + ".tilt1");
                    }
                })
                modules.yTilt_Pitch = YTilt.FindTilt(serials.yTilt + ".tilt2");
                modules.yTilt_Pitch.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device 3D Tilt ' + serials.yTilt);
                        modules.yTilt_Pitch.registerValueCallback(computePitch);
                    }
                    else {
                        console.log("Can't find module " + serials.yTilt + ".tilt2");
                    }
                })
                //Connexion to compass module
                modules.yCompass = YCompass.FindCompass(serials.yCompass + ".compass");
                modules.yCompass.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device 3D Compass ' + serials.yCompass);
                        modules.yCompass.registerValueCallback(computeCompass);
                    }
                    else {
                        console.log("Can't find module " + serials.yCompass + ".compass");
                    }
                })
                //Connexion to accelerometer module
                modules.yAccelerometer = YAccelerometer.FindAccelerometer(serials.yAccelerometer + ".accelerometer");
                modules.yAccelerometer.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device 3D Accelerometer ' + serials.yAccelerometer);
                        modules.yAccelerometer.set_gravityCancellation(Y_ENABLED_TRUE);
                        modules.yAccelerometer.registerValueCallback(computeAcc);
                    }
                    else {
                        console.log("Can't find module " + serials.yAccelerometer + ".accelerometer");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to GPS module
                modules.yGps_Latitude = YGps.FindGps(serials.yGps + ".latitude");
                modules.yGps_Latitude.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device GPS ' + serials.yGps);
                        modules.yGps_Latitude.registerValueCallback(computeLatitude);
                    }
                    else {
                        console.log("Can't find module " + serials.yGps + ".latitude");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connextion to Digital-IO module
                modules.yDigitalIO = YDigitalIO.FindDigitalIO(serials.yDigitalIO + ".digitalIO");
                modules.yDigitalIO.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device Digital-IO ' + serials.yDigitalIO);
                        modules.yDigitalIO.set_portDirection(252);
                        modules.yDigitalIO.set_portPolarity(0); // polarity set to regular
                        modules.yDigitalIO.set_portOpenDrain(3);
                        modules.yDigitalIO.get_portState().then((value) => {
                        });
                    }
                    else {
                        console.log("Can't find module " + serials.yDigitalIO + ".digitalIO");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to servo module
                modules.yServo1_Camera = YServo.FindServo(serials.yServo2 + ".servo1");
                modules.yServo1_Camera.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device Servo 1' + serials.yServo2);
                    }
                    else {
                        console.log("Can't find module " + serials.yServo2 + ".servo1");
                    }
                })
                modules.yServo1_VSPTopLeft_X = YServo.FindServo(serials.yServo2 + ".servo3");
                modules.yServo1_VSPTopLeft_X.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device Servo 3' + serials.yServo2);
                        modules.yServo1_VSPTopLeft_X.set_position(0);
                    }
                    else {
                        console.log("Can't find module " + serials.yServo2 + ".servo3");
                    }
                })
                modules.yServo1_VSPTopLeft_Y = YServo.FindServo(serials.yServo2 + ".servo2");
                modules.yServo1_VSPTopLeft_Y.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device Servo 2' + serials.yServo2);
                        modules.yServo1_VSPTopLeft_Y.set_position(0);
                    }
                    else {
                        console.log("Can't find module " + serials.yServo2 + ".servo2");
                    }
                })
                modules.yServo2_Thrust = YServo.FindServo(serials.yServo2 + ".servo4");
                modules.yServo2_Thrust.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device Servo 3' + serials.yServo2);
                    }
                    else {
                        console.log("Can't find module " + serials.yServo2 + ".servo4");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to temperature module
                modules.yTemperature = YTemperature.FindTemperature(serials.yTemperature + ".temperature");
                modules.yTemperature.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device temperature ' + serials.yTemperature);
                        modules.yTemperature.registerValueCallback(computeTemp);
                    }
                    else {
                        console.log("Can't find module " + serials.yTemperature + ".temperature");
                    }
                })
            }
            );
        var YAPI2 = _yocto_api.YAPI;
        YAPI2.LogUnhandledPromiseRejections().then(() => {
            return YAPI2.DisableExceptions();
        }
        ).then(() => {
            // Setup the API to use the VirtualHub on local machine
            return YAPI2.RegisterHub('http://' + 'localhost' + ':4444', errmsg);
        }
            ).then((res) => {
                if (res != YAPI2.SUCCESS) {
                    console.log('Cannot contact VirtualHub on ' + 'localhost' + ':4444' + errmsg.msg);
                    return;
                }
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to anbutton module
                console.log('Using device anbutton ' + serials.yAnButton);
                modules.yAnButton_Turbidity = YAnButton.FindAnButton(serials.yAnButton + ".anButton2");
                modules.yAnButton_Turbidity.isOnline().then((onLine) => {
                    if (onLine) {
                        modules.yAnButton_Turbidity.registerValueCallback(computeTurbidity);
                    }
                    else {
                        console.log("Can't find module " + serials.yAnButton + ".anButton1");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to led module
                console.log('Using device Color Led ' + serials.yColorLedCluster);
                modules.yColorLedCluster_Turbidity = YColorLedCluster.FindColorLedCluster(serials.yColorLedCluster);
                modules.yColorLedCluster_Turbidity.isOnline().then((onLine) => {
                    if (onLine) {
                    }
                    else {
                        console.log("Can't find module " + serials.yColorLedCluster);
                    }
                })
            }
            );
    }

    function connectYoctoPump(ipaddress, serials, modules) {
        var YAPI = _yocto_api.YAPI;
        console.log(ipaddress, serials, modules);
        YAPI.LogUnhandledPromiseRejections().then(() => {
            return YAPI.DisableExceptions();
        }
        ).then(() => {
            // Setup the API to use the VirtualHub on local machine
            return YAPI.RegisterHub('http://' + ipaddress + ':4444', errmsg);
        }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to Pwm Tx module
                modules.yPwmOutput_pump = YPwmOutput.FindPwmOutput(serials.yPwmOutput + ".pwmOutput1");
                modules.yPwmOutput_pump.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using Pump PWM Tx' + serials.yPwmOutput);
                        modules.yPwmOutput_pump.set_frequency(20000);
                        modules.yPwmOutput_pump.set_enabled(Y_ENABLED_TRUE);
                        modules.yPwmOutput_pump.set_dutyCycle(0);
                    }
                    else {
                        console.log("Can't find module " + serials.yPwmOutput + ".pwmOutput1");
                    }
                })
            }
            );
    }

    function connectYoctoWinder(ipaddress, serials, modules) {
        var YAPI = _yocto_api.YAPI;
        YAPI.LogUnhandledPromiseRejections().then(() => {
            return YAPI.DisableExceptions();
        }
        ).then(() => {
            // Setup the API to use the VirtualHub on local machine
            return YAPI.RegisterHub('http://' + 'localhost' + ':4444', errmsg);
        }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to relay module
                modules.yRelay1_Winder1Forward = YRelay.FindRelay(serials.yRelay1 + ".relay1");
                modules.yRelay1_Winder1Forward.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device Relay ' + serials.yRelay1 + ".relay1");
                    }
                    else {
                        console.log("Can't find module " + serials.yRelay1 + ".relay1");
                    }
                })
                modules.yRelay1_Winder1Backward = YRelay.FindRelay(serials.yRelay1 + ".relay2");
                modules.yRelay1_Winder1Backward.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device Relay ' + serials.yRelay1);
                    }
                    else {
                        console.log("Can't find module " + serials.yRelay1 + ".relay2");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to PWM output module
                modules.yPwmOutput1_Winder1Speed = YPwmOutput.FindPwmOutput(serials.yPwmOutput1 + ".pwmOutput1");
                modules.yPwmOutput1_Winder1Speed.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device PWM Tx ' + serials.yPwmOutput1);
                        modules.yPwmOutput1_Winder1Speed.set_frequency(5000);
                        modules.yPwmOutput1_Winder1Speed.set_enabled(Y_ENABLED_TRUE);
                        modules.yPwmOutput1_Winder1Speed.set_dutyCycle(0);
                    }
                    else {
                        console.log("Can't find module " + serials.yPwmOutput1 + ".pwmOutput1");
                    }
                })
            }
            ).then(() => {
                // by default use any connected module suitable for the demo
                //Connexion to PWM input module
                modules.yPwmInput1_Winder1Length = YPwmInput.FindPwmInput(serials.yPwmInput1 + ".pwmInput1");
                modules.yPwmInput1_Winder1Length.isOnline().then((onLine) => {
                    if (onLine) {
                        console.log('Using device PWM Rx ' + serials.yPwmInput1);
                        modules.yPwmInput1_Winder1Length.resetCounter();
                        modules.yPwmInput1_Winder1Length.get_pulseCounter().then((value) => {

                        });
                    }
                    else {
                        console.log("Can't find module " + serials.yPwmInput1 + ".pwmInput1");
                    }
                });
            }
            );
    }
    var serialPortOpenOptions = {
        baudRate: 115200,
        dataBits: 8,
        parity: 'none',
        stopBits: 1
    };
    //Open serialport for DropSens sensor
    var serialPort = new SerialPort('COM9', serialPortOpenOptions, function (err) { if (err) console.error('Error opening port'); });

    var couch, couchExternal, couchAuth;
    function init() {
        //Connect to Yocto modules
       // connectYoctoBubblot("169.254.93.133", serialBubblot1, bubblot1YoctoModules);
        connectYoctoBubblot("169.254.58.33", serialBubblot1, bubblot1YoctoModules);
        // connectYoctoWinder("192.168.137.18", serialWinder, winderYoctoModules);
        // connectYoctoPump("169.254.58.33", serialPump, pumpYoctoModules);
        setInterval(computeWinderLength, 1000);

        var writeToSerial = ['$V;', '$Ltech=01;'];
        var indexSerial = 0;
        var vaPotential, vaCurrent;
        var tempStringData = [], serialAllData = [], packageTransmitted = 0, flag = false;
        serialPort.on('open', function () {
            console.log('Serialport opened, writing ' + writeToSerial[indexSerial]);
            serialPort.write(writeToSerial[indexSerial]);
            indexSerial++;
        });
        //Callback function for DropsSens sensor 
        serialPort.on('data', function (data) {
            //console.log('Data received: ', data.length);
            //console.log(new Uint16Array(data));
            var serialStringData = String.fromCharCode.apply(null, new Uint16Array(data));
            console.log('Serialport: received')
            console.log(serialStringData);
            if (serialStringData[serialStringData.length - 3] = ';' && indexSerial < writeToSerial.length) {
                console.log('Serialport: writing ' + writeToSerial[indexSerial]);
                serialPort.write(writeToSerial[indexSerial]);
                indexSerial++;
            }
            else if ($scope.leftData.computeVa) {
                if (packageTransmitted == 0 && serialStringData[serialStringData.length - 1].charCodeAt() == 10) {
                    packageTransmitted = 1;
                    console.log("Serialport: Computing VA measurement... ");
                }
                else if (packageTransmitted == 1) {
                    if (serialStringData[serialStringData.length - 4] != "E") {
                        tempStringData = tempStringData + serialStringData;
                        flag = true;
                    }
                    else if (serialStringData[serialStringData.length - 4] == "E" && flag) {
                        flag = false;
                        serialAllData = tempStringData + serialStringData;
                        tempStringData = [];
                        packageTransmitted = 2;
                        console.log("Serialport: VA measurement results");
                        console.log(serialAllData);
                    }
                    else if (serialStringData[serialStringData.length - 4] == "E") {
                        serialAllData = serialStringData;
                        packageTransmitted = 2;
                        console.log("Serialport: VA measurement results");
                        console.log(serialAllData);
                    }
                }
                if (packageTransmitted == 2) {
                    console.log("Serialport: Data");
                    for (var i = 0; i < (serialAllData.length - 5) / 25; i++) {
                        vaPotential = 0;
                        vaCurrent = 0;
                        for (j = 0; j < 4; j++) {
                            var asciiCodeData = serialAllData[i * 25 + j + 10].charCodeAt();
                            if (asciiCodeData <= 57 && asciiCodeData > 48) {
                                vaPotential = vaPotential + (asciiCodeData - 48) * Math.pow(16, 3 - j);
                            }
                            else if (asciiCodeData <= 70 && asciiCodeData >= 65) {
                                vaPotential = vaPotential + (asciiCodeData + 10 - 65) * Math.pow(16, 3 - j);
                            }
                        }
                        for (j = 0; j < 4; j++) {
                            var asciiCodeData = serialAllData[i * 25 + j + 2].charCodeAt();
                            if (asciiCodeData <= 57 && asciiCodeData > 48) {
                                vaCurrent = vaCurrent + (asciiCodeData - 48) * Math.pow(16, 3 - j);
                            }
                            else if (asciiCodeData <= 70 && asciiCodeData >= 65) {
                                vaCurrent = vaCurrent + (asciiCodeData + 10 - 65) * Math.pow(16, 3 - j);
                            }
                        }
                        console.log("Applied potential: " + vaPotential / 1000 + " V " + "Current on electrode 1: " + vaCurrent + " mV*2");
                    }
                    packageTransmitted = 0;
                    $scope.leftData.computeVa = false;
                }
            }
        });

        $scope.$watch('leftData.computeVa', function (value) {
            if (value) {
                vaPotential = 0;
                console.log('serialPort writing $R;');
                serialPort.write('$R;');
            }
        });
        // node-couchdb instance with default options 
        couch = new NodeCouchDb();

        // node-couchdb instance with Memcached 
        /*const MemcacheNode = require('node-couchdb-plugin-memcached');
        const couchWithMemcache = new NodeCouchDb({
            cache: new MemcacheNode
        });*/

        // node-couchdb instance talking to external service 
        couchExternal = new NodeCouchDb({
            host: 'localhost',
            protocol: 'http',
            port: 5984
        });

        // not admin party 
        couchAuth = new NodeCouchDb({
            auth: {
                user: 'admin',
                pass: 'admin'
            }
        });

        //Terminal command for starting HotSpot: netsh wlan start hostednetwork
        //require('nw.gui').Window.get().showDevTools(); alert('pause'); debugger;

        if (module3dconnexion) {
            module3dconnexion.init3dConnexion("Bubblot NW");
        }
        transitionTimeout = $timeout(getValues, 500);
        setInterval(getEvent, 200);
        //Keyboard shortcuts
        var isOne = false, isTwo = false, isThree = false, isFour = false;
        document.onkeydown = function (e) {
            var keyCode = e.keyCode;
            //F1 is pressed
            if (keyCode == 112) {
                //Show shortcut help
                $scope.notifData.help = true;
                $scope.leftData.help = true;
                $scope.rightData.help = true;
                $scope.rightDataPump.help = true;
                $scope.winderData.help = true;
                $scope.$apply();
            }
            //1 is pressed
            else if (keyCode == 49) {
                isOne = true;
            }
            //2 is pressed
            else if (keyCode == 50) {
                isTwo = true;
            }
            //3 is pressed
            else if (keyCode == 51) {
                isThree = true;
            }
            //4 is pressed
            else if (keyCode == 52) {
                isFour = true;
            }
            //Ctrl is pressed
            else if (keyCode == 17) {
                $scope.rightDataPump.isCtrl = true;
            }
        };
        document.onkeyup = function (e) {
            var keyCode = e.keyCode;
            //F1 is released
            if (keyCode == 112) {
                //Hide shortcut help
                $scope.notifData.help = false;
                $scope.leftData.help = false;
                $scope.rightData.help = false;
                $scope.rightDataPump.help = false;
                $scope.winderData.help = false;
                $scope.$apply();
            }
            //1 is released
            else if (keyCode == 49) {
                isOne = false;
            }
            //2 is released
            else if (keyCode == 50) {
                isTwo = false;
            }
            //3 is released
            else if (keyCode == 51) {
                isThree = false;
            }
            //4 is released
            else if (keyCode == 52) {
                isFour = false;
            }
            //Ctrl is released
            else if (keyCode == 17) {
                $scope.rightDataPump.isCtrl = false;
            }
            //S is released
            else if (keyCode == 83 && $('#winderDisplay').is(':visible')) {
                $scope.winderData.mainControl = 0;
                $scope.winderData.winderControl1 = 0;
                $scope.winderData.winderControl2 = 0;
                $scope.winderData.winderControl3 = 0;
                $scope.winderData.winderControl4 = 0;
                $scope.$apply();
            }
            //R is released
            else if (keyCode == 82 && $('#winderDisplay').is(':visible')) {
                $scope.winderData.winderControl1 = 0;
                $scope.winderData.winderControl2 = 0;
                $scope.winderData.winderControl3 = 0;
                $scope.winderData.winderControl4 = 0;
                $scope.$apply();
            }
        };
        //Scroll winder control with keyboard shortcuts 
        var winderScreen = document.getElementById('winderDisplay');
        winderScreen.addEventListener("wheel", function () {
            var clientRect = winderScreen.getBoundingClientRect();
            var minX = clientRect.left + (clientRect.width / 5);
            var maxX = clientRect.right - (clientRect.width / 5);
            if (event.screenX > minX && event.screenX < maxX) {
                if (isOne && !$scope.winderData.railMode) {
                    if ($scope.winderData.winderControl1 <= 0.5 && $scope.winderData.winderControl1 >= -0.5) {
                        $scope.winderData.winderControl1 = $scope.winderData.winderControl1 - event.deltaY / 1000;
                        if ($scope.winderData.winderControl1 > 0.5) {
                            $scope.winderData.winderControl1 = 0.5;
                        }
                        else if ($scope.winderData.winderControl1 < -0.5) {
                            $scope.winderData.winderControl1 = -0.5;
                        }
                        $scope.$apply();
                    }
                }
                else if (isTwo && !$scope.winderData.railMode) {
                    if ($scope.winderData.winderControl2 <= 0.5 && $scope.winderData.winderControl2 >= -0.5) {
                        $scope.winderData.winderControl2 = $scope.winderData.winderControl2 - event.deltaY / 1000;
                        if ($scope.winderData.winderControl2 > 0.5) {
                            $scope.winderData.winderControl2 = 0.5;
                        }
                        else if ($scope.winderData.winderControl2 < -0.5) {
                            $scope.winderData.winderControl2 = -0.5;
                        }
                        $scope.$apply();
                    }
                }
                else if (isThree && !$scope.winderData.railMode) {
                    if ($scope.winderData.winderControl3 <= 0.5 && $scope.winderData.winderControl3 >= -0.5) {
                        $scope.winderData.winderControl3 = $scope.winderData.winderControl3 - event.deltaY / 1000;
                        if ($scope.winderData.winderControl3 > 0.5) {
                            $scope.winderData.winderControl3 = 0.5;
                        }
                        else if ($scope.winderData.winderControl3 < -0.5) {
                            $scope.winderData.winderControl3 = -0.5;
                        }
                        $scope.$apply();
                    }
                }
                else if (isFour && !$scope.winderData.railMode) {
                    if ($scope.winderData.winderControl4 <= 0.5 && $scope.winderData.winderControl4 >= -0.5) {
                        $scope.winderData.winderControl4 = $scope.winderData.winderControl4 - event.deltaY / 1000;
                        if ($scope.winderData.winderControl4 > 0.5) {
                            $scope.winderData.winderControl4 = 0.5;
                        }
                        else if ($scope.winderData.winderControl4 < -0.5) {
                            $scope.winderData.winderControl4 = -0.5;
                        }
                        $scope.$apply();
                    }
                }
                else {
                    if ($scope.winderData.mainControl <= 0.5 && $scope.winderData.mainControl >= -0.5) {
                        $scope.winderData.mainControl = $scope.winderData.mainControl - event.deltaY / 5000;
                        if ($scope.winderData.mainControl > 0.5) {
                            $scope.winderData.mainControl = 0.5;
                        }
                        else if ($scope.winderData.mainControl < -0.5) {
                            $scope.winderData.mainControl = -0.5;
                        }
                        $scope.$apply();
                    }
                }
            }

        });
        var j = 0;
        $scope.$watch('leftData.pumpOn', function (value) {
            /*
            if (bubblot1YoctoModules.yColorLedCluster_Turbidity) {
                if (value){
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.resetBlinkSeq(0);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0xFF0000, 0);
                        setInterval(computeAverageTurbidity, 500);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0xFF0000, 500);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0x00FF00, 0);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0x00FF00, 500);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0x0000FF, 0);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.addRgbMoveToBlinkSeq(0, 0x0000FF, 500);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.linkLedToBlinkSeq(0, 2, 0, 0);
                        bubblot1YoctoModules.yColorLedCluster_Turbidity.startBlinkSeq(0);
                } 
                else{
                    bubblot1YoctoModules.yColorLedCluster_Turbidity.stopBlinkSeq(0);
                    bubblot1YoctoModules.yColorLedCluster_Turbidity.resetBlinkSeq(0);
                    bubblot1YoctoModules.yColorLedCluster_Turbidity.rgb_move(0, 2, 0x000000, 0);
                } 
            }
            */
            if (value) $scope.leftData.turbidityData = [];
        });
        $scope.$watch('rightData.spotlightSwitchOn', function (value) {
            if (digitalio) {
                if (value) {
                    digitalIoState |= 64;
                } else {
                    digitalIoState &= 255 - 64;
                }
                digitalio.set_portState(digitalIoState);
            }
        });
        $scope.$watch('rightData.foglightSwitchOn', function (value) {
            if (digitalio) {
                if (value) {
                    digitalIoState |= 128;
                } else {
                    digitalIoState &= 255 - 128;
                }
                digitalio.set_portState(digitalIoState);
            }
        });
        $scope.$watch('leftData.threeDAngle', function (value) {
            if (bubblot1YoctoModules.yServo1_Camera) {
                bubblot1YoctoModules.yServo1_Camera.set_position((value - 38) / 16 * 2000);
            }
        });
        $scope.$watch('rightData.thrust', function (value) {
            if (bubblot1YoctoModules.yServo2_Thrust) {
                bubblot1YoctoModules.yServo2_Thrust.set_position((value - 0.5) * 2000);
            }
        });
        $scope.$watch('winderData.mainControl', function (value) {
            if ($scope.winderData.railMode) {
                $scope.winderData.winderSpeed1 = value * 11;
                $scope.winderData.winderSpeed2 = value * 11;
            }
            else {
                $scope.winderData.winderSpeed1 = value * 10 + $scope.winderData.winderControl1;
                $scope.winderData.winderSpeed2 = value * 10 + $scope.winderData.winderControl2;
                $scope.winderData.winderSpeed3 = value * 10 + $scope.winderData.winderControl3;
                $scope.winderData.winderSpeed4 = value * 10 + $scope.winderData.winderControl4;
            }
        });
        $scope.$watch('winderData.winderControl1', function (value) {
            $scope.winderData.winderSpeed1 = $scope.winderData.mainControl * 10 + value;
        });
        $scope.$watch('winderData.winderControl2', function (value) {
            $scope.winderData.winderSpeed2 = $scope.winderData.mainControl * 10 + value;
        });
        $scope.$watch('winderData.winderControl3', function (value) {
            $scope.winderData.winderSpeed3 = $scope.winderData.mainControl * 10 + value;
        });
        $scope.$watch('winderData.winderControl4', function (value) {
            $scope.winderData.winderSpeed4 = $scope.winderData.mainControl * 10 + value;
        });
        $scope.$watch('winderData.winderSpeed1', function (value) {
            if (previousSpeed1 * value < 0) {
                switchDirection1 = true;
                //Stop de motor and wait 5s before switching direction
                if (winderYoctoModules.yPwmOutput1_Winder1Speed) {
                    winderYoctoModules.yPwmOutput1_Winder1Speed.set_dutyCycle(0);
                    setTimeout(switchDirection1Ok, 5000);
                }
            }
            previousSpeed1 = value;
            if (winderYoctoModules.yPwmOutput1_Winder1Speed && !switchDirection1) {
                winderYoctoModules.yPwmOutput1_Winder1Speed.set_dutyCycle(Math.abs(value) / 5.5 * 100);
            }
        });
        $scope.$watch('winderData.pressureAlert1', function (value) {
            $scope.notifData.winderPressure1 = value;
        });
        $scope.$watch('winderData.pressureAlert2', function (value) {
            $scope.notifData.winderPressure2 = value;
        });
        $scope.$watch('winderData.pressureAlert3', function (value) {
            $scope.notifData.winderPressure3 = value;
        });
        $scope.$watch('winderData.pressureAlert4', function (value) {
            $scope.notifData.winderPressure4 = value;
        });
        $scope.$watch('winderData.reset1', function (value) {
            $scope.notifData.winderReset1 = value;
        });
        $scope.$watch('winderData.reset2', function (value) {
            $scope.notifData.winderReset2 = value;
        });
        $scope.$watch('winderData.reset3', function (value) {
            $scope.notifData.winderReset3 = value;
        });
        $scope.$watch('winderData.reset4', function (value) {
            $scope.notifData.winderReset4 = value;
        });
        $scope.$watch('rightData.securityAlert', function (value) {
            $scope.notifData.bubblotSecurity = value;
        });
        $scope.$watch('leftData.twistLeft', function (value) {
            $scope.notifData.bubblotTwistLeft = value;
        });
        $scope.$watch('leftData.twistRight', function (value) {
            $scope.notifData.bubblotTwistRight = value;
        });
        $scope.$watch('rightDataPump.securityAlert', function (value) {
            $scope.notifData.pumpSecurity = value;
        });
        var audioBubblot = document.getElementById("audio-alert-bubblot");
        $scope.$watch('notifData.audioBubblot', function (value) {
            if (value) {
                audioBubblot.play();
            }
            else {
                audioBubblot.pause();
                audioBubblot.currentTime = 0;
            }
        });
        var audioPump = document.getElementById("audio-alert-pump");
        $scope.$watch('notifData.audioPump', function (value) {
            if (value) {
                audioPump.play();
            }
            else {
                audioPump.pause();
                audioPump.currentTime = 0;
            }
        });
        var audioWinder = document.getElementById("audio-alert-winder");
        $scope.$watch('notifData.audioWinder', function (value) {
            if (value) {
                audioWinder.play();
            }
            else {
                audioWinder.pause();
                audioWinder.currentTime = 0;
            }
        });
        var intervalDataSave;
        $scope.$watch('notifData.recData', function (value) {
            if ($scope.notifData.recData) intervalDataSave = setInterval(saveData, 2000);
            else clearInterval(intervalDataSave);
        });
    }
    var bubblotDeltaRoll = 0, bubblotPreviousDeltaRoll = 0, bubblotRoll = 0;
    var bubblotDeltaPitch = 0, bubblotPreviousDeltaPitch = 0, bubblotPitch = 0;
    var bubblotDeltaYaw = 0, bubblotPreviousDeltaYaw = 0, bubblotYaw = 0;
    var bubblotDeltaX = 0, bubblotRelatX = 0, bubblotRelatVX = 0, accX;
    var bubblotDeltaY = 0, bubblotRelatY = 0, bubblotRelatVY = 0, accY;
    var bubblotDeltaZ = 0, bubblotRelatZ = 0, bubblotRelatVZ = 0, accZ;
    function getEvent() {
        if (module3dconnexion) {
            var result = module3dconnexion.get3dEvent();
            if (result !== "") {
                var spwData = JSON.parse(result);
                //Calcul angle et rayon des vecteurs VSP en fonction du 3Dconnexion si drag pas activé
                if ($scope.rightData.thrustDragOn == false && $('#bubblotDisplay').is(':visible')) {
                    if (spwData.rx > VSPRadiusMax) {
                        spwData.rx = VSPRadiusMax;
                    }
                    if (spwData.rx < -VSPRadiusMax) {
                        spwData.rx = -VSPRadiusMax;
                    }
                    if (spwData.rz > VSPRadiusMax) {
                        spwData.rz = VSPRadiusMax;
                    }
                    if (spwData.rz < -VSPRadiusMax) {
                        spwData.rz = -VSPRadiusMax;
                    }
                    if (spwData.rz == 0) {
                        if (-spwData.rx > 0) {
                            $scope.rightData.engine1Angle = 90;
                        }
                        else {
                            $scope.rightData.engine1Angle = 270;
                        }
                    }
                    else if (spwData.rz < 0) $scope.rightData.engine1Angle = 180 / Math.PI * Math.atan(-spwData.rx / spwData.rz) + 180;
                    else if (-spwData.rx < 0) $scope.rightData.engine1Angle = 180 / Math.PI * Math.atan(-spwData.rx / spwData.rz) + 360;
                    else $scope.rightData.engine1Angle = 180 / Math.PI * Math.atan(-spwData.rx / spwData.rz);
                    $scope.rightData.engine1Radius = (spwData.rz * spwData.rz + spwData.rx * spwData.rx) / (VSPRadiusMax * VSPRadiusMax) * 80;
                    /*
                    bubblotDeltaRoll = -spwData.rz / VSPRadiusMax * 45;
                    bubblotDeltaPitch = -spwData.rx / VSPRadiusMax * 45;
                    bubblotDeltaYaw = -spwData.ry / VSPRadiusMax * 45;
                    if (Math.abs(spwData.rz) > Math.abs(spwData.rx) && Math.abs(spwData.rz) > Math.abs(spwData.ry) &&
                        ((bubblotDeltaRoll > 5 && bubblotDeltaRoll > bubblotPreviousDeltaRoll) ||
                            (bubblotDeltaRoll < -5 && bubblotDeltaRoll < bubblotPreviousDeltaRoll))) {
                        bubblotRoll = mainVm.roll + parseInt(bubblotDeltaRoll);
                        bubblotPitch = mainVm.pitch;
                        bubblotYaw = mainVm.yaw;
                        regulPosition();
                    }
                    else if (Math.abs(spwData.rx) > Math.abs(spwData.ry) &&
                        (bubblotDeltaPitch > 5 && bubblotDeltaPitch > bubblotPreviousDeltaPitch) ||
                        (bubblotDeltaPitch < -5 && bubblotDeltaPitch < bubblotPreviousDeltaPitch)) {
                        bubblotPitch = mainVm.pitch + parseInt(bubblotDeltaPitch);
                        bubblotRoll = mainVm.roll;
                        bubblotYaw = mainVm.yaw;
                        regulPosition();
                    }
                    else if ((bubblotDeltaYaw > 5 && bubblotDeltaYaw > bubblotPreviousDeltaYaw) ||
                        (bubblotDeltaYaw < -5 && bubblotDeltaYaw < bubblotPreviousDeltaYaw)) {
                        bubblotYaw = mainVm.yaw + parseInt(bubblotDeltaYaw);
                        bubblotPitch = mainVm.pitch;
                        bubblotRoll = mainVm.roll;
                        regulPosition();
                    }
                    bubblotPreviousDeltaRoll = bubblotDeltaRoll;
                    bubblotPreviousDeltaPitch = bubblotDeltaPitch;
                    bubblotPreviousDeltaYaw = bubblotDeltaYaw;
                    */

                }
                /*else {
                    spacerx = 50 + parseFloat(spwData.rx) / 10;
                    spacery = 50 + parseFloat(spwData.rz) / 10;
                    if (!div3DConnexion) {
                        div3DConnexion = $("#fond-marin #indicator3dconnexion")[0];
                        div3DConnexion2 = $("#fond-marin2 #indicator3dconnexion")[0];
                    }
                    div3DConnexion.style.top = spacerx + '%';
                    div3DConnexion.style.left = spacery + '%';
                    div3DConnexion2.style.top = spacerx + '%';
                    div3DConnexion2.style.left = spacery + '%';
                    $scope.$apply();
                }*/
            }
        }

        //Calcul angles des servos en fonction du rayon et de l'angle des vecteurs VSP
        VSP1Angle = $scope.rightData.engine1Angle;
        VSP2Angle = $scope.rightData.engine2Angle;
        VSP3Angle = $scope.rightData.engine3Angle;
        VSP4Angle = $scope.rightData.engine4Angle;
        VSP1Radius = $scope.rightData.engine1Radius;
        VSP2Radius = $scope.rightData.engine2Radius;
        VSP3Radius = $scope.rightData.engine3Radius;
        VSP4Radius = $scope.rightData.engine4Radius;

        VSP1AngleServo1 = -VSP1Radius / 100 / 45 * 1000 * (-5.553 * Math.pow(10, -10) * Math.pow(VSP1Angle, 5) + 5.675 * Math.pow(10, -7) * Math.pow(VSP1Angle, 4)
            - 1.915 * Math.pow(10, -4) * Math.pow(VSP1Angle, 3) + 2.169 * Math.pow(10, -2) * Math.pow(VSP1Angle, 2) - 1.610 * Math.pow(10, -1) * VSP1Angle
            - 22.44);
        VSP1AngleServo2 = -VSP1Radius / 100 / 45 * 1000 * (-5.415 * Math.pow(10, -10) * Math.pow(VSP1Angle, 5) + 4.225 * Math.pow(10, -7) * Math.pow(VSP1Angle, 4)
            - 9.197 * Math.pow(10, -5) * Math.pow(VSP1Angle, 3) + 2.847 * Math.pow(10, -3) * Math.pow(VSP1Angle, 2) + 2.585 * Math.pow(10, -1) * VSP1Angle
            + 31.42);
        if (bubblot1YoctoModules.yServo1_VSPTopLeft_X) {
            bubblot1YoctoModules.yServo1_VSPTopLeft_X.set_position(VSP1AngleServo1);
        }
        if (bubblot1YoctoModules.yServo1_VSPTopLeft_Y) {
            bubblot1YoctoModules.yServo1_VSPTopLeft_Y.set_position(VSP1AngleServo2);
        }
    }

    //Computer the length of the winder
    function computeWinderLength() {
        if ($scope.winderData.railMode) {
            if ($scope.winderData.railLength1 <= 100 && $scope.winderData.railLength1 >= 0) {
                $scope.winderData.railLength1 = $scope.winderData.railLength1 + $scope.winderData.winderSpeed1;
                if ($scope.winderData.railLength1 > 100) $scope.winderData.railLength1 = 100;
                else if ($scope.winderData.railLength1 < 0) $scope.winderData.railLength1 = 0;
                $scope.$apply();
            }
            if ($scope.winderData.railLength2 <= 100 && $scope.winderData.railLength2 >= 0) {
                $scope.winderData.railLength2 = $scope.winderData.railLength2 + $scope.winderData.winderSpeed2;
                if ($scope.winderData.railLength2 > 100) $scope.winderData.railLength2 = 100;
                else if ($scope.winderData.railLength2 < 0) $scope.winderData.railLength2 = 0;
                $scope.$apply();
            }
        }
        else {
            if ($scope.winderData.winderLength1 <= 300 && $scope.winderData.winderLength1 >= 0) {
                $scope.winderData.winderLength1 = $scope.winderData.winderLength1 + $scope.winderData.winderSpeed1;
                if ($scope.winderData.winderLength1 > 300) $scope.winderData.winderLength1 = 300;
                else if ($scope.winderData.winderLength1 < 0) $scope.winderData.winderLength1 = 0;
                $scope.$apply();
            }
            if ($scope.winderData.winderLength2 <= 300 && $scope.winderData.winderLength2 >= 0) {
                $scope.winderData.winderLength2 = $scope.winderData.winderLength2 + $scope.winderData.winderSpeed2;
                if ($scope.winderData.winderLength2 > 300) $scope.winderData.winderLength2 = 300;
                else if ($scope.winderData.winderLength2 < 0) $scope.winderData.winderLength2 = 0;
                $scope.$apply();
            }
            if ($scope.winderData.winderLength3 <= 300 && $scope.winderData.winderLength3 >= 0) {
                $scope.winderData.winderLength3 = $scope.winderData.winderLength3 + $scope.winderData.winderSpeed3;
                if ($scope.winderData.winderLength3 > 300) $scope.winderData.winderLength3 = 300;
                else if ($scope.winderData.winderLength3 < 0) $scope.winderData.winderLength3 = 0;
                $scope.$apply();
            }
            if ($scope.winderData.winderLength4 <= 300 && $scope.winderData.winderLength4 >= 0) {
                $scope.winderData.winderLength4 = $scope.winderData.winderLength4 + $scope.winderData.winderSpeed4;
                if ($scope.winderData.winderLength4 > 300) $scope.winderData.winderLength4 = 300;
                else if ($scope.winderData.winderLength4 < 0) $scope.winderData.winderLength4 = 0;
                $scope.$apply();
            }
        }
    }
    function getValues() {
        if (receivedPitch && receivedRoll) {
            receivedPitch = false;
            receivedRoll = false;
            $scope.$apply();
        }
    }
    function computePitch(object, value) {
        if (mainVm.previousPitch > 90 && value < -90) {
            mainVm.pitch = mainVm.pitch + (value - mainVm.previousPitch + 360);
        }
        else if (mainVm.previousPitch < -90 && value > 90) {
            mainVm.pitch = mainVm.pitch + (value - mainVm.previousPitch - 360);
        }
        else {
            mainVm.pitch = mainVm.pitch + (value - mainVm.previousPitch);
        }
        mainVm.previousPitch = value;
        $scope.leftDataPump.horizonPitch = value;
        $scope.leftData.horizonPitch = value;
        if (!receivedPitch) {
            receivedPitch = true;
            if (receivedRoll) {
                getValues();
            }
        }
        //regulPosition();
    }
    function computeRoll(object, value) {
        if (mainVm.previousRoll > 90 && value < -90) {
            mainVm.roll = mainVm.roll + (value - mainVm.previousRoll + 360);
        }
        else if (mainVm.previousRoll < -90 && value > 90) {
            mainVm.roll = mainVm.roll + (value - mainVm.previousRoll - 360);
        }
        else {
            mainVm.roll = mainVm.roll + (value - mainVm.previousRoll);
        }
        mainVm.previousRoll = value;
        $scope.leftDataPump.horizonRoll = value;
        $scope.leftData.horizonRoll = value;
        if (!receivedRoll) {
            receivedRoll = true;
            if (receivedPitch) {
                getValues();
            }
        }
        //regulPosition();
    }
    function computeCompass(object, value) {
        if (mainVm.previousYaw > 270 && value < 90) {
            mainVm.yaw = mainVm.yaw + (value - mainVm.previousYaw + 360);
        }
        else if (mainVm.previousYaw < 90 && value > 270) {
            mainVm.yaw = mainVm.yaw + (value - mainVm.previousYaw - 360);
        }
        else {
            mainVm.yaw = mainVm.yaw + (value - mainVm.previousYaw);
        }
        mainVm.previousYaw = value;
        /*
        if (mainVm.yaw > 360) {
            $scope.leftData.twistLeft = true;
        }
        else if (mainVm.yaw < -360) {
            $scope.leftData.twistRight = true;
        }
        else {
            $scope.leftData.twistLeft = false;
            $scope.leftData.twistRight = false;
        }
        */
        $scope.leftDataPump.gpsCompass = value;
        //regulPosition();
        $scope.$apply();
    }
    function computeLatitude(object, value) {
    }
    function computeTemp(object, value) {
    }
    var amountTurbi = 0, totalTurbi = 0;
    function computeTurbidity(object, value) {
        amountTurbi++;
        totalTurbi = totalTurbi + (1000 - value);
        $scope.leftData.turbidity = 1 - value / 1000;

    }
    function computeAverageTurbidity() {
        if (!amountTurbi == 0) $scope.leftData.turbidityRed = totalTurbi / amountTurbi;
        console.log($scope.leftData.turbidityRed);
        totalTurbi = 0;
        amountTurbi = 0;
    }
    function computeAcc(object, value) {
        accY = -value * Math.sin($scope.leftData.horizonRoll * Math.PI / 180);
        accX = -value * Math.sin($scope.leftData.horizonPitch * Math.PI / 180);
    }
    function switchDirection1Ok(object, value) {
        switchDirection1 = false;
        if (winderYoctoModules.yRelay1_Winder1Forward && $scope.winderData.winderSpeed1 > 0) {
            winderYoctoModules.yRelay1_Winder1Forward.set_state(true);
            winderYoctoModules.yRelay1_Winder1Backward.set_state(true);
        }
        else if (winderYoctoModules.yRelay1_Winder1Forward) {
            winderYoctoModules.yRelay1_Winder1Forward.set_state(false);
            winderYoctoModules.yRelay1_Winder1Backward.set_state(false);
        }
        winderYoctoModules.yPwmOutput1_Winder1Speed.set_dutyCycle(Math.abs($scope.winderData.winderSpeed1) / 5.5 * 100);
    }
    var allScreen = document.getElementById('bubblotDisplay');
    allScreen.addEventListener('mousedown', dragDirection);
    var clientRect = allScreen.getBoundingClientRect();
    var margeX = clientRect.width / 5;
    var margeY = clientRect.height / 5;
    var minX = clientRect.left + margeX;
    var maxX = clientRect.right - margeX;
    var startX, startY, x, y;
    function dragDirection(event) {
        startX = event.screenX;
        startY = event.screenY;
        if (startX > minX && startX < maxX) {
            allScreen.addEventListener('mousemove', mousemove);
            allScreen.addEventListener('mouseup', mouseup);
        }
    }
    function mousemove(event) {
        x = event.screenX - startX;
        y = event.screenY - startY;
        if (x > margeX) {
            x = margeX;
        }
        if (x < -margeX) {
            x = -margeX;
        }
        if (y > margeY) {
            y = margeY;
        }
        if (y < -margeY) {
            y = -margeY;
        }
        bubblotDeltaY = x / margeX;
        bubblotDeltaX = -y / margeY;
    }
    function mouseup() {
        allScreen.removeEventListener('mousemove', mousemove);
        allScreen.removeEventListener('mouseup', mouseup);
    }
    var deltaRoll, deltaPitch, deltaYaw, prevDeltaRoll = 0, prevDeltaPitch = 0, prevDeltaYaw = 0, consigne = 0;
    function regulPosition() {
        deltaRoll = bubblotRoll - parseInt($scope.leftData.horizonRoll);
        if (deltaRoll > 45) deltaRoll = 45;
        else if (deltaRoll < -45) deltaRoll = -45;
        deltaPitch = bubblotPitch - parseInt($scope.leftData.horizonPitch);
        if (deltaPitch > 45) deltaPitch = 45;
        else if (deltaPitch < -45) deltaPitch = -45;
        deltaYaw = bubblotYaw - mainVm.yaw;
        if (deltaYaw > 45) deltaYaw = 45;
        else if (deltaYaw < -45) deltaYaw = -45;

        if (Math.abs(deltaRoll) / 45 > Math.abs(deltaPitch) / 45 && Math.abs(deltaRoll) / 45 > Math.abs(deltaYaw) / 45) {
            if (deltaRoll > 0) {
                $scope.rightData.engine1Angle = 180;
                $scope.rightData.engine2Angle = 180;
                $scope.rightData.engine3Angle = 0;
                $scope.rightData.engine4Angle = 0;
            }
            else {
                $scope.rightData.engine1Angle = 0;
                $scope.rightData.engine2Angle = 0;
                $scope.rightData.engine3Angle = 180;
                $scope.rightData.engine4Angle = 180;
            }
            consigne = Math.abs(deltaRoll) / 45 * 100;
        }
        else if (Math.abs(deltaPitch) / 45 > Math.abs(deltaYaw) / 45) {
            if (deltaPitch > 0) {
                $scope.rightData.engine1Angle = 90;
                $scope.rightData.engine2Angle = 90;
                $scope.rightData.engine3Angle = 270;
                $scope.rightData.engine4Angle = 270;
            }
            else {
                $scope.rightData.engine1Angle = 270;
                $scope.rightData.engine2Angle = 270;
                $scope.rightData.engine3Angle = 90;
                $scope.rightData.engine4Angle = 90;
            }
            consigne = Math.abs(deltaPitch) / 45 * 100;
        }
        else {
            if (deltaYaw > 0) {
                $scope.rightData.engine1Angle = 90;
                $scope.rightData.engine2Angle = 270;
                $scope.rightData.engine3Angle = 90;
                $scope.rightData.engine4Angle = 270;
            }
            else {
                $scope.rightData.engine1Angle = 270;
                $scope.rightData.engine2Angle = 90;
                $scope.rightData.engine3Angle = 270;
                $scope.rightData.engine4Angle = 90;
            }
            consigne = Math.abs(deltaYaw) / 45 * 100;
        }
        if (consigne > 100) consigne = 100;
        $scope.rightData.engine1Radius = consigne;
        $scope.rightData.engine2Radius = $scope.rightData.engine1Radius;
        $scope.rightData.engine3Radius = $scope.rightData.engine1Radius;
        $scope.rightData.engine4Radius = $scope.rightData.engine1Radius;
        $scope.$apply();
    }
    var counter1 = 0, counter2 = 0, counter3 = 0;

    //Save the data in the database
    function saveData() {
        var date = new Date(), year, month, day, hours, minutes, seconds;
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate();
        hours = date.getHours();
        minutes = date.getMinutes();
        seconds = date.getSeconds();

        $scope.rightData.distancexToPump = $scope.rightData.distancexToPump + 20 * Math.random() - 10;
        $scope.rightData.distanceyToPump = $scope.rightData.distanceyToPump + 20 * Math.random() - 10;

        var fe = false, pb = false, cu = false, sn = false, isVa = false, isMovie = false;
        counter1++;
        counter2++;
        counter3++;
        var dataVa = [];
        if (counter1 == 6) {
            var va = 6 * Math.random();
            if (va <= 1) {
                isVa = true;
            }
            else if (va > 1 && va <= 2) {
                pb = true;
                isVa = true;
            }
            else if (va > 3 && va <= 4) {
                cu = true;
                isVa = true;
            }
            else if (va > 4 && va <= 5) {
                sn = true;
                isVa = true;
            }
            else {
                fe = true;
                isVa = true;
            }
            for (var i = 0; i <= 30; i++) {
                dataVa.push(1 * Math.random());
            }
            counter1 = 0;
        }
        if (counter2 == 20) {
            isMovie = true;
            counter2 = 0;
        }
        var isTurbi = false, avgRed = 0, avgGreen = 0, avgBlue = 0, dataTurbiRed = [], dataTurbiGreen = [], dataTurbiBlue = [];
        if (counter3 == 4) {
            isTurbi = true;
            counter3 = 0;
            avgRed = 1 * Math.random();
            avgGreen = 1 * Math.random();
            avgBlue = 1 * Math.random();
            for (var i = 0; i <= 15; i++) {
                var dataRed = { x: 2 * i, y: 100 * Math.random() };
                dataTurbiRed.push(dataRed);
                var dataGreen = { x: 2 * i, y: 100 * Math.random() };
                dataTurbiGreen.push(dataGreen);
                var dataBlue = { x: 2 * i, y: 100 * Math.random() };
                dataTurbiBlue.push(dataBlue);
            }
        }
        var dataMagn = [], avgMagn = 1 * Math.random();
        for (var i = 0; i <= 15; i++) {
            var obj = { x: 2 * i, y: 5 * Math.random() };
            dataMagn.push(obj);
        }

        couch.insert("bubblot", {
            "data_key": [year, month, day, hours, minutes, seconds, 1],
            "data": {
                pumpLatitude: $scope.leftDataPump.localLat,
                pumpLongitude: $scope.leftDataPump.localLong,
                pumpOrientation: $scope.leftDataPump.gpsCompass,
                distancexToPump: $scope.rightData.distancexToPump,
                distanceyToPump: $scope.rightData.distanceyToPump,
                depth: $scope.rightData.depth * 100,
                temperature: 24,
                VA: {
                    available: isVa,
                    data: dataVa,
                    fe: fe,
                    pb: pb,
                    cu: cu,
                    sn: sn,
                },
                magnetism: {
                    data: dataMagn,
                    mean: avgMagn,
                },
                turbidity: {
                    available: isTurbi,
                    dataRed: dataTurbiRed,
                    dataGreen: dataTurbiGreen,
                    dataBlue: dataTurbiBlue,
                    avgRed: avgRed,
                    avgGreen: avgGreen,
                    avgBlue: avgBlue,
                },
                movie: {
                    available: isMovie,
                    data: [],
                }
            }
        }).then(({data, headers, status}) => {
            // data is json response 
            // headers is an object with all response headers 
            // status is statusCode number 
        }, err => {
            // either request error occured 
            // ...or err.code=EDOCCONFLICT if document with the same id already exists 
        });
    }

    init();
}
])
