'use strict';

var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var wfHelper = require('./wfHelper');
var wfContributors = require('./wfContributors');
var wfTemplateHelper = require('./wfTemplateHelper');
var wfYouTubeShows = require('./wfYouTubeShows');
var wfCodeLabHelper = require('./wfCodeLabHelper');

gulp.task('build:contributors', function() {
  wfContributors.build();
});

gulp.task('build:fundamentals', function() {
  var section = 'fundamentals';
  var baseOutputPath = path.join(GLOBAL.WF.src.content, section);
  var options = {
    title: 'Web Fundamentals - Google Developers',
    description: 'The latest changes to https://developers.google.com/web/fundamentals',
    section: section,
    outputPath: baseOutputPath
  };
  var startPath = path.join(GLOBAL.WF.src.content, section);
  var files = wfHelper.getFileList(startPath, ['**/*.md']);
  files.sort(wfHelper.updatedComparator);
  wfTemplateHelper.generateFeeds(files, options);
});

gulp.task('build:showcase', function() {
  var section = 'showcase';
  var baseOutputPath = path.join(GLOBAL.WF.src.content, section);
  var options = {
    title: 'Web Showcase - Google Developers',
    description: 'Learn how other developers have been awesome.',
    section: section,
    outputPath: baseOutputPath
  };
  var startPath = path.join(GLOBAL.WF.src.content, 'showcase');
  var patterns = ['**/*.md', '!**/index.md'];
  var files = wfHelper.getFileList(startPath, patterns);
  files.sort(wfHelper.publishedComparator);
  wfTemplateHelper.generateIndex(files, options);
  wfTemplateHelper.generateFeeds(files, options);
  var filesByYear = wfHelper.splitByYear(files);
  Object.keys(filesByYear).forEach(function(year) {
    options.outputPath = path.join(baseOutputPath, year);
    options.title = 'Showcase (' + year + ')';
    wfTemplateHelper.generateListPage(filesByYear[year], options);
    options.title = year;
    wfTemplateHelper.generateTOCbyMonth(filesByYear[year], options);
  });
});

gulp.task('build:shows', function() {
  wfYouTubeShows.buildFeeds();
});

gulp.task('build:tools', function() {
  var section = 'tools';
  var baseOutputPath = path.join(GLOBAL.WF.src.content, section);
  var options = {
    title: 'Web Tools - Google Developers',
    description: 'The latest changes to https://developers.google.com/web/tools',
    section: section,
    outputPath: baseOutputPath
  };
  var startPath = path.join(GLOBAL.WF.src.content, section);
  var files = wfHelper.getFileList(startPath, ['**/*.md']);
  files.sort(wfHelper.updatedComparator);
  wfTemplateHelper.generateFeeds(files, options);
});

gulp.task('build:updates', function() {
  var section = 'updates';
  var baseOutputPath = path.join(GLOBAL.WF.src.content, section);
  var options = {
    title: 'Web Updates - Google Developers',
    description: 'The latest and freshest updates from the Web teams at Google. Chrome, Tooling and more.',
    section: section,
    outputPath: baseOutputPath
  };
  var startPath = path.join(GLOBAL.WF.src.content, section);
  var patterns = ['**/*.md', '!tags/*', '!**/index.md'];
  var files = wfHelper.getFileList(startPath, patterns);
  files.sort(wfHelper.publishedComparator);
  wfTemplateHelper.generateIndex(files, options);
  wfTemplateHelper.generateFeeds(files, options);
  options.outputPath = path.join(baseOutputPath, 'tags');
  wfTemplateHelper.generateTagPages(files, options);
  var filesByYear = wfHelper.splitByYear(files);
  Object.keys(filesByYear).forEach(function(year) {
    options.outputPath = path.join(baseOutputPath, year);
    options.title = 'Web Updates (' + year + ')';
    wfTemplateHelper.generateListPage(filesByYear[year], options);
    options.title = year;
    wfTemplateHelper.generateTOCbyMonth(filesByYear[year], options);
  });
});

gulp.task('build:codelabs', function() {
  var startPath = path.join(GLOBAL.WF.src.content, 'fundamentals/getting-started/codelabs');
  wfCodeLabHelper.migrate(startPath);
});

gulp.task('build:sitelevel', function() {});

gulp.task('build', function(cb) {
  runSequence(
    [
      'build:contributors',
      'build:fundamentals',
      'build:showcase',
      'build:shows',
      'build:tools',
      'build:updates'
    ],
    'build:sitelevel', cb);
});