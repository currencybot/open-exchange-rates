# Important Update:

**[Please read this blog post to explain the changes happening in the next few days](http://www.josscrowcroft.com/2012/projects/open-exchange-rates-update-the-partys-not-over-it-just-got-a-little-too-noisy/)**

# Open Exchange Rates API

A free, hourly-updating, nodeJS- and GitHub-powered API that provides exchange rates for 120+ currencies relative to USD.

Every hour, [Currency Bot](http://currencybot.github.com) queries a currency conversion provider (the [Yahoo! Finance](finance.yahoo.com) public API) collecting all the conversion rates for all currencies one-by-one, then saving them into a formatted API JSON file and pushing it to GitHub for everyone to use as an open-source API.

You can use this data to perform JavaScript currency conversion on the client-side (eg. for a web-app or online store - try [money.js](http://josscrowcroft.github.com/money.js)) or for back-end processing (eg. databases, analytics, whatever).

It's mirrored on [openexchangerates.org](http://openexchangerates.org/latest.json) with JSONP support and friendly `Access-Control` HTTP headers, so that you can load it in via AJAX with a cross-domain request without worrying about browser security restrictions.

Daily exchange rates are also available historically - all the way back to 1999! The files are saved in the format: `historical/[yyyy-mm-dd].json`

To get the data, you just need to access the 'raw' data file, `latest.json` via AJAX, CURL, Scrapy, node-httpagent, or your method of choice. You can also access the historical files, now going back to 1999.


## Accuracy

As with all exchange rate data, accuracy can never be guaranteed when you're not paying through the teeth for the service - and when money changes currencies, everyone takes a cut (not to be trusted!) - so it's a good idea to inform people that these are for informational purposes only, something like "Converted prices/exchange rates are for informational purposes only." Feel free to say that rates come form the Open Source Exchange Rates API.


## Homepage and documentation:

Check out **[openexchangerates.org/documentation](http://openexchangerates.org/documentation)** for all the info.

Originally designed for use with **[money.js](http://josscrowcroft.github.com/money.js)**, a tiny (1kb) JavaScript currency conversion library, for client-side and server-side use.


## Changelog and updates

### 2012-06-20
* Big changes coming - please read **[this blog post](http://www.josscrowcroft.com/2012/projects/open-exchange-rates-update-the-partys-not-over-it-just-got-a-little-too-noisy/)** for all the news.
