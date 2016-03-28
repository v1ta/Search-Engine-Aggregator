// Dependencies
var express = require('express'),
  bodyParser = require('body-parser');

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));

// Server, port >= 1024
app.listen(3000);
console.log('RESTful Search Aggregator(Google, Bing, Yahoo)');
