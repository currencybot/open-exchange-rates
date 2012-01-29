#! /usr/bin/env python

import datetime
import json

import requests

BASE_URL = 'https://raw.github.com/currencybot/open-exchange-rates/master'

def _https(url, verify=True):
    res = requests.get(url, verify=verify)
    return json.loads(res.content)

def currencies():
    return _https(BASE_URL + '/currencies.json')

def latest():
    return _https(BASE_URL + '/latest.json')

def historical(d):
    """
    Takes a date as d and pulls rates for that date.
    Returns the response provided by the API.

    d may be a datetime.date, datetime.datetime, str/unicode or
    a tuple of form (year, month, day).

    >>> d = datetime.date(2002, 10, 17)
    >>> historical(d)['rates']['AUD']
    1.81881

    >>> d = datetime.datetime(year=2001, month=9, day=11, hour=4, minute=19)
    >>> historical(d)['rates']['EUR']
    1.0936

    >>> d = '2006-07-11'
    >>> historical(d)['rates']['CHF']
    1.226

    >>> d = (2004, 8, 9)
    >>> historical(d)['rates']['JPY']
    110.49723
    """
    import sys
    try:
        s = d.isoformat()[:10]
    except AttributeError:
        if isinstance(d, basestring):
            s = d
        else:
            s = '-'.join(str(n).zfill(2) for n in d)
    url = '{base}/historical/{date}.json'.format(base=BASE_URL, date=s)
    return _https(url)

if __name__ == '__main__':
    import doctest
    doctest.testmod()

