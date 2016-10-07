'use strict';

var gutil = require('gulp-util');
var wfHelper = require('./wfHelper');

var UPPERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var LOWERS = 'abcdefghijklmnopqrstuvwxyz';
var LC_WORDS = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from',
                'in', 'into', 'near', 'nor', 'of', 'on', 'onto', 'or', 'the', 'to', 'with'];
var UC_WORDS = ['DR', 'HTTP', 'HTTPS', 'ID', 'TL'];

function isCodeSample(chunk) {
	var reIndent = /( {4}).+/g;
	var lines = (chunk.match(/\n/g)||[]).length;
	var indents = chunk.match(reIndent).length;
	return (lines == indents);
}

function isTitleCase(title) {
	var words = title.split(' ');
	var retVal = true;
	words.forEach(function(val, index, array) {
		if (UPPERS.indexOf(val.charAt(0)) < 0) {
			if (LC_WORDS.indexOf(val.toLowerCase()) < 0) {
				retVal = false;
				return;
			}
		}
	});
	return retVal;
}

function isSentenceCase(title) {
	var words = title.split(' ');
	var retVal = true;
	words.forEach(function(val, index, array) {
		if (index == 0) {
			if (UPPERS.indexOf(val.charAt(0)) < 0) {
				retVal = false;
				return;
			}
		} else {
			if ((LOWERS.indexOf(val.charAt(0)) < 0) && (UC_WORDS.indexOf(val.toUpperCase()) < 0)) {
				retVal = false;
				return;
			}
		}
	});
	return retVal;
}

exports.isTitleCase = isTitleCase;
exports.isSentenceCase = isSentenceCase;
exports.isCodeSample = isCodeSample;