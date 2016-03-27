//Dependencies
var express = require('express');
  router = express.Router(),
  request = require('request'),
	cheerio = require('cheerio'),
  URL = require('url'),
	urls = ['https://google.com/search?q=', 'https://bing.com/search?q=', 'https://search.yahoo.com/search?q='],
  sources = ['Google', 'Bing', 'Yahoo'],
	DOMRoot = ['.g', '.b_algo', '.searchCenterMiddle'],
	hrefLeaf = ['div >h3 > a', 'h2 > a', 'li > div > div > h3 > a'],
	textLeaf = ['div > .s > .st', 'div > p', 'li > div > div > p'],
  count = 0,
  client = {},
  map = {};

// Old school async handling 
var callback = function() {
  count++;
  if (count < 3) 
    return;
  client.end(JSON.stringify(map, null , 4));
}

// Rotues
router.get('', function(req, res) {
  var help = {
    'USAGE' : 'To submit queries use the following syntax: <host>:<port>/api/search?<term>[+<term>...]',
    'EXAMPLES' : [
      '$ curl -X POST http://localhost:3000/api/search?dog', 
      '$ curl -X POST http://localhost:3000/api/search?dog+cat']
  }
  res.end(JSON.stringify(help, null, 4));
});

// Search route - ../api/search?<term>[+<term>...] 
router.post('/search', function(req, res, next) {
  client = res;
  urls.forEach(function(url, i) {
		url += URL.parse(req.url).query;
	  request({
		  url: url,
		  headers: {
		  	'User-Agent': 'Mozilla/5.0'
		  }
	  }, function(err, res, body) {  
	    if (err) {
			  console.log('ERROR: ' + err);
			  return;
		  }

      // cheerio allows for jquery-like DOM Tree parsing 
      var $ = cheerio.load(body),
        hrefs = [],
        texts = [],
        title = [];

      // Scrape the hyperlinks from the result cards 
		  $(DOMRoot[i]).find(hrefLeaf[i]).each(function (index, element) {
		    var url = $(element).attr('href').replace('/url?q=', '').split('&')[0];

          // Yahoo has ugly URLs //
					if (url.indexOf("search.yahoo.com") > -1 ) {
            var fields = url.split('/');
            for (k = 0; k < fields.length; k++) 
              if (fields[k].startsWith('RU=')) 
                url = unescape(fields[k].split('=')[1]);
					}

          if (url.charAt(0) !== '/') {
			      hrefs.push(url);
            title.push($(element).text());
          }
		  });

      // Scrape the summary of each entry 
		  $(DOMRoot[i]).find(textLeaf[i]).each(function (index, element) {
		    var text = $(element).text();
			  if (text.length != 0) 
			    texts.push(text);
		  });

      // Map by TLD and aggregate the results 
      hrefs.map(function(curr, index) {
				var TLD = curr.match(/^.+?[^\/:](?=[?\/]|$)/);
        if (map[TLD] == undefined) {
          map[TLD] = {
           'title': title[index], 
           'source(s)': sources[i], 
           'summary': texts[index],
           'url': curr
          }
        } else if (map[TLD].source.indexOf(sources[i] > -1)) {
          map[TLD].source += " " +  sources[i];
        }
      });

      callback();
	  });
	});
});

// export
module.exports = router;
