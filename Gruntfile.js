// Default Gruntfile.js

var _ = require('lodash');
var path = require('path');

module.exports = function(grunt) {

    // Load site configuration for build processes
    var config = _.extend({routes: JSON.stringify(require('./routes.json'))}, require('./config.json'), require('./build.json'));

    // Remove aliases property. Breaks grunt and it's not needed for building front-end
    delete config.aliases;

    require('load-grunt-config')(grunt, {
        
        // path to task.js files, defaults to grunt dir
        configPath: path.join(process.cwd(), '../global/grunt'),

        // auto grunt.initConfig
        init: true,

        // data passed into config.  Can use with <%= test %>
        data: config,

        // can optionally pass options to load-grunt-tasks.
        // If you set to false, it will disable auto loading tasks.
        loadGruntTasks: {
            pattern: 'grunt-*',
            config: require('./package.json'),
            scope: 'devDependencies'
        },

        //can post process config object before it gets passed to grunt
        postProcess: function(config) {}
    });

};