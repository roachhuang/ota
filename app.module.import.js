/**
 * Created by roach on 2015/6/24.
 */
'use strict'
angular.module('app.importCsv', [])
    .factory('csvFactory', function() {
        var factory = {};
        factory.importCsv = function (fileName, city) {
            console.log('called factory.importcsv');
            var fileToUpload = '../test.csv';   // relative to db.php's path
            // remember to change this after fixing fileanme issue
            return $http.post(this.dataUrl + 'importCsv', {filename: fileToUpload, city: city});
        };
        return factory; // return an object
    };