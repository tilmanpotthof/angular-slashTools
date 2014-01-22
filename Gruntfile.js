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
                src: ['src/**/*.js'],
                dest: 'build/angular-slashTools.js',
                filter: function (filepath) {
                    //console.log(filepath);
                    var isTest = minimatch(filepath, globPatterns.tests);
                    //console.log(isTest);
                    return !isTest;
                }
            },
            test: {
                src: ['src/**/*.spec.js'],
                dest: 'build/test/angular-slashTools.spec.js'
            }
        },
        copy: {
            resources: {
                files: [
                    {expand: true, cwd: 'resources/build/', src: ['**'], dest: 'build/'}
                ]
            },
            bower_components: {
                files: [
                    {expand: true, src: ['bower_components/**'], dest: 'build/'}
                ]
            }
        },
        karma: {
            default: {
                configFile: "build/test/karma.conf.js"
            }
        },
        shell: {
            bower_install: {
                command: "bower install"
            }
        },
        clean: {
            build: ["build", "docs"]
        },
        watch:  {
            default: {
                files: ['src/**', 'resources/build/**'],
                tasks: ['default'],
                options: {
                    livereload: true
                }
            },
            docs: {
                files: ['src/**'],
                tasks: ['ngdocs:all'],
                options: {
                    livereload: true
                }
            }
        },
        uglify: {
            default: {
                options: {
                    mangle: true
                },
                files: {
                    'build/angular-slashTools.min.js': ['build/angular-slashTools.js']
                }
            }
        },
        ngdocs: {
            options: {
                scripts: [
                    'angular.js',
                    'resources/docs/google-code-prettify.js',
                    'build/angular-slashTools.js',
                    '//localhost:35729/livereload.js'
                ],
                styles: [
                    'resources/docs/doc-style.css',
                    'resources/docs/prettify.css'
                ],
                html5Mode: false
            },
            all: ["src/**/*.js"]
        },
        connect: {
            server: {
                options: {
                    open: 'http://localhost:8000/docs/#/api'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['clean', 'shell:bower_install', 'copy', 'concat', 'uglify', 'karma', 'ngdocs:all']);

    grunt.registerTask('default+docs', ['connect', 'watch:default'])
    grunt.registerTask('dev-docs', ['connect', 'watch:docs'])

};