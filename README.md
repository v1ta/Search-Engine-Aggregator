# Search-Engine-Aggregator
Search-engine-aggregator is a RESTful API accepts text based queries and emits a JSON response of the combined search results from Google, Yahoo, and Bing.
## Primary Dependencies 
* Node 
* Cheerio
* Express
* Body-parser
* Request
* q

[Node can be downloaded here](https://nodejs.org/en/)
### Installation 
```bash
$ git clone https://github.com/v1ta/Search-Engine-Aggregator.git
$ cd Search_Engine_Aggergator
$ npm install
$ node server.js
```
### Usage
```bash
$ curl -X POST http://localhost:3000/api/search?<search term>[+<search term>[+<search term>...]]
```
###### Return Format(JSON)
Google, Bing, and Yahoo are queried with search terms specified by the user. Upon recieving the response from all three search engines, the results are scraped w/cheerio, then merged and marshalled back to the requestee.
```
{
	<Top Level Domain> : {
		'title'     : String,
		'source(s)' : String,
		'summary'   : String,
		'url'       : String
	}
}
```
