module.exports = function (config) {


    config.set({

        files: [
            '../bower_components/jquery/jquery.js',
            '../bower_components/angular/angular.js',
            '../bower_components/angular-mocks/angular-mocks.js',
            '../angular-slashTools.js',
            'angular-slashTools.spec.js'
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
            }
          ]
        }
    });
};
