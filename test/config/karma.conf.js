module.exports = function (config) {
    var BASE = '../../';

    config.set({
        basePath: BASE,

        files: [
            'bower_components/jquery/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'src/common/util/module.js',
            'src/common/util/objectUtils.js',
            'src/common/util/objectUtils.spec.js',
            'src/common/util/arrayUtils.js',
            'src/common/util/arrayUtils.spec.js',
            'src/common/util/groupArrayUtils.js',
            'src/common/util/groupArrayUtils.spec.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['PhantomJS'],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        reporters: ['progress', 'coverage'],

        preprocessors : {
            'src/common/util/*.js': 'coverage'
        },
        coverageReporter : {
            type : 'html',
            dir : 'tmp/coverage/'
        }
    });
};