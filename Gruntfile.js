/* global module */
module.exports = function(grunt) {
  'use strict';
  var settings = grunt.file.readJSON('settings.json');

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-ftp-deploy');
  grunt.loadNpmTasks('grunt-http');
  grunt.loadNpmTasks('grunt-html2js');

  grunt.initConfig({
    html2js: {
      options: {
        rename: function (moduleName) {
          return moduleName.replace('../', '');
        }
      },
      main: {
        src: ['app/**/*.html'],
        dest: 'build/tmp/templates.js'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'build/tmp/templates.js',
          'app/watchlist-app.js',
          'app/app-router.js',
          'app/main-controller.js',
          'app/**/*.js'
          ],
        dest: 'build/tmp/watchlist.js'
      }
    },
    copy:
    {
      build:
      {
        files: [
          {expand: true, src: ['css/**'], dest: 'build/'},
          {expand: true, src: ['svg//**'], dest: 'build/'},
          {expand: true, src: ['index.html'], dest: 'build/'},
          {expand: true, src: ['.htaccess'], dest: 'build/'},
          {expand: true, src: ['*.php'], dest: 'build/'},
          {expand: true, src: ['data/*.json'], dest: 'build/'},
          {expand: true, src: ['settings.json'], dest: 'build/'}
        ]
      }
    },
    less: {
      prod: {
        options: {
          cleancss: true,
          compress: true
        },
        files: {'css/watchlist.css': 'css/less/watchlist.less'}
      }
    },
    watch: {
      scripts: {
        files: ['css/less/*.less', 'css/less/common/*.less'],
        tasks: ['less']
      }
    },
    cssmin: {
      build: {
        expand: true,
        cwd: 'css',
        src: ['*.css'],
        dest: 'build/css',
        ext: '.min.' + settings.version + '.css'
      }
    },
    shell: {
      setupbuild:
      {
        command: [
          'mkdir build',
          'mkdir build/js',
          'mkdir build/tmp'
        ].join('&&')
      },
      cleanbuild:
      {
        command: [
          'rm -rf build/tmp',
          'rm -rf build/css/common',
          'rm build/css/icons.css',
          'rm build/css/watchlist.css',
          'rm build/css/*.less'
        ].join('&&')
      },
      removebuild:
      {
        command: 'rm -rf build'
      },
      master: {
        command: ['git checkout master'].join('&&')
      },
      'merge-develop': {
        command: ['git merge --squash develop'].join('&&')
      },
      list: {
        command: ['git add data/list.json'].join('&&')
      },
      compose:{
        command:'git log `git describe --tags --abbrev=0 HEAD^`..HEAD --oneline|awk \'/Version/ {exit} {print}\' > commit_message'
      }
    },
    replace: {
      version: {
        src: ['build/index.html'],
        overwrite: true,
        replacements: [{
          from: '<title>Watchlist</title>',
          to: '<title>Watchlist - ' + settings.version + '</title>'
        },
        {
          from: 'watchlist.js',
          to: 'watchlist.min.' + settings.version + '.js'
        },
        {
          from: 'css/watchlist.css',
          to: 'css/watchlist.min.' + settings.version + '.css'
        }]
      }
    },
    'ftp-deploy': {
      deploy: {
        auth: {
          host: 'ftp.lostmarbles.nl',
          port: 21,
          authKey: 'live'
        },
        src: 'build',
        dest: 'watchlist.lostmarbles.nl',
        exclusions: []
      }
    },
    http: {
      clean: {
        options:
        {
          uri: 'http://watchlist.lostmarbles.nl/clean.php',
          json: true,
          callback: function(error, response, body) {
            if (response.statusCode === 200) {
              var files = body.data,
                  i;
              for (i = files.length - 1; i >= 0; i--) {
                grunt.log.warn('Removed ', files[i], '\n');
              }
              grunt.log.write(body.message, '\n');
            }
          }
        }
      },
      'update-list': {
        options: {
          uri: 'http://watchlist.lostmarbles.nl/data/list.json',
          json: false,
          callback: function(error, response, body) {
            if (response.statusCode === 200) {
              grunt.file.write('data/list.json', body);
              grunt.task.run('shell:list');
              grunt.log.write('Synced list.json with production\n');
            }
          }
        }
      }
    }
  });

  // patch, minor and major version bumping
  grunt.registerTask('patch', 'Update patch version', function() {
    var versioning = settings.version.split('.'),
        version;
    versioning[2] = parseInt(versioning[2], 10) + 1;
    version = versioning.join('.');
    grunt.config.set('version', version);
    grunt.task.run('deploy-version');
  });
  grunt.registerTask('minor', 'Update minor version', function() {
    var versioning = settings.version.split('.'),
        version;
    versioning[1] = parseInt(versioning[1], 10) + 1;
    versioning[2] = 0;
    version = versioning.join('.');
    grunt.config.set('version', version);
    grunt.task.run('deploy-version');
  });
  grunt.registerTask('major', 'Update major version', function() {
    var versioning = settings.version.split('.'),
        version;
    versioning[0] = parseInt(versioning[0], 10) + 1;
    versioning[1] = 0;
    versioning[2] = 0;
    version = versioning.join('.');
    grunt.config.set('version', version);
    grunt.task.run('deploy-version');
  });

  grunt.registerTask('merge-config', 'Mergin version into configuration', function() {
    var version = grunt.config.get('version');
    grunt.config.merge({
      cssmin: {build: {ext: '.min.' + version + '.css'}},
      shell: {
        cleanbuild: {command: [
          'cp build/tmp/watchlist.js build/js/watchlist.' + version + '.js',
          'rm -rf build/tmp',
          'rm build/css/watchlist.css',
          'rm build/css/*.less',
          'rm build/js/watchlist.min.' + version + '.js.report.txt'].join('&&')},
        version: {command: ['git add settings.json'].join('&&')},
        tag: {command: 'git tag v' + version},
        commit: {command: 'git commit -F commit_message'},
        'clean-message': {command: 'rm commit_message'},
        'push-master': {command:['git push', 'git checkout develop'].join('&&')},
        compose: {command:'echo "Version '+ version + '\n\n"|cat - commit_message > tmp && mv tmp commit_message'}
      },
      replace: {version: {replacements: [
        {from: '<title>Watchlist</title>', to: '<title>Watchlist - ' + version + '</title>'},
        {from: 'watchlist.js',to: 'watchlist.' + version + '.js'},
        {from: 'css/watchlist.css',to: 'css/watchlist.min.' + version + '.css'}
      ]}}
    });
  });

  grunt.registerTask('deploy-version', 'Update version, commit, tag and deploy', function() {
    // deploy versions on master
    grunt.task.run('shell:compose');
    grunt.task.run('shell:master');
    // squash merge develop
    grunt.task.run('shell:merge-develop');
    // add the list
    grunt.task.run('http:update-list');
    // merge configs with new version
    grunt.task.run('merge-config');
    settings.version = grunt.config.get('version');
    grunt.log.write('Bumped version to ', settings.version);
    grunt.file.write('settings.json', JSON.stringify(settings, undefined, 2), function() {});
    grunt.task.run('shell:version');
    grunt.task.run('shell:tag');
    // commit everything
    grunt.task.run('shell:compose');
    grunt.task.run('shell:commit');
    grunt.task.run('shell:clean-message');
    grunt.task.run('deploy');
    grunt.task.run('shell:push-master');
  });

  grunt.registerTask('deploy', 'Deploy watchlist.lostmarbles.nl', function() {
    grunt.log.subhead('Deploying ' + settings.name + '. v' + settings.version);
    grunt.config.set('version', settings.version);
    grunt.task.run('merge-config');
    grunt.task.run('shell:setupbuild');
    grunt.task.run('html2js'); // compile templates
    grunt.task.run('concat'); // concatenate js to temp
    grunt.task.run('copy:build'); // copy files to build
    grunt.task.run('less:prod'); // compile and copy css to build
    grunt.task.run('cssmin:build'); // compile and copy css to build
    grunt.task.run('replace:version');  // update file and version reference
    grunt.task.run('shell:cleanbuild');
    grunt.task.run('ftp-deploy:deploy'); // ftp build to deploy
    grunt.task.run('shell:removebuild');
    //grunt.task.run('http:clean'); // clean up previous version css and js files
  });

  grunt.registerTask('test-build', 'Test building of source code', function() {
    grunt.log.subhead('Test build for version ', settings.version);
    grunt.config.set('version', settings.version);
    grunt.task.run('merge-config');
    grunt.task.run('shell:setupbuild');
    grunt.task.run('html2js'); // compile templates
    grunt.task.run('concat'); // concatenate js to temp
    grunt.task.run('copy:build'); // copy templates, js, and css to build
    grunt.task.run('cssmin:build'); // compile and copy css to build
    grunt.task.run('replace:version');  // update file and version reference
    grunt.task.run('shell:cleanbuild');
  });

  grunt.registerTask('css-test', 'Compile CSS for watchlist.lostmarbles.nl for debugging', function() {
    grunt.task.run('cssmin:build'); // compile and copy css to build
  });
};
