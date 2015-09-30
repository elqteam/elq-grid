"use strict";

module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    var config = {
        pkg: grunt.file.readJSON("package.json"),
        less: {
            dev: {
                files: {
                    "build/elq-grid.css": "src/less/elq-grid.less"
                }
            }
        },
        browserify: {
            dev: {
                src: ["src/js/index.js"],
                dest: "build/elq-grid.js",
                options: {
                    browserifyOptions: {
                        standalone: "elqGrid",
                        debug: true
                    }
                }
            },
            dist: {
                src: ["src/js/index.js"],
                dest: "dist/elq-grid.js",
                options: {
                    browserifyOptions: {
                        standalone: "elqGrid"
                    }
                }
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.less', 'src/**/*.js'],
                tasks: ['build'],
                options: {
                    spawn: false,
                },
            },
        },
    };

    grunt.initConfig(config);

    grunt.registerTask("build", ["browserify:dev", "less:dev"]);
    grunt.registerTask("dist", ["browserify:dist"]);

    grunt.registerTask("default", ["build", "watch"]);
};
