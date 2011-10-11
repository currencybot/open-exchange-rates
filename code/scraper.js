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
	_ = require('underscore'),
	httpAgent = require('http-agent'),
	async = require('async'),
	date = require('datejs'),
	fs = require('fs'),
	exec = require('child_process').exec;

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

	// Move on to the next request:
	agent.next();
});


// Return a date object set to UTC time for dateJS:
function getUTC() {
	return Date.parse('now').add({ hours: -parseInt(Date.today().getUTCOffset(), 10) });
}


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
			if( !err ) {
				// Commit changes to git repository and push when done:
				exec('git add . && git commit -am "exchange rates as of [' + new Date().toUTCString() + ']"', function(err, stdout, stderr) {
					exec('git push origin master');
				});
			}
		}
	);
});


// Do the dirty business:
agent.start();

// Set the agent to run every hour:
setInterval(function() {
	agent.start();
}, 3600000);

// That's all, folks!