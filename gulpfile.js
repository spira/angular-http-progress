/*jslint node: true */ // allow 'require' global
'use strict';

var gulpCore = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins({
        pattern: [
            'gulp-*',
            'gulp.*',
            'event-stream',
            'del',
            'globby',
            'inquirer',
            'main-bower-files',
            'minimatch',
            'run-sequence',
            'json5',
            'merge2'
        ],
        rename: {}
    }),
    gulp = plugins.help(gulpCore),
    _ = require('lodash'),
    path = require('path'),
    bowerJson = require('./bower.json'),
    packageJson = require('./package.json')
    ;


var tsDefinitions = './typings/**/*.d.ts';
var sources = {
    tsd: './typings/**/*.d.ts',
    app: {
        ts: [tsDefinitions, './src/**/*.ts']
    },
    test: {
        ts: [tsDefinitions, './test/**/*.ts']
    }
};

var destinations = {
    app: './dist',
    testTmp: './test/tmp',
    coverage: 'reports/**/lcov.info'
};

gulp.task('test', 'runs test sequence for frontend', function (cb) {
    return plugins.runSequence('clean', 'js:app', 'js:test', 'test:karma', cb);
});

gulp.task('js:test', function () {

    var tsResult = gulp.src(sources.test.ts)
        .pipe(plugins.typescript({
            target: "ES5",
            typescript: require('typescript')
        }));

    return tsResult.js.pipe(gulp.dest(destinations.testTmp))

});

gulp.task('test:karma', function () {

    var vendorFiles = plugins.mainBowerFiles({
        includeDev: true,
        paths: {
            bowerDirectory: 'bower_components',
            bowerJson: 'bower.json'
        }
    });

    vendorFiles = vendorFiles.map(function (path) {
        return path.replace(/\\/g, "\/").replace(/^.+bower_components\//i, './bower_components/');
    });

    var testFiles = [].concat(
        vendorFiles, destinations.testTmp + '**/*.js', destinations.app + '**/*.js'
    );

    gulp.src(testFiles)
        .pipe(plugins.karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function (err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });

});

gulp.task('js:app', function () {

    var tsResult = gulp.src(sources.app.ts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.typescript({
            target: "ES5",
            noExternalResolve: true,
            typescript: require('typescript'),
            out: path.basename(bowerJson.main),
            declarationFiles: true
        }, undefined, plugins.typescript.reporter.longReporter()));

    return plugins.merge2([
        tsResult.dts
            .pipe(plugins.replace('<reference path="typings', '<reference path="../typings'))
            .pipe(gulp.dest(destinations.app)),

        tsResult.js
            .pipe(plugins.sourcemaps.write('./', {includeContent: false, sourceRoot: '../src/'}))
            .pipe(gulp.dest(destinations.app))
    ]);

});

// deletes the dist folder for a clean build
gulp.task('clean', function () {
    return plugins.del(['./dist', destinations.testTmp], function (err, deletedFiles) {
        if (deletedFiles.length) {
            plugins.util.log('Deleted', plugins.util.colors.red(deletedFiles.join(' ,')));
        } else {
            plugins.util.log(plugins.util.colors.yellow('/dist directory empty - nothing to delete'));
        }
    });
});

gulp.task('build', [
    'js:app'
]);

gulp.task('bump', function (cb) {

    var questions = [
        {
            type: 'list',
            message: 'What type of release is this?',
            name: 'bumpType',
            choices: [
                {
                    name: 'Patch (minor fix, no breaking changes)',
                    value: 'patch'
                },
                {
                    name: 'Minor (minor improvement, extended functionality, no breaking changes)',
                    value: 'minor'
                },
                {
                    name: 'Major (Breaking Changes)',
                    value: 'major'
                }
            ]
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: function (answers) {
                return 'Are you sure you want to bump the ' + answers.bumpType + ' version?'
            }
        }

    ];

    plugins.inquirer.prompt(questions, function (answers) {

        if (answers.confirm === true) {

            return gulp.src(['./package.json', './bower.json'])
                .pipe(plugins.bump({type: answers.bumpType}))
                .pipe(gulp.dest('./'))
                .pipe(plugins.git.commit('chore(semver): bump ' + answers.bumpType + ' version'))
                .pipe(plugins.filter('package.json'))  // read package.json for the new version
                .pipe(plugins.tagVersion())           // create tag
            ;
        }
    });
});

// watch scripts, styles, and templates
gulp.task('watch', function () {
    gulp.watch(sources.app.ts, ['js:app']);
});

// default
gulp.task('default', ['build', 'watch']);

gulp.task('coveralls', 'submits code coverage to coveralls', [], function () {
    gulp.src(destinations.coverage)
        .pipe(plugins.coveralls());
});
