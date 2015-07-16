// Code goes here
(function() {
    //'use strict';

    angular.module('app', [])
        .controller('otaController', function($scope) {
            var vm = $scope;
            vm.ota = [];
            vm.otas = [];
            vm.record = 0;
            var d = new Date();
            var yyyy = d.getFullYear().toString();
            var mm = ("0" + (d.getMonth() + 1)).slice(-2);
            var dd = ("0" + (d.getDay() + 1)).slice(-2);
            $scope.cancelOta = function() {
                vm.ota.splice(0, vm.ota.length);
            };

            $scope.addOta = function() {
                vm.ota[0] = y + m + vm.ota[0];
                vm.ota[1] = '1380';
                vm.ota[3] = '00' + vm.ota[3]; // stock code
                vm.ota[4] = vm.ota[4].toUpperCase();
                vm.ota[5] = pad(vm.ota[5], 7);
                vm.ota[6] = pad(vm.ota[6], 7);
                vm.ota[9] = pad(vm.ota[9], 8);
                vm.ota[10] = pad(vm.ota[10], 12);
                vm.ota[10] = vm.ota[10] + '00';
                vm.ota[11] = Array(26).join(' ');
                vm.ota[12] = '\r\n';
                //$scope.ota[11].length = 25;
                //$scope.ota[11].join(' '); // filler
                //pad($scope.ota[2], 7);
                vm.otas.push(vm.ota.join('')); // remove comma frm array
                vm.ota.splice(0, vm.ota.length);
                vm.record = vm.record + 1;
            };

            $scope.saveOta = function() {
                var otas = vm.otas;
                var oMyBlob = new Blob(otas, {
                    type: 'text/plain'
                });
                //var oMyBlob = new Blob($scope.otas, {type: 'application/octet-stream'});
                console.log(oMyBlob.size);
                console.log(oMyBlob.type);

                //contentType = 'application/octet-stream';
                var a = document.createElement('a');
                a.href = window.URL.createObjectURL(oMyBlob);
                a.download = '1.txt';
                a.click();
                // vm.ota.splice(0, vm.ota.length);
                vm.otas.splice(0, vm.otas.length);
                vm.record = 0;
            };

            // left padding
            function pad(num, size, f) {
                var filler =  f || '0';
                var s = num +"";
                while (s.length < size) {
                    s = filler + s;
                }
                return s;
            }
        });
})();
