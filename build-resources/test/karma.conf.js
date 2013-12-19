module.exports = function (config) {
    var basePath = '../';

    console.log("basePath: " + require("path").resolve(basePath));

    config.set({
        basePath: basePath,

        files: [
            'bower_components/jquery/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'angular-slashTools.js',
            'test/angular-slashTools.spec.js'
        ],

        singleRun: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        reporters: ['progress', 'coverage'],

        preprocessors : {
            '*.js': 'coverage'
        },
        coverageReporter : {
            type : 'text'
        }
    });
};