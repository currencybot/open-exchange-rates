/**
 * scraper.js - part of the open-source exchange rates project
 * by @josscrowcroft - josscrowcroft.com
 *
 * Scrapes currency conversion rates one-by-one from Google Calculator, saves them
 * into a formatted JSON API, then commits and pushes changes to git repository.
 *
 * Uses 'forever' to run the script as a daemon and restart in case of error/failure.
 *
 * `latest.json` contains the most recent exchange rates
 * `historical/[YYYY-MM-DD].json` contains exchange rates from past days (eg. 2011-10-09.json)
 *
 * More info: http://josscrowcroft.github.com/open-source-exchange-rates/
 *
 * License: http://www.opensource.org/licenses/GPL-3.0
 */

var sys = require('sys'),
	argv = require('optimist').argv,
	_ = require('underscore'),
	httpAgent = require('http-agent'),
	async = require('async'),
	date = require('datejs'),
	fs = require('fs'),
	exec = require('child_process').exec;


// Make sure we have all default arguments:
argv = _.defaults(argv, {
	sleep : 3600000,  // time between crawls, default 1 hour
	throttle : 10000, // time between requests, default 10 secs
	nocommit : false, // pass --nocommit to run the scraper without `git commit`
	nopush : false,   // pass --nopush to run without `git push`
	log : false       // pass --log to write to logfiles
});


// Scraper setup:
var baseCurrency = "USD",
	currencies = [
		"AED",
		"ANG",
		"ARS",
		"AUD",
		"BGN",
		"BHD",
		"BND",
		"BOB",
		"BRL",
		"BWP",
		"CAD",
		"CHF",
		"CLP",
		"CNY",
		"COP",
		"CRC",
		"CZK",
		"DKK",
		"DOP",
		"DZD",
		"EGP",
		"EUR",
		"FJD",
		"GBP",
		"HKD",
		"HNL",
		"HRK",
		"HUF",
		"IDR",
		"ILS",
		"INR",
		"JMD",
		"JOD",
		"JPY",
		"KES",
		"KRW",
		"KWD",
		"KYD",
		"KZT",
		"LBP",
		"LKR",
		"LTL",
		"LVL",
		"MAD",
		"MDL",
		"MKD",
		"MUR",
		"MXN",
		"MYR",
		"NAD",
		"NGN",
		"NIO",
		"NOK",
		"NPR",
		"NZD",
		"OMR",
		"PEN",
		"PGK",
		"PHP",
		"PKR",
		"PLN",
		"PYG",
		"QAR",
		"RON",
		"RSD",
		"RUB",
		"SAR",
		"SCR",
		"SEK",
		"SGD",
		"SLL",
		"SVC",
		"THB",
		"TND",
		"TRY",
		"TTD",
		"TWD",
		"TZS",
		"UAH",
		"UGX",
		"USD",
		"UYU",
		"UZS",
		"VND",
		"YER",
		"ZAR",
		"ZMK"
	],
	requests = _.map(currencies, function(each) {
		return {
			method: 'GET',
			cc : each,
			uri: 'ig/calculator?hl=en&q=1' + baseCurrency + '=?' + each
		}
	}),
	responses = {};


// Log function, only logs if `--log` specified in argv:
function log() {
	if( argv.log ) {
		console.log.apply(console, [].slice.call(arguments));
	}
	return false;
};

// Returns a date object set to UTC time for dateJS chaining:
function getUTC() {
	return Date.parse('now').add({ hours: -parseInt(Date.today().getUTCOffset(), 10) });
}

// Starts the agent with a log message:
function startAgent() {
	responses = {};
	agent.start();
	log("[" + new Date().toUTCString() + "]: agent started");
}


// Create the HTTP agent:
var agent = httpAgent.create('www.google.com', requests);


// The scraper:
agent.addListener('next', function (e, agent) {
	var data;

	// Try to parse JSON with cleaned up calculator response:
	try {
		data = JSON.parse(agent.body.replace('lhs', '"lhs"').replace('rhs', '"rhs"').replace('error', '"error"').replace('icc', '"icc"'));
	}
	catch(e) {}

	// Add this currency conversion rate to the responses object if valid:
	if ( data ) {
		responses[agent.current.cc] = parseFloat(data.rhs.replace(/[^0-9-.]/g, ''));
	}

	// Move on to the next request after `throttle` milliseconds (spreads the requests to avoid bans):
	setTimeout(function() {
		agent.next();
	}, argv.throttle );
});


// Save the file and push to git when agent is done collecting data:
agent.addListener('stop', function (e, agent) {

	// Build API data:
	var api = {
		disclaimer : "This data is collected from Google Calculator and provided free of charge for informational purposes only, with no guarantee whatsoever of accuracy, validity, availability or fitness for any purpose; use at your own risk. Other than that - have fun, and please share/watch/fork if you think data like this should be free!",
		license : "http://www.opensource.org/licenses/GPL-3.0",
		timestamp : Math.round( ( getUTC() ).getTime() / 1000 ),
		base: baseCurrency,
		rates : responses
	};

	// Write the latest and historical files, then commit and push to git when all done:
	async.parallel(
		[
			function(callback) {
				fs.writeFile("latest.json", JSON.stringify(api, false, "\t"), function(err) {
					callback(err);
				});
	 		},
			function(callback) {
				var filename = "./historical/" + (getUTC()).toString("yyyy-MM-dd") + ".json";
				fs.writeFile(filename, JSON.stringify(api, false, "\t"), function(err) {
					callback(err);
				});
	 		}
		],
		function(err) {
			// To do: add some error/success logging:
			if( !err && !argv.nocommit ) {
				// Commit changes to git repository and push when done:
				exec('git add . && git commit -am "exchange rates as of [' + new Date().toUTCString() + ']"', function(err, stdout, stderr) {
					if ( !argv.nopush ) {
						exec('git push origin master');
					}
				});
			}
		}
	);

	log("[" + new Date().toUTCString() + "]: agent finished");
});


// Do the dirty business:
startAgent();

// Set the agent to run every `sleepyTime` milliseconds (default 1 hour):
setInterval(function() {
	startAgent();
}, argv.sleep);


// That's all, folks!