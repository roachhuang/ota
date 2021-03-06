/**
 * Created by roach on 2015/6/24.
 */
'use strict'
angular.module('app', [])
    .controller('otaController', function($scope) {
        var vm = $scope;
        //vm.destData = [];
        var d = new Date();
        var yyyy = d.getFullYear().toString();
        var mm = ("0" + (d.getMonth() + 1)).slice(-2);
        var dd = ("0" + (d.getDate())).slice(-2);
        var tradeDate = yyyy + mm + dd;
        var brokerId ='1380';
        var otaAcc = '9955558';

        vm.import = function() {
            var srcData;
            var destData = [];
            var fileInput = document.getElementById('fileInput');
            var file = fileInput.files[0];

            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = function (e) {
            srcData = e.target.result.split(/\r\n|,/g); // crlf and comma. a "" is at the end of the file, so length is +1.
            destData = convert(srcData);
            saveOta(destData);
            }
        };

        vm.importOrdDetails = function() {
            var srcData;
            var destData = [];
            var fileInput = document.getElementById('fileInput');
            var file = fileInput.files[0];

            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = function (e) {
                srcData = e.target.result.split(/\r\n|,/g); // crlf and comma. a "" is at the end of the file, so length is +1.
                destData = convertOrdDetails(srcData);
                saveOta(destData);
            }
        }

        var saveOta = function(data) {
            // Blob eats array obj, not string
            var oMyBlob = new Blob(data, {
                type: 'text/plain'
            });
            //var oMyBlob = new Blob($scope.otas, {type: 'application/octet-stream'});
            console.log(oMyBlob.size);
            console.log(oMyBlob.type);

            saveAs(oMyBlob, "ota.txt"); // there is no way to specify a path due to security concern.
            //window.navigator.msSaveBlob(oMyBlob, 'ota.txt'); // The user only has the option of clicking the Save button.


            //contentType = 'application/octet-stream';
            /*
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(oMyBlob);
            a.download = '1.txt';
            a.click();
            */
            // vm.ota.splice(0, vm.ota.length);
            //vm.otas.splice(0, vm.otas.length);
            //vm.record = 0;
        };
        var convertOrdDetails = function(data) {
            var i;
            var j = 0;
            var destArray = [];
            // dealer manually input only 8 columns
            for (i=0; i < (data.length-1)/8; i++) {
                destArray.push(pad(tradeDate, 8)); // remove comma frm array
                destArray.push(pad(brokerId, 4));
                destArray.push(pad(otaAcc, 7));
                destArray.push(padding_right(data[j+0], 6, " "));   // stock code
                destArray.push(pad(data[j+1], 1));  // B/S
                destArray.push(pad(data[j+2], 7));  // Trade s/n before allocation
                destArray.push(pad(data[j+3], 7));  // Ord no.
                destArray.push(pad(data[j+4], 4));  // Intro Broker
                destArray.push(pad(data[j+5], 7));  // Alloc Invest Acct
                destArray.push(pad(data[j+6], 8));  // Alloc Trade Shares
                if (data[j+7].indexOf('.') != -1) { // Alloc Trade Amt
                    data[j+7].split(/./g);
                } else {
                    data[j+7] =  data[j+7] +'00';
                }

                destArray.push(pad(data[j+7], 14));
                destArray.push(pad(' ', 25, ' '));
                destArray.push('\r\n');
                j = j+8;    // no. of colum user manually input.
            }
            return destArray;
        }
        var convert = function(data) {
            var i;
            var j = 0;
            var destArray = [];
            // dealer manually input only 8 columns
            for (i=0; i < (data.length-1)/8; i++) {
                destArray.push(pad(tradeDate, 8)); // remove comma frm array
                destArray.push(pad(brokerId, 4));
                destArray.push(pad(otaAcc, 7));
                destArray.push(padding_right(data[j+0], 6, " "));   // stock code
                destArray.push(pad(data[j+1], 1));  // B/S
                destArray.push(pad(data[j+2], 7));  // Trade s/n before allocation
                destArray.push(pad(data[j+3], 7));  // Ord no.
                destArray.push(pad(data[j+4], 4));  // Intro Broker
                destArray.push(pad(data[j+5], 7));  // Alloc Invest Acct
                destArray.push(pad(data[j+6], 8));  // Alloc Trade Shares
                if (data[j+7].indexOf('.') != -1) { // Alloc Trade Amt
                    data[j+7].split(/./g);
                } else {
                    data[j+7] =  data[j+7] +'00';
                }

                destArray.push(pad(data[j+7], 14));
                destArray.push(pad(' ', 25, ' '));
                destArray.push('\r\n');
                j = j+8;    // no. of colum user manually input.
            }
            return destArray;
        }
        // left padding
        function pad(num, size, f) {
            var filler =  f || '0';
            var s = num +"";
            while (s.length < size) {
                s = filler + s;
            }
            return s;
        }

        // right padding s with c to a total of n chars
        function padding_right(s, size, f) {
            if (! s || ! f || s.length >= size) {
                return s;
            }

            var max = (size - s.length)/f.length;
            for (var i = 0; i < max; i++) {
                s += f;
            }

            return s;
        }
});
