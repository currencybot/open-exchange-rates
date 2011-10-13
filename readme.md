# Open Source Exchange Rates (updated hourly)

I needed a simple and free API containing up-to-date exchange rates, and was frustrated that something so fundamentally simple is hidden behind a paywall ($10 to $500 monthly) - when the information is freely available, just either not in a usable format, or rate-limited.

So, I made a node.js scraper (Currency Bot) that queries Google Calculator every hour, collecting all the conversion rates for all currencies one-by-one, then saves them into a formatted API JSON file and automatically pushes it to GitHub for everyone to use as an open-source API.

You can use this data to perform JavaScript currency conversion on the client-side (eg. for a web-app or online store) or for back-end processing (eg. databases, analytics, whatever).

As with all exchange rate data, accuracy can never be guaranteed - and when money changes currencies, everyone uses a different rate (that's how they make money!) - so it's a good idea to inform people that these are for informational purposes only.

To get it, you just need to access the 'raw' data file, `latest.json` via AJAX, CURL, Scrapy, node-httpagent, or your method of choice.

Daily exchange rates are also available historically - the files are saved in the format: `historical/[yyyy-mm-dd].json`

### More info and homepage/documentation coming soon..


## Changelog and updates

### 2011-10-13
* Restarting the crawl! [currencybot]
* Pushed a fix for the broken crawler. That issue kinda invalidates most of the commits up till now, but there you go. [josscrowcroft]

### 2011-10-11
* Coming out of alpha testing, commencing scrapy-scrape! [currencybot]