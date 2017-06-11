module.exports = function(grunt) {

    let libs = [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-animate/angular-animate.min.js',
        'node_modules/angular-aria/angular-aria.min.js',
        'node_modules/angular-messages/angular-messages.min.js',
        'node_modules/angular-sanitize/angular-sanitize.min.js',
        'node_modules/angular-material/angular-material.min.js',
        'node_modules/angular-material-icons/angular-material-icons.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'node_modules/angular-youtube-embed/dist/angular-youtube-embed.min.js',
        'node_modules/firebase/firebase.js',
        'node_modules/angularfire/dist/angularfire.min.js',
        'node_modules/showdown/dist/showdown.min.js',
        'node_modules/ng-showdown/dist/ng-showdown.min.js',
        'node_modules/textangular/dist/*.min.js',
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'sw-precache': {
            options: {
                cacheId: 'v',
                baseDir: './',
                workerFileName: 'build/sw.js',
                stripPrefix: './build/',
                verbose: true,
            },
            'develop': {
                staticFileGlobs: [
                    'build/components/**/*.html',
                    'build/dialogs/**/*.html',
                    'build/fonts/**/*.{woff,ttf,svg,eot}',
                    'build/css/**/*.css',
                    'build/images/**/*.{gif,png,jpg}',
                    'build/js/**/*.js',
                    'build/*.html',
                    'build/*.json',
                ],
            },
        },

        concat: {
            components: {
                src: ['components/**/*.js'],
                dest: 'build/js/components.js'
            },
            dialogs: {
                src: ['dialogs/**/*.js'],
                dest: 'build/js/dialogs.js'
            },
            libs: {
                src: libs,
                dest: 'build/js/libs.min.js'
            },
            services: {
                src: ['services/*.js'],
                dest: 'build/js/services.js'
            },
        },
        copy: {
            component: {
                expand: true,
                src: ['components/**/*.html'],
                dest: 'build/'
            },
            dialogs: {
                expand: true,
                src: ['dialogs/**/*.html'],
                dest: 'build/'
            },
            firebase: {
                expand: true,
                src: ['.firebaserc', 'database.rules.json', 'firebase.json'],
                dest: 'build/'
            },
            main: {
                expand: true,
                src: ['favicon.ico', 'manifest.json', 'index.html', 'js/**', 'images/**'],
                dest: 'build/'
            },
            css: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: [
                    'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/font-awesome/css/font-awesome.min.css',
                    'node_modules/textangular/dist/textAngular.css'
                ],
                dest: 'build/css/'
            },
            font: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: ['node_modules/font-awesome/fonts/**'],
                dest: 'build/fonts/'
            }
        },
        sass: {
            css: {
                files: {
                    'build/css/app.css': 'css/app.scss'
                }
            }
        },
        uglify: {
            main: {
                files: [{
                    expand: true,
                    src: 'build/js/*.js',
                    dest: 'build/js/'
                }]
            }
        },
        clean: {
            build: ['build/**']
        },
        shell: {
            firebaseServe: {
                command: [
                    'cd build',
                    'firebase serve'
                ].join('&&')
            }
        },
        watch: {
            scripts: {
                files: ['components/**/*.js', 'dialogs/**/*.js', 'services/**/*.js'],
                tasks: ['concat:components, concat:dialogs, concat:services'],
                options: {
                    spawn: false,
                },
            },
            html: {
                files: ['components/**/*.html', 'dialogs/**/*.html', 'services/**/*.html'],
                tasks: ['copy'],
                options: {
                    spawn: false,
                },
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-sw-precache');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'concat', 'sass', 'copy', 'sw-precache', 'shell', 'watch']);

};