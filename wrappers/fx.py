"""
    fx.py - Python wrapper for open-exchange-rates

    Written in 2012 by Nicolas Stalder

    Original data from https://github.com/currencybot/open-exchange-rates

    To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty. 

    You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>. 
"""

import json
import requests

URL_TEMPLATE = "https://raw.github.com/currencybot/open-exchange-rates/master/%s"
USE_SESSION = True

if USE_SESSION:
    s = requests.session()

def rate(currency, date=None):
    """Download FX rate against USD.

    Currency given by three-letter ISO code.
    If date is None, return latest FX rate.
    Otherwise, assumes a datetime.date, or str/int in format YYMMDD.
    """

    if date is None:
        url = URL_TEMPLATE % "latest.json"
    else:
        if isinstance(date, str):
            pass
        elif isinstance(date, int):
            date = str(date)
        else:
            date = date.strftime("%y%m%d")
        assert len(date) == 6
        url = URL_TEMPLATE % "historical/20%s-%s-%s.json"
        url = url % (date[:2], date[2:4], date[4:])

    if USE_SESSION:
        text = s.get(url).text
    else:
        text = requests.get(url).text
    data = json.loads(text)

    assert data['base'] == "USD"
    return data['rates'][currency]

