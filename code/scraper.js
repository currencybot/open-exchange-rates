/**
 * scraper.js v0.2.1 - part of the open-source exchange rates project
 * by @josscrowcroft - josscrowcroft.com
 *
 * Scrapes currency conversion rates one-by-one from a web service, then saves them
 * into a formatted JSON API, then commits and pushes changes to git repository.
 *
 * Uses 'forever' to run the script as a daemon and restart in case of error/failure.
 *
 * `latest.json` contains the most recent exchange rates
 * `historical/[YYYY-MM-DD].json` contains exchange rates from past days (eg. 2011-10-09.json)
 *
 * More info: http://josscrowcroft.github.com/open-exchange-rates/
 *
 * This code released under MIT license
 */

var argv = require('optimist').argv,
	_ = require('underscore'),
	httpAgent = require('http-agent'),
	async = require('async'),
	date = require('datejs'),
	fs = require('fs'),
	exec = require('child_process').exec;


// Make sure we have all default arguments:
argv = _.defaults(argv, {
	sleep : 3600000,  // time between crawls, default 1 hour
	throttle : 0, // time between requests, default 10 secs
	nocommit : false, // pass --nocommit to run the scraper without `git commit`
	nopush : false,   // pass --nopush to run without `git push`
	log : false       // pass --log to write to logfiles
});


// Scraper setup:
var baseCurrency = "USD",
	agent,
	requests,
	responses;


// Log function, only logs if `--log` specified in argv:
function log() {
	if( argv.log ) {
		console.log.apply(console, [].slice.call(arguments));
	}
	return false;
}

// Returns a date object set to UTC time for dateJS chaining:
function getUTC() {
	return Date.parse('now').add({ hours: -parseInt(Date.today().getUTCOffset(), 10) });
}

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
		if ( sortedKeys.hasOwnProperty(j) ) {
			sortedObj[sortedKeys[j]] = arr[sortedKeys[j]];
		}
	}
	return sortedObj;
}

// Sets up the agent and starts it with a log message:
function startAgent() {
	// Create the array of requests:
	requests = [{
			method: 'GET',
			uri : 'webservice/v1/symbols/allcurrencies/quote;currency=true?view=basic&format=json'
	}];
	responses = {};

	// Create the HTTP agent:
	agent = httpAgent.create('finance.yahoo.com', requests);

	// The scraper:
	agent.addListener('next', function (e, agent) {
		var data = JSON.parse(agent.body);
		var resources = data.list.resources;

		resources.forEach(function (resource) {
			var fields = resource.resource.fields;

			var currency_match = fields.name.match(/USD\/([A-Z]{3})/);
			if (currency_match) {
				var identifier = currency_match[1];
				var rate = parseFloat(parseFloat(fields.price).toFixed(8));
				responses[identifier] = rate;
			}
		});

		// Move on to the next request after `throttle` milliseconds (spreads the requests to avoid bans):
		setTimeout(function() {
			agent.next();
		}, argv.throttle );
	});
	
	
	// Save the file and push to git when agent is done collecting data:
	agent.addListener('stop', function (e, agent) {
		// temporary kludge, should work though:
		responses[baseCurrency] = 1;
		
		// Build API data:
		var api = {
			disclaimer : "This data is collected from various providers and provided free of charge for informational purposes only, with no guarantee whatsoever of accuracy, validity, availability, or fitness for any purpose; use at your own risk. Other than that, have fun! More info: http://openexchangerates.org/terms/",
			license : "Data collected from various providers with public-facing APIs; copyright may apply; not for resale; no warranties given. Full license info: http://openexchangerates.org/license/",
			timestamp : Math.round( ( getUTC() ).getTime() / 1000 ),
			base: baseCurrency,
			rates : sortArrayByKey(responses)
		};
	
		log("timestamp: " + Math.round( ( getUTC() ).getTime() / 1000 ) + " (" + getUTC().toString() + ")");
		log("[" + new Date().toUTCString() + "]: agent finished");
		
		// Write the latest and historical files, then commit and push to git when all done:
		async.parallel(
			[
				function(callback) {
					fs.writeFile("latest.json", JSON.stringify(api, false, "\t") + "\n", function(err) {
						callback(err);
					});
				},
				function(callback) {
					var filename = "./historical/" + (getUTC()).toString("yyyy-MM-dd") + ".json";
					fs.writeFile(filename, JSON.stringify(api, false, "\t") + "\n", function(err) {
						callback(err);
					});
				}
			],
			function(err) {
				// To do: add some error/success logging:
				if( !err && !argv.nocommit ) {
					// Commit changes to git repository and push when done:
					exec('git add . && git commit -am "exchange rates as of [' + new Date().toUTCString() + ']"', function(err, stdout, stderr) {
						if ( err || stderr ) log("[" + new Date().toUTCString() + "]: git add/commit:", err, stderr);
						if ( !argv.nopush ) {
							exec('git push origin master', function(err, stdout, stderr) {
								if ( err || stderr ) log("[" + new Date().toUTCString() + "]: git push:", err, stderr);
							});
							
						}
					});
				}
			}
		);
	
	});

	// Start the agent and log it:
	agent.start();
	log("[" + new Date().toUTCString() + "]: agent started");
}


// Do the dirty business:
startAgent();

// Set the agent to run every `sleepyTime` milliseconds (default 1 hour):
setInterval(function() {
	startAgent();
}, argv.sleep);


// Take it away, currency bot!
// [http://currencybot.github.com]
