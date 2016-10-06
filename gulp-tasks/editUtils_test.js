'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var editUtils = require('./editUtils');

var PAGE_TITLE_TESTS = [
	{ expected: true, test: "This Is a Correct Title One"},
	{ expected: false, test: "this Is an Incorrect Title One"},
	{ expected: false, test: "This is Another incorrect Title One"},
	{ expected: true, test: "Re-rastering Composited Layers on Scale Change"}
]

var TITLE_TESTS = [,
	{ expected: true, test: "This is a correct title two"},
	{ expected: false, test: "This Is an Incorrect Title Two"},
	{ expected: false, test: "this is another incorrect title two"},
	{ expected: false, test: "this Is also incorrect"},
]

gulp.task('test-edits', function(callback) {

	PAGE_TITLE_TESTS.forEach(function(val, index, array) {
		var result = editUtils.isTitleCase(val.test);
		gutil.log(result);
		if (result == val.expected) {
			gutil.log("[PASSED] ", val.test);
		} else {
			gutil.log("[FAILED] isTitleCase() returned", result, "for:", val.test);
		}
	});

	TITLE_TESTS.forEach(function(val, index, array) {
		var result = editUtils.isSentenceCase(val.test);
		gutil.log(result);
		if (result == val.expected) {
			gutil.log("[PASSED] ", val.test);
		} else {
			gutil.log("[FAILED] isSentenceCase() returned", result, "for:", val.test);
		}
	});

});