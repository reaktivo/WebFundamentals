'use strict';

var fs = require('fs');
var gulp = require('gulp');
var path = require('path');
var glob = require('globule');
var moment = require('moment');
var jsYaml = require('js-yaml');
var gutil = require('gulp-util');
var wfHelper = require('./wfHelper');

var TEST_ROOT = 'src/content/';
var STD_EXCLUDES = [
  '!**/_common-links.md',
  '!**/_generated.md',
  '!**/_template.md',
  '!**/tags/*',
  '!**/en/fundamentals/getting-started/codelabs/*/*.md'
];

// ToDo: HTTP test fails to match 'HTTPs' and ignores 'https://' and 'http://'.
var APPROVED_VOCABULARY = [
  { label: '"DevTools" must be spelled and capitalized as shown.', regEx: /(?!DevTools)([dD]ev\s?[tT]ools)/ },
  { label: '"HTTP and HTTPS" must be capitalized.', regEx: /(?!HTTPS?[^s])(?!https?:)([Hh][Tt][Tt][Pp][Ss]?)/ },
  { label: '"Home screen" is two words.', regEx: /homescreen/ },
  { label: '"Mobile" should not be capitalized unless it begins a sentence.', regEx: /Mobile/ },
  { label: '"Website" is one word, not two.', regEx: /[Ww]eb [Ss]ite/ },
  { label: '"Service worker" should not be capitalized.', regEx: /(?!service worker)([Ss]ervice [Ww]orker)/ }
];


function reviewMarkdownFile(fileName) {
  var tags;
  var errors = [];
  var warnings = [];
  var fileContent = fs.readFileSync(fileName, 'utf8');


  APPROVED_VOCABULARY.forEach(function(str) {
    var result = str.regEx.exec(fileContent);
    if (result) {
      warnings.push({msg: 'Found misspelling "' + result[0] + '."', param: str.label});
    }
  });

  return {file: fileName, errors: errors, warnings: warnings};
  
}


gulp.task('edit-assist', function(callback) {
  var warnings = 0;
  var errors = 0;
  var errorList = [];
  var filesWithIssues = 0;
  var opts = {
    srcBase: TEST_ROOT,
    prefixBase: true
  };
  if (GLOBAL.WF.options.lang !== null) {
    opts.srcBase = path.join(TEST_ROOT, GLOBAL.WF.options.lang);
  }
  gutil.log('Base directory:', gutil.colors.cyan(opts.srcBase));
  gutil.log('Skipping wf_review_required tags:', gutil.colors.cyan(GLOBAL.WF.options.skipReviewRequired));
  gutil.log('Warn only:', gutil.colors.cyan(GLOBAL.WF.options.testWarnOnly));
  gutil.log('');

  gutil.log('Validating markdown (.md) files...');
  var files = glob.find(['**/*.md'], STD_EXCLUDES, opts);
  files.sort();
  files.forEach(function(fileObj) {
    var r = reviewMarkdownFile(fileObj);
    if (r.warnings.length > 0 || r.errors.length > 0) {
      filesWithIssues++;
      gutil.log(r.file);
      r.warnings.forEach(function(warning) {
        warnings++;
        gutil.log(' ', gutil.colors.yellow('WARNING'), warning.msg, gutil.colors.cyan(warning.param));
      });
      r.errors.forEach(function(error) {
        errors++;
        gutil.log(' ', gutil.colors.red('ERROR'), error.msg, gutil.colors.cyan(error.param));
        errorList.push(r.file + ': ' + error.msg + ' -- ' + error.param);
      });
    }
  });
  gutil.log('');
  gutil.log('Test Completed.');
  gutil.log('Files checked: ', gutil.colors.blue(files.length));
  gutil.log(' - with issues:', gutil.colors.yellow(filesWithIssues));
  gutil.log(' - warnings:   ', gutil.colors.yellow(warnings));
  gutil.log(' - errors:     ', gutil.colors.red(errorList.length));
  if (GLOBAL.WF.options.testWarnOnly === true) {
    callback();
  } else if (errorList.length > 0) {
    var err = new gutil.PluginError('test-suite', errorList.join('\n'));
    callback(err);
  }
});