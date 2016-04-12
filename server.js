// Dependencies
var express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path');

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));

// Client -> send static content to client
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Boring bootstrap template
app.get('/', function(req, res) {
    res.render("index")
})

// Server, port >= 1024
app.listen(3000);
console.log('RESTful Search Aggregator(Google, Bing, Yahoo)');
