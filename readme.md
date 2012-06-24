# Important Update:

**[Please read this blog post explaining the changes happening to the Open Exchange Rates project](http://www.josscrowcroft.com/2012/projects/open-exchange-rates-update-the-partys-not-over-it-just-got-a-little-too-noisy/)**

**In a nutshell:**

* Some people (if you're reading this, you're probably not one of them) have been hammering both the GitHub repository and the openexchangerates.org server with an unfair number of requests - this is why we had to **take the data off of GitHub**, and also why we're implementing free API keys on the service.
* The data is now available at openexchangerates.org exactly as before (but watch out for a few changes coming soon).
* Developers can (soon) register for a **free App ID**, which they can use to access the service - there will be a switchover period to allow apps to update.
* This open-source project got off the ground by using this repository as a makeshift data-store - so we're hugely grateful to the awesome GitHub team for that. The repositry will be updated to contain code examples for working with the API.


# Open Exchange Rates API

A free, hourly-updating, nodeJS- and GitHub-powered API that provides exchange rates for 120+ currencies, relative to USD.

Every hour, [Currency Bot](http://currencybot.github.com) queries several reliable sources of exchange rate data, collects all the conversion rates for all the major world currencies, blends them together (with some sanity checks) - then makes them available for everyone to use.

You can use this data to perform JavaScript currency conversion on the client-side (eg. for a web-app or online store - try [money.js](http://josscrowcroft.github.com/money.js)) or for back-end processing (eg. databases, analytics, whatever).

The latest exchange rates are available on [openexchangerates.org](http://openexchangerates.org), along with historical rates going back to 1999, served with JSONP support and friendly `Access-Control` HTTP headers - so you can load it in via AJAX with a cross-domain request, without worrying about browser security restrictions.

To get the data, you just need to access `latest.json` via AJAX, CURL, Scrapy, node-httpagent, or your method of choice. There's a bunch of **[documentation](http://openexchangerates.org/documentation)**.


## Accuracy

As with all exchange rate data, accuracy can never be guaranteed when you're not paying through the teeth for the service - and when money changes currencies, everyone takes a cut - so it's a good idea to inform people that these are for informational purposes only, something like "Converted prices/exchange rates are for informational purposes only." Feel free to say that rates come from the Open Exchange Rates service.


## Homepage and documentation:

Check out **[openexchangerates.org](http://openexchangerates.org)** for all the info.

There are guides for most languages, with more on the way. If you're working in client-side or server-side Javascript, check out **[money.js](http://josscrowcroft.github.com/money.js)**, a tiny (1kb) JavaScript currency conversion library.


## Changelog and updates

### 2012-06-24
* Removed `historical/` files from GitHub repository. Replaced `latest.json` with an error message (file will be removed in 48 hours.) **NB: All data files still available at [openexchangerates.org](http://openexchangerates.org)**
* Removed deprecated `code/` scripts from GitHub repository. They haven't reflected the actual workings of the project for a while, so I'll be filling this repository with code examples for working with the API and related wrappers/libs.

### 2012-06-20
* Big changes coming - please read **[this blog post](http://www.josscrowcroft.com/2012/projects/open-exchange-rates-update-the-partys-not-over-it-just-got-a-little-too-noisy/)** for all the news.
