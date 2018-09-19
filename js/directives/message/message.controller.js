(function () {
    'use strict';
    angular
        .module('bubblot')
        .controller('messageCtrl', messageCtrl);

    function messageCtrl($scope, $element) {
        $scope.displayPreMessage = false;
        var message = $element.find("input");
        var htmlContent1 = "<!DOCTYPE html>\r\n";
        htmlContent1 += "<html>\r\n";
        htmlContent1 += "<head>\r\n";
        htmlContent1 += "<meta charset='utf-8'>\r\n";
        htmlContent1 += "<title>Bubblot</title>\r\n";
        htmlContent1 += "<link href='main.css' type='text/css' rel='stylesheet'>\r\n";
        htmlContent1 += "</head>\r\n";
        htmlContent1 += "<body style='background-color: black;overflow:hidden;'>\r\n";
        var htmlContent2 = "</body>\r\n";
        htmlContent2 += "<script type='text/javascript' src='main.js'></script>\r\n";
        htmlContent2 += "</html>\r\n";
        var htmlContent = null;
        message.on('keyup', function (e) {
            if (e.keyCode == 13) {
                htmlContent = htmlContent1 + "<h1 class='message'>" + message[0].value + "</h1>\r\n" + htmlContent2;
                fs.writeFile('Raspberry/raspberry-web/index.html', htmlContent, function (err) {
                    if (err) throw err;
                    else {
                        ssh.execCommand('/home/pi/Desktop/refresh.sh', { cwd: '/var/www' }).then(function (result) {
                        })
                    }
                })
            }
        })
        $scope.displayListEmoFunc = function (value) {
            var emoticonsList = $element.find(".emoticons-list");
            if (value) emoticonsList.show();
            else emoticonsList.hide();
        }
        $scope.printHappy = function () {
            htmlContent = htmlContent1 + "<div class='message-image-happy'></div>\r\n" + htmlContent2;
            fs.writeFile('Raspberry/raspberry-web/index.html', htmlContent, function (err) {
                if (err) throw err;
                else {
                    ssh.execCommand('/home/pi/Desktop/refresh.sh', { cwd: '/var/www' }).then(function (result) {
                    })
                }
            });
        }
        $scope.printSad = function () {
            htmlContent = htmlContent1 + "<div class='message-image-sad'></div>\r\n" + htmlContent2;
            fs.writeFile('Raspberry/raspberry-web/index.html', htmlContent, function (err) {
                if (err) throw err;
                else {
                    ssh.execCommand('/home/pi/Desktop/refresh.sh', { cwd: '/var/www' }).then(function (result) {
                    })
                }
            });
        }
        $scope.printNice = function () {
            htmlContent = htmlContent1 + "<div class='message-image-nice'></div>\r\n" + htmlContent2;
            fs.writeFile('Raspberry/raspberry-web/index.html', htmlContent, function (err) {
                if (err) throw err;
                else {
                    ssh.execCommand('/home/pi/Desktop/refresh.sh', { cwd: '/var/www' }).then(function (result) {
                    })
                }
            });
        }
        $scope.printPacman = function () {
            htmlContent = htmlContent1 + "<div class='message-image-pacman'></div>\r\n" + htmlContent2;
            fs.writeFile('Raspberry/raspberry-web/index.html', htmlContent, function (err) {
                if (err) throw err;
                else {
                    ssh.execCommand('/home/pi/Desktop/refresh.sh', { cwd: '/var/www' }).then(function (result) {
                    })
                }
            });
        }
        $scope.printHublot = function () {
            htmlContent = htmlContent1 + "<div class='message-image-hublot'></div>\r\n" + htmlContent2;
            fs.writeFile('Raspberry/raspberry-web/index.html', htmlContent, function (err) {
                if (err) throw err;
                else {
                    ssh.execCommand('/home/pi/Desktop/refresh.sh', { cwd: '/var/www' }).then(function (result) {
                    })
                }
            });
        }
    }
}());
