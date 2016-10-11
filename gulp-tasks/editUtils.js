'use strict';

var gutil = require('gulp-util');
var wfHelper = require('./wfHelper');

var UC_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`';
var LC_LETTERS = 'abcdefghijklmnopqrstuvwxyz0123456789`';
var LC_WORDS = ['a', 'against', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from',
                'in', 'into', 'near', 'nor', 'of', 'on', 'onto', 'or', 'the', 'to', 'with'];
var UC_WORDS = ['API', 'CSSOM', 'DR', 'FAQ', 'FCM', 'GIF', 'GIFs', 'HTML', 'HTTP', 'HTTPS', 'I', 'ID', 'NPN', 'SPDY', 'TL', 'TLS', 'UI', 'VAPID'];
// ToDo: Replace with external json file.
var DICTIONARY = ['absolute-positioned', 'Account Chooser', 'Application panel', 'Canary', 'Chrome', 'Clear Data', 'Credential Management API', 'DevTools', 'Foreign Fetch', 'Geolocation', 'iframe', 'IndexedDB', 'IntersectionObserver', 'JavaScript', 'MessageChannel','MediaStream', 'Origin Trial', 'PaymentRequest', 'Payment Request API', 'Resources panel', 'RTCCertificate', 'Sass', 'SharedWorkers', 'Web Animations', 'Web Push Protocol', 'X-Frame-Options'];
var PUNCTUATION = ['.?!'];

//Are there any restrictions to using the API?

function _stripPunctuation(title) {
	var titleLen = title.length -1;
	if ('.?!'.indexOf(title.charAt(titleLen)) >= 0 ) {
		title = title.substring(0, titleLen);
	}
	title = title.replace(/["“”'’\(\)\<\>\*\?;]{1}/, '');
	// gutil.log(title);
	return title;
}

function _stripOrdinal(title) {
	title = title.replace(/\d\d?\./, '');
	return title.trim();
}

function _regularizeCodeIdentifiers(title) {
	title = title.trim();
	var ids = title.match(/([a-zA-Z]+)\.[a-zA-Z]+(?:\(\))?/);
	if (ids) {
		if (title.indexOf(ids[0]) == 0) {
			title = title.replace(ids[0], ids[1]);
		} else {
			title = title.replace(ids[0], '');
		}
	}
	return title.trim();
}

function _regularizeTitle(title) {
	title = title.trim();
	title = _stripOrdinal(title);
	title = _regularizeCodeIdentifiers(title);
	title = _stripPunctuation(title);
	return title;
}

function isCodeSample(chunk) {
	if (chunk == "    # Writing an Article {: .page-title }") {
	}
 	var reIndent = /( {4}).+/g;
	var lines = (chunk.match(/\n/g)||['']).length;

	// var indents = chunk.match(reIndent).length;
	var matches = chunk.match(reIndent);
	var indents;
	if (matches) {
		indents = matches.length;
	} else {
		indents = 0;
	}
	return (lines == indents);
}

// Need to refactor for new approach: (1) split multi-sentence titles
// (2) remove things that shouldn't be considered (3) iterate remaining words

function isTitleCase(title) {
	title = _regularizeTitle(title);
	title = title.trim();
	DICTIONARY.forEach(function(noun, index, array) {
		if (title.indexOf(noun) >= 0) {
			var newNoun = noun.replace(' ', '_');
			if (title.indexOf(noun) > 0) {
				newNoun = newNoun.toUpperCase();
			}
			title = title.replace(noun, newNoun)
		}
	});

	var words = title.split(' ');
	var retVal = true;
	words.forEach(function(val, index, array) {
		// gutil.log(val);
		if (UC_LETTERS.indexOf(val.charAt(0)) < 0) {
			// gutil.log(val);
			if (LC_WORDS.indexOf(val.toLowerCase()) < 0) {
				// gutil.log(val);
				retVal = false;
				// gutil.log(retVal, val);
				return;
			}
		}
	});
	// gutil.log(retVal, title);
	return retVal;
}

function isSentenceCase(title) {
	title = _regularizeTitle(title);
	title = title.trim();
	// gutil.log(title);
	DICTIONARY.forEach(function(noun, index, array) {
		if (title.indexOf(noun) >= 0) {
			var newNoun = noun.replace(' ', '_');
			if (title.indexOf(noun) == 0) {
				newNoun = newNoun.toUpperCase();
			} else if (title.indexOf(noun) > 0) {
				newNoun = newNoun.toLowerCase();
			}
			title = title.replace(noun, newNoun)
		}
	});
	var words = title.split(' ');
	var retVal = true;
	words.forEach(function(val, index, array) {

		if (index == 0) {
			if (UC_LETTERS.indexOf(val.charAt(0)) < 0) {
				retVal = false;
				return;
			}
		} else {
			if ((LC_LETTERS.indexOf(val.charAt(0)) < 0) && 
				(UC_WORDS.indexOf(val.toUpperCase()) < 0) &&
				(val.indexOf('.') < 0)) {
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