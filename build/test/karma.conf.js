module.exports = function (config) {
    var BASE = '../';

    config.set({
        basePath: BASE,

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
            type : 'html',
            dir : 'tmp/coverage/'
        }
    });
};