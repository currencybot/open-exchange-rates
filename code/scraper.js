/**
 * scraper.js v0.1 - part of the open-source exchange rates project
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
		"AED", // United Arab Emirates Dirham
		"ALL", // Albanian Lek
		"ANG", // Neth Antilles Guilder
		"ARS", // Argentine Peso
		"AUD", // Australian Dollar
		"AWG", // Aruba Florin
		"BBD", // Barbadian Dollar
		"BDT", // Bangladesh Taka
		"BGN", // Bulgarian Lev
		"BHD", // Bahraini Dinar
		"BIF", // Burundi Franc
		"BMD", // Bermuda Dollar
		"BND", // Brunei Dollar
		"BOB", // Bolivian Boliviano
		"BRL", // Brazilian Real
		"BSD", // Bahamian Dollar
		"BTN", // Bhutan Ngultrum
		"BYR", // Belarus Ruble
		"BZD", // Belize Dollar
		"CAD", // Canadian Dollar
		"CHF", // Swiss Franc
		"CLP", // Chilean Peso
		"CNY", // Chinese Yuan
		"COP", // Colombian Peso
		"CRC", // Costa Rica Colon
//		"CYP", // Cyprus Pound
		"CZK", // Czech Koruna
		"DKK", // Danish Krone
		"DOP", // Dominican Peso
		"DZD", // Algerian Dinar
		"EEK", // Estonian Kroon
		"EGP", // Egyptian Pound
		"ETB", // Ethiopian Birr
		"EUR", // Euro
		"FJD", // Fiji Dollar
		"GBP", // British Pound
		"GMD", // Gambian Dalasi
		"GNF", // Guinea Franc
		"GTQ", // Guatemala Quetzal
		"HKD", // Hong Kong Dollar
		"HNL", // Honduras Lempira
		"HRK", // Croatian Kuna
		"HTG", // Haiti Gourde
		"HUF", // Hungarian Forint
		"IDR", // Indonesian Rupiah
		"ILS", // Israeli Sheqel
		"INR", // Indian Rupee
		"IQD", // Iraqi Dinar
		"IRR", // Iran Rial
		"ISK", // Icelandic Krona
		"JMD", // Jamaican Dollar
		"JOD", // Jordanian Dinar
		"JPY", // Japanese Yen
		"KES", // Kenyan Shilling
		"KMF", // Comoros Franc
		"KRW", // South Korean Won
		"KWD", // Kuwaiti Dinar
		"KYD", // Cayman Islands Dollar
		"KZT", // Kazakhstan Tenge
		"LBP", // Lebanese Pound
		"LKR", // Sri Lankan Rupee
		"LSL", // Lesotho Loti
		"LTL", // Lithuanian Litas
		"LVL", // Latvian Lats
		"MAD", // Moroccan Dirham
		"MDL", // Moldovan Leu
		"MKD", // Macedonian Denar
		"MNT", // Mongolian Tugrik
		"MOP", // Macau Pataca
		"MRO", // Mauritania Ougulya
		"MUR", // Mauritius Rupee
		"MVR", // Maldives Rufiyaa
		"MWK", // Malawi Kwacha
		"MXN", // Mexican Peso
		"MYR", // Malaysian Ringgit
		"NAD", // Namibian Dollar
		"NGN", // Nigerian Naira
		"NIO", // Nicaragua Cordoba
		"NOK", // Norwegian Krone
		"NPR", // Nepalese Rupee
		"NZD", // New Zealand Dollar
		"OMR", // Omani Rial
		"PAB", // Panamanian Balboa
		"PEN", // Peruvian Nuevo Sol
		"PGK", // Papua New Guinea Kina
		"PHP", // Philippine Peso
		"PKR", // Pakistani Rupee
		"PLN", // Polish Zloty
		"PYG", // Paraguayan Guarani
		"QAR", // Qatari Riyal
		"RON", // Romanian Leu
		"RUB", // Russian Rouble
		"RWF", // Rwanda Franc
		"SAR", // Saudi Riyal
		"SBD", // Solomon Islands Dollar
		"SCR", // Seychelles Rupee
//		"SDD", // Sudanese Dinar
		"SEK", // Swedish Krona
		"SGD", // Singapore Dollar
//		"SIT", // Slovenian Tolar
		"SKK", // Slovak Koruna
		"SLL", // Sierra Leone Leone
		"SVC", // El Salvador Colon
		"SZL", // Swaziland Lilageni
		"THB", // Thai Baht
		"TND", // Tunisian Dinar
		"TOP", // Tonga Paanga
		"TRY", // Turkish Lira
		"TTD", // Trinidad Tobago Dollar
		"TWD", // Taiwan Dollar
		"TZS", // Tanzanian Shilling
		"UAH", // Ukraine Hryvnia
		"UGX", // Ugandan Shilling
		"USD", // United States Dollar
		"UYU", // Uruguayan New Peso
//		"VEF", // Venezuelan bolivar
		"VUV", // Vanuatu Vatu
		"WST", // Samoa Tala
		"XAF", // Central African CFA franc
		"XCD", // East Caribbean Dollar
		"XOF", // West African CFA franc
		"XPF", // Pacific Franc
		"YER", // Yemen Riyal
		"ZAR", // South African Rand
		"ZMK"  // Zambian Kwacha
	],
	agent,
	requests,
	responses;


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


// Sets up the agent and starts it with a log message:
function startAgent() {
	// Create the array of requests:
	requests = _.map(currencies, function(each) {
		return {
			method: 'GET',
			cc : each,
			uri : 'remote/ER-ERC-AJAX.php?ConvertTo=' + each + '&ConvertFrom=' + baseCurrency + '&amount=1000000'
		}
	});
	responses = {};

	// Create the HTTP agent:
	agent = httpAgent.create('www.currency.me.uk', requests);


	// The scraper:
	agent.addListener('next', function (e, agent) {
		var data = parseFloat((parseFloat(agent.body.replace(/[^0-9-.]/g, '')) / 1000000).toFixed(8));
		// log(agent.current.cc, ":", data);

		// Add this currency conversion rate to the responses object:
		responses[agent.current.cc] = data;
	
		// Move on to the next request after `throttle` milliseconds (spreads the requests to avoid bans):
		setTimeout(function() {
			agent.next();
		}, argv.throttle );
	});
	
	
	// Save the file and push to git when agent is done collecting data:
	agent.addListener('stop', function (e, agent) {
	
		// Build API data:
		var api = {
			disclaimer : "This data is collected from various providers and provided free of charge for informational purposes only, with no guarantee whatsoever of accuracy, validity, availability or fitness for any purpose; use at your own risk. Other than that - have fun, and please share/watch/fork if you think data like this should be free!",
			license : "all code open-source under GPL v3 [http://www.opensource.org/licenses/GPL-3.0]. all data made available by various providers; copyright may apply; not for resale; no warranties given.",
			timestamp : Math.round( ( getUTC() ).getTime() / 1000 ),
			base: baseCurrency,
			rates : responses
		};
	
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
						if ( !argv.nopush ) {
							exec('git push origin master');
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
