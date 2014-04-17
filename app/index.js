'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

function replaceSpaces(string) {
	return string.replace(/ /g,"_");
}

var AquaGenerator = yeoman.generators.Base.extend({
	init : function() {
		this.pkg = require('../package.json');

		this.on('end', function() {
			if (!this.options['skip-install']) {
				this.installDependencies();
			}
		});
	},

	askFor : function() {
		var done = this.async();

		// have Yeoman greet the user
		//this.log(this.yeoman);

		// replace it with a short and sweet description of your generator
		this.log(chalk.magenta('You\'re using the fantastic Aqua generator.'));

		var prompts = [
			/*
			{
				name : 'jobNo',
				message : 'What is the job no for this project?'
			},
			{
				name : 'client',
				message : 'What Client is this build for?'
			},
			*/
			{
				name : 'projectName',
				message : 'What is the project/campaign name?'
			},
			{
				type: 'checkbox',
				name : 'dependencies',
				message : 'Would you like to include any of the following libraries?',
				choices: [
					{
						name: 'jQuery',
						value: '"jquery": "1.11.0"'
					},
					{
						name: 'Carousel',
						value: '"slick-carousel": "1.3.4"'
					},
					{
						name: 'Validation',
						value: '"jquery.validation": "latest"'
					}									
				]
			},			
			{
	            type: 'confirm',
	            name: 'track',
	            message: 'Would you like to include Google Analytics?',
	            default: true
	        },
			{
				when : function(response) {
					return response.track;
				},
	            name: 'gaq',
	            message: 'Please enter the Google Analytics UA Code:',
	            default: 'UA-XXXXXXXX-X'
	        }	        							
		];


		this.prompt(prompts, function(props) {
			// `props` is an object passed in containing the response values, named in
			// accordance with the `name` property from your prompt object. So, for us:
			this.jobNo = props.jobNo;
			this.client = props.client;
			this.projectName = props.projectName;
			this.confirm = props.confirm;
			this.gaq = props.gaq;
			this.dependencies = props.dependencies

			done();
		}.bind(this));
	},
	createDirectories: function(){
		// Resources directory
		//var webproject = this.jobNo+'_'+this.client+'_'+this.projectName.split(' ').join('_');
		//this.mkdir('app/'+webproject);
		var webproject = '';		
		this.mkdir('app');
		this.mkdir('app/templates');	
		this.mkdir('app/includes');		
		this.mkdir('app/pages');	
		this.mkdir('app/layouts');	
		this.mkdir('app/'+webproject+'/resources');	
		this.mkdir('app/'+webproject+'/resources/images');	
		this.mkdir('app/'+webproject+'/resources/scripts');	
		this.mkdir('app/'+webproject+'/resources/styles');
		this.mkdir('app/'+webproject+'/resources/styles/css');	
		this.mkdir('app/'+webproject+'/resources/styles/less');			
	},
	createProjectFiles: function() {

		var webproject = '';	

	    var context = {
	        site_name: this.projectName,
	        ua_code: this.gaq,
	        gaq: '{{>google_analytics}}'
	    };			
		
	    this.copy("_main.css",'app/'+webproject+'/resources/styles/css/main.css'); 
	    this.copy("css/base.css",'app/'+webproject+'/resources/styles/css/base.css'); 
	    this.copy("less/import.less",'app/'+webproject+'/resources/styles/less/import.less'); 
	    
	    
	    this.copy('layouts/default.yml', 'app/layouts/default.yml');
	    this.copy('pages/default.yml', 'app/default.yml');
	    
	    var ua_code_tracking, ua_include;
		if (this.gaq) {
			this.template("partials/google_analytics.yml", "app/includes/google_analytics.yml", context);
			this.template("partials/footer.yml", "app/includes/footer.yml", context);
		} else {
			ua_code_tracking = 'UA-XXXXXXXX-X';
			this.copy('partials/footer.yml', 'app/includes/footer.yml'); 			
		}   
		
		this.copy('partials/header.yml', 'app/includes/header.yml'); 
		this.copy('partials/navigation.yml', 'app/includes/navigation.yml'); 
		
		
				
	},
	projectfiles : function() {
		this.copy('editorconfig', '.editorconfig');
		this.copy('jshintrc', '.jshintrc');
	    this.copy("_gruntfile.js", "Gruntfile.js");
	    this.copy("_package.json", "package.json");		
	    
		var dep = this.dependencies
		var depLength = dep.length;
		
		if ( depLength > 0 ) {
			var depCurrent = 0;
			var depString = ''
			dep.forEach(function(entry) {
				depCurrent++;
				
				if ( depCurrent !== depLength ) {
					depString += entry+','
				} else {
					depString += entry;
				} 
			});	
		    var context = {
		        dependencies: depString
		    };		
		    
		    this.template("_bower.json", "bower.json", context);		
		    					
		} else {
			this.copy("_bower.json", "bower.json");		
		}	
		    
	    
	    
	},
	addUtilies: function(){
	    // Add utilities
		this.copy('build.bat', 'app/_build.bat');	
		this.copy('server.bat', 'app/_server.bat');				
	},
	runNpm: function(){
	    var done = this.async();
	    this.npmInstall("", function(){
	        console.log("\nEverything Setup !!!\n");
	        done();
	    });
	}	
});

module.exports = AquaGenerator; 
