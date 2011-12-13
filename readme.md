# Open Source Exchange Rates API

A free, hourly-updating, nodeJS- and GitHub-powered API that provides exchange rates for 120+ currencies relative to USD.

Every hour, [Currency Bot](http://currencybot.github.com) queries a currency conversion provider (the [Yahoo! Finance](finance.yahoo.com) public API) collecting all the conversion rates for all currencies one-by-one, then saving them into a formatted API JSON file and pushing it to GitHub for everyone to use as an open-source API.

You can use this data to perform JavaScript currency conversion on the client-side (eg. for a web-app or online store - try [money.js](http://josscrowcroft.github.com/money.js)) or for back-end processing (eg. databases, analytics, whatever).

It's mirrored on [openexchangerates.org](http://openexchangerates.org/latest.php) with friendly `Access-Control` HTTP headers, so that you can load it in via AJAX with a cross-domain request without worrying about browser security restrictions.

Daily exchange rates are also available historically - all the way back to 1999! The files are saved in the format: `historical/[yyyy-mm-dd].json`

To get the data, you just need to access the 'raw' data file, `latest.json` via AJAX, CURL, Scrapy, node-httpagent, or your method of choice. You can also access the historical files, now going back to 1999.


## Accuracy

As with all exchange rate data, accuracy can never be guaranteed when you're not paying through the teeth for the service - and when money changes currencies, everyone takes a cut (not to be trusted!) - so it's a good idea to inform people that these are for informational purposes only, something like "Converted prices/exchange rates are for informational purposes only." Feel free to say that rates come form the Open Source Exchange Rates API.


## Homepage and documentation:

Check out **[josscrowcroft.github.com/open-exchange-rates](http://josscrowcroft.github.com/open-exchange-rates)** for all the info.

Originally designed for use with **[money.js](http://josscrowcroft.github.com/money.js)**, a tiny (1kb) JavaScript currency conversion library, for client-side and server-side use.


## Changelog and updates

### 2011-12-13
* [openexchangerates.org](http://openexchangerates.org/latest.json) proxy now supports JSONP requests - add a `callback` parameter to the URL, or use jQuery.ajax with `dataType: 'jsonp'`. Also, files are downloaded, cached and served statically every 15 minutes, which should mean response times are much faster. [josscrowcroft]

### 2011-12-10
* Merged in almost 400,000 lines of historical data back to 1999 from [[canbuffi](https://github.com/canbuffi)], plus changes to crawler to collect data from Yahoo! Finance. [josscrowcroft]

### 2011-10-14
* Rewrote the scraper to use a different provider without the TOS grey-area, until we know that Google won't sue for (ab)using their Calculator API in this way. Also, the data doesn't require parsing like before. [josscrowcroft]

### 2011-10-13
* Restarting the crawl! [currencybot]
* Pushed a fix for the broken crawler. That issue kinda invalidates most of the commits up till now, but there you go. [josscrowcroft]

### 2011-10-11
* Coming out of alpha testing, commencing scrapy-scrape! [currencybot]