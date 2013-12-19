var minimatch = require('minimatch');
var fs = require('fs');

var globPatterns = {
    tests: "**/*.spec.js"
}

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {},
            js: {
                src: ['src/common/util/*.js'],
                dest: 'build/angular-slashTools.js',
                filter: function (filepath) {
                    //console.log(filepath);
                    var isTest = minimatch(filepath, globPatterns.tests);
                    //console.log(isTest);
                    return !isTest;
                }
            },
            test: {
                src: ['src/common/util/*.spec.js'],
                dest: 'build/test/angular-slashTools.spec.js'
            }
        },
        copy: {
            resources: {
                files: [
                    {expand: true, cwd: 'build-resources/', src: ['**'], dest: 'build/'}
                ]
            },
            bower_components: {
                files: [
                    {expand: true, src: ['bower_components/**'], dest: 'build/'}
                ]
            }
        },
        karma: {
            unit: {
                configFile: "build/test/karma.conf.js"
            }
        },
        shell: {
            bower_install: {
                command: "bower install"
            }
        },
        clean: {
            build: ["build"]
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-shell');


    grunt.registerTask('default', ['clean', 'shell:bower_install', 'copy', 'concat', 'prepare-test-script', 'karma']);

    grunt.registerTask('prepare-test-script', function () {
        fs.chmodSync('build/test.sh', '755');
    });
};