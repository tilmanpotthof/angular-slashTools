"use strict";

// settings
var FILE_ENCODING = 'utf-8',
    EOL = '\n',
    DIST_DIR = 'dist/',
    SRC_DIR = 'src/',
    TMP_DIR = 'tmp/';

// setup
var fs = require('fs'),
    path = require('path'),
    wrench = require('wrench');

var noop = function () { };

task('default', ['all']);

task('all', ['clean', 'copy-resources', 'slashTools', 'slashTools-tests'], function() {
    console.log('task[all] is done');
});

task('slashTools', ['dist'], function () {
    concat({
        src : [
            'intro.js',
            'common/util/module.js',
            'common/util/arrayUtils.js',
            'common/util/objectUtils.js',
            'common/util/groupArrayUtils.js',
            'outro.js'
        ].map(_prependPathFn(SRC_DIR)),
        dest : DIST_DIR + 'angular-slashTools.js'
    });
});

task('slashTools-tests', ['dist/test'], function () {
    wrench.mkdirSyncRecursive(DIST_DIR);
    concat({
        src : [
            'common/util/arrayUtils.spec.js',
            'common/util/objectUtils.spec.js',
            'common/util/groupArrayUtils.spec.js',
        ].map(_prependPathFn(SRC_DIR)),
        dest : DIST_DIR + 'test/angular-slashTools.spec.js'
    });
    
   // copyFile('test/package.json', 'dist/test/package.json');
   
   fs.chmodSync(DIST_DIR + 'test.sh', '755');
    
});

task('clean', function () {
    console.log('Clean built generated directories...');

    _removeDirIfExists(DIST_DIR);
    _removeDirIfExists(TMP_DIR);
});

file('dist', function () {
    console.log('Create directory: ' + DIST_DIR); 
    wrench.copyDirSyncRecursive('build', DIST_DIR)
});

file('dist/test', function () {
    console.log('Create directory: ' + DIST_DIR + 'test'); 
    wrench.mkdirSyncRecursive(DIST_DIR + 'test');
});

task('copy-resources', ['dist'], function () {
    console.log('Copy resources to dist folder...');

    ['bower_components'].forEach(function (dirPath) {
        console.log (dirPath);
        wrench.copyDirRecursive(dirPath, DIST_DIR + dirPath, noop);
    });
});

function concat(opts) {
    var fileList = opts.src;
    var distPath = opts.dest;
    var out = fileList.map(function(filePath){
        return fs.readFileSync(filePath, FILE_ENCODING);
    });
    fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
}

function _prependPathFn (path) {
    return function (file) {
        return path + file;
    }
}

function _removeDirIfExists(dirPath) {
    if (fs.existsSync(dirPath)) {
        wrench.rmdirSyncRecursive(dirPath);
    }
}

function copyFile(src, dest) {
    fs.createReadStream(src).pipe(fs.createWriteStream(dest));
}
