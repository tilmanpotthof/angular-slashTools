# slashTools

slashTools is a collection of AngularJS services.
At the moment their are just three very basic services.

## Requirements

To build and test the library you need node, npm, jake and bower.
How to install node and npm is documented on the projects website: http://nodejs.org/
Installing jake and bower is easy if you have npm.

    npm install -g jake bower

## Build and test

First you need to load the bower and node dependencies.

    bower install
    node install

Notice: `node install` might take a while if you don`t have phantomjs so far.

Now you can build the library with...

    jake

Afterwards you can run the test script in the `dist` folder.

    ./dist/test.js



