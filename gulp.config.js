module.exports = function() {
    var client ='./';   // may be './src/client/'
    //var clientApp = client +'';
    var server = './src/server/';
    var temp = './temp/';
    var config = {
        // all js to vet
        alljs: [
            './*.js'
        ],

        build: './build', // or ./prod
        // expose it as config.client
        client: client,
        css: temp + 'mycss.cc',
        fonts: './bower_components/font-awesome/fonts/**/*/*',
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        js: [
            //client + '*.js'
            // clientApp + '**/*.module.js'     // in angular app we need 2 load any file that starts w/ module.js
            './*.js'
            // '!' + clientApp + '**/*.spec.js' // exclude test files
        ],
        server: server,
        temp: temp,
        /**
         *  Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        /**
         *      Node settings
         */
        defaultPort: 7203,
        nodeServer: './srv/server/app.js'

    };

    // return an options object for wiredep
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerjson: config.bower.json,   // see line 30
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    return config;
};