/**
 * cleaner.js v0.0.2 - part of the open-source exchange rates project
 * by @josscrowcroft - josscrowcroft.com
 *
 * Cleans historical data files: ensures base rate is contained in rates object,
 * parses float values, sorts rates A-Z.
 *
 * Can be used to change properties across all API JSON files at once.
 *
 * More info: http://josscrowcroft.github.com/open-exchange-rates/
 *
 * This code released under MIT license
 */

var fs = require('fs');
var _ = require('underscore');

// Sorts arrays by key
function sortArrayByKey(arr) {
	// Setup Arrays
	var sortedKeys = [];
	var sortedObj = {};

	// Separate keys and sort them
	for (var i in arr) {
		sortedKeys.push(i);
	}
	sortedKeys.sort();

	// Reconstruct sorted obj based on keys
	for (var j in sortedKeys) {
		sortedObj[sortedKeys[j]] = arr[sortedKeys[j]];
	}
	return sortedObj;
}

// Read historical API files directory:
fs.readdir('../historical/', function(err, files) {
	if (err) throw err;

	// Iterate over files:
	_.each(files, function(file) {
		_.defer(function() {
			// Get file data:
			var data = fs.readFileSync('../historical/' + file, 'utf-8');
			var json = JSON.parse(data);

			// Update disclaimer:
			json.disclaimer = "This data is collected from various providers and provided free of charge for informational purposes only, with no guarantee whatsoever of accuracy, validity, availability, or fitness for any purpose; use at your own risk. Other than that, have fun! More info: http://openexchangerates.org/terms/";
			
			// Update license:
			json.license = "Data collected from various providers with public-facing APIs; copyright may apply; not for resale; no warranties given. Full license info: http://openexchangerates.org/license/";

			// Make sure timestamp is an integer:
			json.timestamp = parseInt(json.timestamp, 10);

			// Make sure the base currency is also in the rates object, eg. `USD: 1`
			json.rates[json.base] = 1;

			// Sort rates by key and parse float values to remove zero-padding:
			json.rates = _.reduce(sortArrayByKey(json.rates), function(obj, val, key) {
				obj[key] = parseFloat("" + val);
				return obj;
			}, {});

			// Write file contents:
			fs.writeFileSync('../historical/' + file, JSON.stringify(json, false, "\t") + "\n");

			console.log(file);
		});
	});
});
