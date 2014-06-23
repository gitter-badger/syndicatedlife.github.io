'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                strict: true,
                node: true,
                unused: true,
                bitwise: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                quotmark: true,
                regexp: true,
                undef: true,
                trailing: true,
                smarttabs: true,
                jquery: true,
                browser: true,
                globals: {
                    describe: false,
                    it: false,
                    before: false,
                    beforeEach: false,
                    after: false,
                    afterEach: false,
                    _: true,
                    ga: true
                }
            },
            all: [
                'gruntfile.js',
                'lib/client/js/**/*.js',
                'test/**/*.js'
            ]
        },
        watch: {
            files: [
                'gruntfile.js',
                'lib/client/js/**/*.js',
                'lib/client/views/**/*.html'
            ],
            tasks: [
                'jshint',
                'build'
            ]
        },
        bower: {
            dist: {
                dest: 'lib/client/vendor',
                'js_dest': 'lib/client/vendor/js',
                'css_dest': 'lib/client/vendor/css',
                options: {
                    packageSpecific: {
                        bootstrap: {
                            files: [
                                'dist/css/bootstrap.css',
                                'dist/css/bootstrap-theme.css'
                            ],
                            dest: 'static/fonts'
                        }
                    }
                }
            }
        },
        uglify: {
            syndicatedlife: {
                src: [
                    'lib/client/js/*.js'
                ],
                dest: 'static/js/syndicatedlife.min.js',
                options: {
                    mangle: false,
                    compress: false,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
                }
            },
            vendor: {
                src: [
                    'lib/client/vendor/js/jquery.js',
                    'lib/client/vendor/js/bootstrap.js'
                ],
                dest: 'static/js/vendor.min.js',
                options: {
                    mangle: false,
                    compress: false,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - thirdparty requirements - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
                }
            }
        },
        cssmin: {
            'add_banner': {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'static/css/syndicatedlife.min.css': [
                        'lib/client/css/cyborg.css',
                        'lib/client/css/custom.css'
                    ]
                }
            }
        },
        htmlmin: {
            dev: {
                expand: true,
                cwd: 'lib/client/views',
                src: ['**/*.html'],
                dest: ''
            },
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: 'lib/client/views',
                src: ['**/*.html'],
                dest: ''
            }
        }
    });

    grunt.registerTask('build', [
        'bower',
        'uglify',
        'cssmin',
        'htmlmin:dev'
    ]);

    grunt.registerTask('default', [
        'build',
        'watch'
    ]);
};