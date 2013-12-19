# slashTools [![Build Status](https://travis-ci.org/tilmanpotthof/angular-slashTools.png)](https://travis-ci.org/tilmanpotthof/angular-slashTools)


The library 'slashTools' is a work in progress collection of angularJS services.
At the moment their are just three very basic services in the `st.common.util` module.
They solve general problems regarding arrays and objects which appeared in different projects, but their is no claim to completeness.
If you have ideas to complete the library, feel free to open an issue, to send a pull request or contribute in any other way.

## Requirements

To build and test the library you need node, npm, grunt-cli and bower.
How to install node and npm is documented on the projects website: http://nodejs.org/
Installing bower is easy if you have npm.

    npm install -g grunt-cli bower

## Build and test

First you need to install the bower and node dependencies.

    bower install
    node install

Notice: `node install` might take a while if you don`t have phantomjs so far.

Now you can build the library with...

    grunt



