module.exports = function (config) {
    var BASE = '../../';

    config.set({
        basePath: BASE,

        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'src/**/*.js'
        ],

        logLevel: config.LOG_INFO,

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        reporters: ['progress', 'coverage'],

        preprocessors : {
            'src/**/*.js': 'coverage'
        },
        coverageReporter : { type : 'html', dir : 'tmp/coverage/'}
    });
};
