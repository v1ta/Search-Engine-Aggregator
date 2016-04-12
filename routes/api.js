//Dependencies
var express = require('express');
  request = require('request'),
  cheerio = require('cheerio'),
  URL = require('url'),
  q = require('q');

// Global vars
var urls = ['https://google.com/search?q=', 'https://bing.com/search?q=', 'https://search.yahoo.com/search?q='],
  sources = ['Google', 'Bing', 'Yahoo'],
  DOMRoot = ['.g', '.b_algo', '.searchCenterMiddle'],
  hrefLeaf = ['div >h3 > a', 'h2 > a', 'li > div > div > h3 > a'],
  textLeaf = ['div > .s > .st', 'div > p', 'li > div > div > p'],
  count = 0,
  client = {},
  router = express.Router(),
  map = {},
  log = console.log;

// async handling
var callback = function(results) {
  client.end(results);
  map = {};
  client = {};
  count = 0;
}

// Routes
router.get('', function(req, res) {
  var help = {
    'USAGE' : 'To submit queries use the following syntax: <host>:<port>/api/search?<term>[+<term>...]',
    'EXAMPLES' : [
      '$ curl -X POST http://localhost:3000/api/search?dog',
      '$ curl -X POST http://localhost:3000/api/search?dog+cat'
    ]
  }
  res.end(JSON.stringify(help, null, 4));
});

// Search route - ../api/search?<term>[+<term>...]
router.post('/search', function(req, res, next) {
  client = res;
  var defer = q.defer();
  defer.promise.then(callback, res.end);
  urls.forEach(function(url, i) {
    url += URL.parse(req.url).query;
    /*
        Catch query paramater here and alter for each different engine
        &start=<page numbers> -- google
        &first=<1,15,29,etc...> -- bing
        & something -- yahoo
    */
    request({
      url: url,
      headers: {
	      'User-Agent': 'Mozilla/5.0'
      }
    }, function(err, res, body) {
      if (err)
        return log("Something went wrong: %s", err);
      // cheerio, allows for jquery-like DOM Tree parsing
      var $ = cheerio.load(body),
        hrefs = [],
        texts = [],
        title = [];

      // Scrape the hyperlinks & titles from the result cards
      $(DOMRoot[i]).find(hrefLeaf[i]).each(function (index, element) {
        var url = $(element).attr('href').replace('/url?q=', '').split('&')[0];
        // Yahoo has ugly URLs //
	if (url.indexOf("search.yahoo.com") > -1 ) {
          url.split('/').forEach(function(field) {
            if (field.startsWith('RU='))
              url = unescape(field.split('=')[1]);
          });
        }
        // yahoo puts images as their first result in all queries
        if (url.charAt(0) !== '/' && !(i==2 && index==0)) {
          hrefs.push(url);
          title.push($(element).text());
        }
      });

      // Scrape the summary of each entry
      $(DOMRoot[i]).find(textLeaf[i]).each(function (index, element) {
        var text = $(element).text();
        if (text.length != 0 && !(i==2 && index==0))
	        texts.push(text);
	    });

      // Map by TLD and aggregate the results
      hrefs.map(function(curr, index) {
	    var TLD = curr.match(/^.+?[^\/:](?=[?\/]|$)/);
        if (map[TLD] == undefined) {
          map[TLD] = {
            'title': title[index],
            'source': sources[i],
            'summary': texts[index],
            'url': curr
          }
        } else if (map[TLD].source.indexOf(sources[i]) < 0)
          map[TLD].source += " " +  sources[i];
      });
      if (++count == 3)
        return defer.resolve(JSON.stringify(map, null , 4));
    });
  });
});



// export
module.exports = router;
