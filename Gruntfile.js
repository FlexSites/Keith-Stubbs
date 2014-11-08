// Default Gruntfile.js

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        buildPath: __dirname.split('/').pop()
    });

    grunt.loadTasks('../global/grunt');
};