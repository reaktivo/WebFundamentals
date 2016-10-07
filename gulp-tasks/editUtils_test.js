'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var editUtils = require('./editUtils');

var CODE_SAMPLE_TESTS = [
	{ expected: true, test: "    .containter {\n      width: 100%;\n    }\n"},
	{ expected: false, test: "   .containter {\n     width: 100%;\n   }\n"},
	{ expected: false, test: "   .containter {\n      width: 100%;\n    }\n"},
	{ expected: true, test: "    # Writing an Article {: .page-title }\n"},
	{ expected: true, test: "    # Writing an Article {: .page-title }"}
]

var PAGE_TITLE_TESTS = [
	{ expected: true, test: "This Is a Correct Title One"},
	{ expected: false, test: "this Is an Incorrect Title One"},
	{ expected: false, test: "This is Another incorrect Title One"},
	{ expected: true, test: "Re-rastering Composited Layers on Scale Change"},
	{ expected: true, test: " Builder "},
	{ expected: true, test: "DevTools Digest, September 2016: Perf Roundup"},
	{ expected: true, test: "Use of `initTouchEvent` Is Removed"}
]

var TITLE_TESTS = [,
	{ expected: true, test: "This is a correct title two"},
	{ expected: false, test: "This Is an Incorrect Title Two"},
	{ expected: false, test: "this is another incorrect title two"},
	{ expected: false, test: "this Is also incorrect"},
	{ expected: true, test: " Builder "},
	{ expected: true, test: "Origin Trial token"},
	{ expected: true, test: "Deprecate SVGSVGElement.viewPort"},
	{ expected: true, test: "How do I fix this?"},
	{ expected: true, test: "Use of `initTouchEvent` is removed"},
	{ expected: true, test: "Remove MediaStream ended event and attribute and onended attribute"}
]

function reportTest(testName, result, test) {
	// gutil.log(result);
	if (result == test.expected) {
		gutil.log("[PASSED] ", test.test);
	} else {
		gutil.log("[FAILED]", testName, "returned", result, "for:", test.test);
	}
}

gulp.task('test-edits', function(callback) {

	CODE_SAMPLE_TESTS.forEach(function(test, index, array) {
		var result = editUtils.isCodeSample(test.test);
		reportTest("isCodeSample()", result, test)
	});

	PAGE_TITLE_TESTS.forEach(function(test, index, array) {
		var result = editUtils.isTitleCase(test.test);
		reportTest("isTitleCase()", result, test);
	});

	TITLE_TESTS.forEach(function(test, index, array) {
		var result = editUtils.isSentenceCase(test.test);
		reportTest("isSentenceCase()", result, test)
	});

});