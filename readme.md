# Open Source Exchange Rates API

A free, hourly-updating, nodeJS- and GitHub-powered API that provides exchange rates for 87 currencies relative to USD.

[Currency Bot](http://currencybot.github.com) queries Google Calculator every hour, collecting all the conversion rates for all currencies one-by-one, then saves them into a formatted API JSON file and automatically pushes it to GitHub for everyone to use as an open-source API.

You can use this data to perform JavaScript currency conversion on the client-side (eg. for a web-app or online store) or for back-end processing (eg. databases, analytics, whatever).

It's mirrored on [openexchangerates.org](http://openexchangerates.org/latest.php) with friendly `Access-Control` HTTP headers, so that you can load it in via AJAX with a cross-domain request without worrying about browser security restrictions.

As with all exchange rate data, accuracy can never be guaranteed - and when money changes currencies, everyone uses a different rate (that's how they make money!) - so it's a good idea to inform people that these are for informational purposes only.

To get it, you just need to access the 'raw' data file, `latest.json` via AJAX, CURL, Scrapy, node-httpagent, or your method of choice.

Daily exchange rates are also available historically - the files are saved in the format: `historical/[yyyy-mm-dd].json`


## Homepage and documentation:

Check out **[josscrowcroft.github.com/open-exchange-rates](http://josscrowcroft.github.com/open-exchange-rates)** for all the info.

Originally designed for use with **[money.js](http://josscrowcroft.github.com/money.js)**, a tiny (1kb) JavaScript currency conversion library, for client-side and server-side use.

## Changelog and updates

### 2011-10-13
* Restarting the crawl! [currencybot]
* Pushed a fix for the broken crawler. That issue kinda invalidates most of the commits up till now, but there you go. [josscrowcroft]

### 2011-10-11
* Coming out of alpha testing, commencing scrapy-scrape! [currencybot]