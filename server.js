const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// var stormpath = require('express-stormpath');

const app = express();
const host = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 4000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

// setup connection to database
const configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

const Phonebanks = require('./models/phonebank.js');

// Middleware

function loadPhonebanks(req, res, next) {

	Phonebanks.find(function(err, phonebank) {
      if(!err) {
  			res.locals.phonebank = phonebank;
  		}
  		else {
  			console.log('Error loading task.');
  			res.redirect('/');
  		}
  		next();
	  }
  );
}

// init stormpath
// const stormpathInfo = require('./config/stormpath.js');
// app.use(stormpath.init(app, {
//   apiKey: {
//     id: process.env.stormpathId || stormpathInfo.id,
//     secret: process.env.stormpathSecret || stormpathInfo.secret
//   },
//   application: {
//     href: process.env.stormpathHref || stormpathInfo.href
//   }
// }));

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/phonebank', loadPhonebanks,function(req, res) {
  res.render('phonebank/list');
});

app.get('/admin', function(req, res) {
  res.render('admin/admin');
});

app.post('/phonebank/add', function(req, res) {

  const newPhoneBank = new Phonebanks();

  newPhoneBank.candidateName = req.body.candidateName;
  newPhoneBank.officeRunning = req.body.officeRunning;
  newPhoneBank.politicalParty = req.body.politicalParty;
  newPhoneBank.phonebankLink = req.body.phonebankLink;
  newPhoneBank.intendedDate = req.body.intendedDate;

  newPhoneBank.save(function(err, phonebank){

    if(phonebank && !err){
      res.redirect('/phonebank');
      return;
  	}
    const errors = "Error adding the phonebank";

  });

});

// server start
const server = app.listen(port, host, function () {
  console.log(
    'Example app listening at http://%s:%s',
    server.address().address,
    server.address().port
  );
});
