var express = require('express');
var bodyParser = require('body-parser');
var stormpath = require('express-stormpath');

var app = express();
var host = process.env.IP || '0.0.0.0';
var port = process.env.PORT || 4000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// init stormpath
const stormpathInfo = require('./config/stormpath.js');
app.use(stormpath.init(app, {
  apiKey: {
    id: process.env.stormpathId || stormpathInfo.id,
    secret: process.env.stormpathSecret || stormpathInfo.secret
  },
  application: {
    href: process.env.stormpathHref || stormpathInfo.href
  }
}));

app.get('/', stormpath.getUser, function(req, res) {
  res.render('home');
});

// server start
const server = app.listen(port, host, function () {
  console.log(
    'Example app listening at http://%s:%s',
    server.address().address,
    server.address().port
  );
});
