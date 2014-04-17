module.exports = function(grunt) {

	require('jit-grunt')(grunt);

	// configurable paths
	var yeoman = {
		app : 'app',
		dist : 'dist'
	};

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		yeoman : {
			app : 'app',
			dist : 'dist'
		},
		devUpdate : {
			main : {
				options : {
					reportUpdated : false,
					updateType : "force"
				}
			}
		},
		watch : {
			scss : {
				files : ['scss/**/*.scss'],
				tasks : 'scss'
			},
			html : {
				files : ['app/**/*.yml'],
				tasks : 'html'
			},
			js : {
				files : ['scripts/**/*.js'],
				tasks : 'js'
			},

			livereload : {
				options : {
					livereload : true
				},
				tasks : ["bowerInstall:temp"],
				files : ['temp/**/*.html', 'temp/resources/styles/css/{,*/}*.css', 'temp/resources/scripts/js/{,*/}*.js']
			}
		},
		sass : {
			build : {
				files : [{
					src : ['**/*.scss', '!**/_*.scss'],
					cwd : 'scss',
					dest : 'css',
					ext : '.css',
					expand : true
				}],
				options : {
					style : 'expanded'
				}
			}
		},
		connect : {
			server : {
				options : {
					port : 9001,
					protocol : 'http',
					hostname : 'localhost',
					base : './temp/',
					keepalive : false,
					livereload : true,
					open : true
				}
			}
		},
		assemble : {
			options : {
				flatten : true,
				layout : 'default.yml',
				layoutdir : 'app/layouts/',
				assets : 'dist/assets',
				partials : ['app/includes/*.yml']
			},
			build : {
				options : {
					data : ['/data/*.{json,yml}']
				},
				files : {
					'build/' : ['app/*.yml']
				}
			},
			temp : {
				options : {
					data : ['/data/*.{json,yml}']
				},
				files : {
					'temp/' : ['app/*.yml']
				}
			}
		},
		copy : {
			temp : {
				files : [{
					expand : true,
					cwd : './app/resources/styles/',
					src : ['./**/*.*'],
					dest : 'temp/resources/styles/'
				}, {
					expand : true,
					cwd : './bower_components/',
					src : ['./**/*.*'],
					dest : 'temp/bower_components/'
				}, {
					expand : true,
					cwd : './app/resources/scripts/',
					src : ['./**/*.*'],
					dest : 'temp/resources/scripts/'
				}, {
					expand : true,
					cwd : './app/resources/images/',
					src : ['./**/*.*'],
					dest : 'temp/resources/images/'
				}]
			},
			build : {
				files : [{
					expand : true,
					cwd : './app/resources/styles/',
					src : ['./**/*.*'],
					dest : 'build/resources/styles/'
				}, {
					expand : true,
					cwd : './app/resources/scripts/',
					src : ['./**/*.*'],
					dest : 'build/resources/scripts/'
				}, {
					expand : true,
					cwd : './app/resources/images/',
					src : ['./**/*.*'],
					dest : 'build/resources/images/'
				}]
			},
			css : {
				files : [{
					expand : true,
					cwd : './css',
					src : ['./**/*.*'],
					dest : 'build/resources/styles/css'
				}]
			}
		},
		cssmin : {
			temp : {
				expand : true,
				cwd : 'temp/resources/styles/css',
				src : ['*.css'],
				dest : 'temp/resources/styles/css',
				ext : '.css'
			},
			build : {
				expand : true,
				cwd : 'app/resources/styles/css',
				src : ['*.css'],
				dest : 'build/resources/styles/css',
				ext : '.css'
			}
		},
		useminPrepare : {
			options : {
				staging : 'tmp',
				dest : 'build/'
			},
			html : ['build/*.html'],
			css : ['app/resources/styles/css/*.css']
		},
		usemin : {
			options : {
				dirs : 'build/',
				dest : 'build/'
			},
			html : ['build/{,*/}*.html'],
			css : ['app/resources/styles/css/*.css']
		},
		bowerInstall : {
			temp : {
				src : ['temp/*.html'],
				cwd : 'temp/',
				dependencies : true,
				devDependencies : false,
				exclude : [],
				fileTypes : {},
				ignorePath : ''
			},
			build : {
				src : ['build/*.html'],
				cwd : '',
				dependencies : true,
				devDependencies : false,
				exclude : [],
				fileTypes : {},
				ignorePath : ''
			},
		},
		clean : {
			build : ['tmp', 'build/resources/styles/css/*.css', '!build/resources/styles/css/main.css']
		},
		uglify : {
			temp : {
				files : [{
					expand : true,
					cwd : 'temp/resources/scripts/js',
					src : '**/*.js',
					dest : 'temp/resources/scripts/js'
				}]
			},
			build : {
				files : [{
					expand : true,
					cwd : 'build/resources/scripts/js',
					src : '**/*.js',
					dest : 'build/resources/scripts/js'
				}]
			}
		},
		less : {
			build : {
				files : [{
					expand : true,
					cwd : 'app/resources/styles/less',
					cleancss : true,
					src : '*.less',
					dest : 'app/resources/styles/css',
					ext: '.css'
				}]
			},
			temp : {
			    options: {
			        paths: ['app/resources/styles/less']
			    },
			    src: {
			        expand: true,
			        cwd:    "app/resources/styles/css",
			        src:    "*.less",
			        ext:    ".css"
			    }
			}
		}
	});

	// Update NPM Modules
	grunt.registerTask('update', ['devUpdate']);

	// Default task
	grunt.registerTask('default', ['sass', 'autoprefixer', 'assemble', 'copy']);

	grunt.registerTask('scss', ['sass', 'autoprefixer', 'copy:css']);
	grunt.registerTask('html', ['assemble']);
	grunt.registerTask('js', ['copy:js']);

	grunt.registerTask('serve', ['copy:temp', 'cssmin:temp', 'uglify:temp', 'assemble:temp', 'bowerInstall:temp', 'connect', 'watch']);
	grunt.registerTask('build', ['copy:build', 'cssmin:build', 'assemble:build', 'bowerInstall:build', 'useminPrepare', 'usemin', 'concat', 'uglify', 'cssmin']);
	grunt.registerTask('deploy', ['gh-pages']);

	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-bower-install');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-less');

};
