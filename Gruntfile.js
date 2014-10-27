module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        hogan_render: {
            dev: {

            },
            prod: {
                files: {
                    'public/ng/global2.js': 'public/ng/global.js'
                }
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'public/css/style.css': ['public/scss/style.scss']
                }
            },
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'public/css/min/style.css': ['public/scss/style.scss']
                }
            }
        },
        concat: {
            prod: {
                src: [
                    '../global/partials/ngHead.html',
                    'index.html',
                    '../global/partials/foot.html'
                ],
                dest: 'public/index.html',
            }
        },
        // Uglify for development JS combination
        uglify: {
            global: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },

                files: {
                    'public/ng/min/global.js': [
                        '../global/public/ng/lib/angular.min.js',
                        '../global/public/ng/lib/angular-route.min.js',
                        'public/ng/global.js'
                    ]
                }

            }
        },
        // Closure compiler for production JS minification
        'closure-compiler': {
            global: {
                closurePath: '/comedian/app',
                js: [
                    '../global/public/ng/lib/angular.min.js',
                    '../global/public/ng/lib/angular-route.min.js',
                    'public/ng/global.js'
                ],
                jsOutputFile: 'public/ng/min/global.js',
                maxBuffer: 500,
                options: {
                    // compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    // language_in: 'ECMASCRIPT5_STRICT'
                }
            }
        },

        watch: {
            dev: {
                tasks: ['uglify', 'sass:dev', 'concat:prod', 'hogan'],
                files: [
                    'public/scss/style.scss',
                    'public/scss/partials/*.scss',
                    'public/ng/*.js',
                    'public/js/*.js',
                    'config.json',
                    'routes.json'
                ],
                options: {
                    atBegin: true,
                    spawn: false,
                    debounceDelay: 250,
                    livereload: 35731
                }
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-mustache-html');
    grunt.loadNpmTasks('grunt-closure-compiler');

      grunt.registerMultiTask('hogan_render', 'Uses Hogan.js to render static HTML with variables', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
          punctuation: '.',
          separator: ', '
        });

        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
          // Concat specified files.
          var src = f.src.filter(function(filepath) {
            // Warn on and remove invalid source files (if nonull was set).
            if (!grunt.file.exists(filepath)) {
              grunt.log.warn('Source file "' + filepath + '" not found.');
              return false;
            } else {
              return true;
            }
          }).map(function(filepath) {
            // Read file source.
            return grunt.file.read(filepath);
          }).join(grunt.util.normalizelf(options.separator));

          // Handle options.
          src += options.punctuation;

          // Write the destination file.
          grunt.file.write(f.dest, src);

          // Print a success message.
          grunt.log.writeln('File "' + f.dest + '" created.');
        });
      });




    //grunt.registerTask('default',['watch:actionItems']);


    var env = grunt.option('env') || '';

    grunt.registerTask('build', ['concat:prod', 'hogan']);

    //For Global Angular
    grunt.registerTask('default', null, function() {
        if (env === 'prod') {
            //grunt.task.run('uglify:globalNgProd');
        } else {
            grunt.task.run('watch:actionItems');
        }
    });

    // For compiling hogan.js/mustache 
    grunt.registerTask('hogan', 'Compiles mustache syntax templates', function() {
        var hogan = require('hogan.js');
        var clc = require('cli-color');
        var fs = require('fs');
        var async = require('async');

        var done = this.async();
        var filename = 'public/index.html';
        var configFilename = 'config.json';

        async.parallel([

                function(callback) {
                    fs.readFile(filename, 'utf8', function(err, data) {
                        callback(err, hogan.compile(data, {
                            delimiters: '<@ @>'
                        }));
                    });
                },
                function(callback) {
                    fs.readFile(configFilename, 'utf8', function(err, data) {
                        try {
                            var config = JSON.parse(data);
                            callback(err, config);
                        } catch (ex) {
                            callback(ex);
                        }
                    });
                }
            ],
            function(err, results) {
                if (err) {
                    var error = new Error('Parse');
                    console.log(error.stack, err);
                    throw error;
                }
                fs.writeFile(filename, results[0].render(results[1]), function(err, data) {
                    if (err) {
                        throw new Error('Failed to save ' + filename)
                    } else {
                        done();
                    }
                });
            });



    });
    grunt.registerTask('tests', null, function() {
        grunt.task.run('watch:tests');
    });



    //grunt.task.run('svgmin: framework');

    //grunt.task.run('uglify: framework');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    /* grunt.registerTask('framework', ['watch:framework']);*/

};
