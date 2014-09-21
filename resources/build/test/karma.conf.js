module.exports = function (config) {


    config.set({

        files: [
            '../bower_components/jquery/dist/jquery.js',
            '../bower_components/angular/angular.js',
            '../bower_components/angular-mocks/angular-mocks.js',
            '../angular-slashTools.js',
            'angular-slashTools.spec.js'
        ],

        logLevel: config.LOG_INFO,

        singleRun: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        reporters: ['progress', 'coverage'],

        preprocessors : {
            '../angular-slashTools.js': 'coverage'
        },
        coverageReporter: {
          reporters: [
            {
              type: "lcov",
              dir: "../coverage"
            },
            {
              type: "text"
            },
            {
              type: "html",
              dir: "../coverage"
            }
          ]
        }
    });
};
