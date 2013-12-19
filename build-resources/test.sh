#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting Karma Server (http://karma-runner.github.io)"
echo "-------------------------------------------------------------------"

echo $BASE_DIR
$BASE_DIR/../node_modules/.bin/karma start $BASE_DIR/test/karma.conf.js