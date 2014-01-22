var minimatch = require('minimatch');
var fs = require('fs');

var globPatterns = {
    tests: "**/*.spec.js"
}

module.exports = function (grunt) {

    var GIT = {};
    var BUILD = {}
    var PKG = grunt.file.readJSON('package.json');

    // Project configuration.
    grunt.initConfig({
        pkg: PKG,
        git: GIT,
        build: BUILD,
        concat: {
            options: {
                banner: bannerHelper().generateBanner(),
                stripBanners: true
            },
            js: {
                src: ['src/**/*.js'],
                dest: 'build/angular-slashTools.js',
                filter: function (filepath) {
                    var isTest = minimatch(filepath, globPatterns.tests);
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
            },
            gitHash: {
                command: "git log --pretty=format:'%h' -n 1",
                options: {
                    callback: function (err, stdout, stderr, cb) {
                        GIT.hash = stdout;
                        console.log("git-version: " + GIT.hash);
                        cb();
                    }
                }
            },
            gitStatus: {
                command: "git status -s",
                options: {
                    callback: function (err, stdout, stderr, cb) {
                        GIT.status = stdout;
                        cb();
                    }
                }
            },
            gitVersionHash: {
                command: "git log --pretty=format:'%h' -n 1 v" + PKG.version,
                options: {
                    callback: function (err, stdout, stderr, cb) {
                        GIT.versionHash = stdout;
                        console.log("git-hash of pkg.version tag: " + GIT.versionHash);
                        cb();
                    }
                }
            }
        },
        clean: {
            build: ["build", "docs"]
        },
        watch: {
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
                    mangle: true,
                    banner: bannerHelper().generateShortBanner()
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

    grunt.registerTask('default', ['clean', 'shell', 'copy', 'concat', 'uglify', 'karma', 'ngdocs:all']);

    grunt.registerTask('default+docs', ['connect', 'watch:default'])
    grunt.registerTask('dev-docs', ['connect', 'watch:docs'])

    function bannerHelper() {
        return {
            multilineCommentFromLines: function (lines) {
                return "/*!\n * " + lines.join("\n * ") + "\n */\n"
            },
            generateBanner: function () {
                var lines = [
                    "<%= pkg.name %> v<%= build.version() %>",
                    "source: <%= pkg.info.repository %>",
                    "",
                    "<%= git.info() %>",
                    "Licence: <%= pkg.info.licence %> (<%= pkg.info.licenceUrl %>)"
                ];
                return this.multilineCommentFromLines(lines);
            },
            generateShortBanner: function () {
                var lines = [
                    "<%= pkg.name %> v<%= build.version() %> | <%= git.info() %>"
                ];
                return this.multilineCommentFromLines(lines);
            }
        }
    };

    GIT.info = function () {
        var gitVersionComment = "git-version: " + GIT.hash;
        if (this.isClean()) {
            return gitVersionComment;
        } else {
            return gitVersionComment + " (WARNING: Repo had uncommitted changed while creating the build.)"
        }
    };
    GIT.isClean = function () {
        return /^\s*$/.test(GIT.status);
    };
    GIT.isTaggedWithPackageVersion = function () {
        return GIT.hash === GIT.versionHash
    };

    BUILD.version = function () {
        if (GIT.isTaggedWithPackageVersion() && GIT.isClean()) {
            return PKG.version;
        } else {
            return PKG.devVersion + "-sha." + GIT.hash;
        }
    }
};