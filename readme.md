# Important Update:

Following the recent changes and improvements to the [Open Exchange Rates](http://openexchangerates.org) service, **App ID** signup is now open - it's free for personal use, and extremely cheap for everybody else. 

App IDs will be **required** for all users from the start of August. **[More info here](http://www.josscrowcroft.com/2012/projects/open-exchange-rates-relaunched-part-2/).**
			
You can sign up easily at the **[signup](https://openexchangerates.org/signup)** page - any questions, **[send me an email](mailto:joss@openexchangerates.org)**!


# Open Exchange Rates API

A free, real-time JSON API that provides exchange rates (forex rates) for 150+ currencies, relative to USD.

Every hour (soon to be more often) **[Currency Bot](http://currencybot.github.com)** queries several reliable sources of exchange rate data, collects all the conversion rates for every currency, performs some smart blending and sanity checks, then makes them available for everyone to use.

You can use these data for any purpose - whether performing JavaScript currency conversion on the client-side (eg. for a web-app, smartphone app or online store - try **[money.js](http://josscrowcroft.github.com/money.js)**) or for back-end processing (eg. databases, analytics, accounting, tickers, desktop software, whatever).

The latest exchange rates are available on **[openexchangerates.org](http://openexchangerates.org)**, along with historical EOD rates going back to January 1999, with JSONP support and friendly `Access-Control` HTTP headers - so you can load it in via AJAX with a cross-domain request without worrying about browser security restrictions. **HTTPS** is also available.

To get the data, you just need to access `latest.json` via AJAX, CURL, Scrapy, node-httpagent, or your method of choice. There's a bunch of **[documentation](http://openexchangerates.org/documentation)** and examples/sample projects are coming to this repo very soon.


## Accuracy

As with all exchange rate data, accuracy can never be guaranteed when you're not paying through the teeth for the service - and when money changes currencies, everyone takes a cut - so it's a good idea to inform people that these are for informational purposes only, something like "Converted prices/exchange rates are for informational purposes only." Feel free to say that rates come from the Open Exchange Rates service.


## Homepage and documentation:

Check out **[openexchangerates.org](http://openexchangerates.org)** for all the info.

There are guides for most languages, with more on the way. If you're working in client-side or server-side Javascript, check out **[money.js](http://josscrowcroft.github.com/money.js)**, a tiny (1kb) JavaScript currency conversion library.


## Legal

There's a License, Terms and Conditions and Privacy Policy available on **[openexchangerates.org](http://openexchangerates.org)**, which you are required to read and understand before querying the data.


## Future

This Git repository will soon be updated with working code samples and example projects for using the API and data.
