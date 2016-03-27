# Search-Engine-Aggregator
Search-engine-aggregator is a RESTful API accepts text based queries and emits a JSON response of the combined search results from Google, Yahoo, and Bing.
## Primary Dependencies 
* Node 
* Cheerio
* Express
* Body-parser
* Request

[Node can be downloaded here](https://nodejs.org/en/)
### Installation 
```bash
$ tar -xzvf search_engine_aggregator.tar.gz
$ cd search_engine_aggergator.tar.gz
$ npm install
$ node server.js
```
### Usage
```bash
$ http://localhost:3000/api/search?<search term>[+<search term>...]
```
###### Return Format(JSON)
Google, Bing, and Yahoo are scraped with identical search queries, upon recieving the response, the results are merged and marshalled back to the requestee.
```
{
	<Top Level Domain> : {
		'title'     : String,
		'source(s)' : String,
		'summary'   :	String
	}
}
```
