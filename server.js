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
const Campaigns = require('./models/campaign.js');

// Middleware

	// load all phonebank
	function loadPhonebanks(req, res, next) {

		Phonebanks.find(function(err, phonebank) {
	      if(!err) {
	  			res.locals.phonebank = phonebank;
	  		}
	  		else {
	  			console.log('Error loading phonebanks.');
	  			res.redirect('/');
	  		}
	  		next();
		  }
	  );
	}

	// load all campaigns
	function loadCampaigns(req, res, next) {

		Campaigns.find({zipcode: req.params.zipcode}, function(err, campaign) {
				if(!err) {
					res.locals.campaign = campaign;
				}
				else {
					console.log('Error loading campaigns.');
					res.redirect('/');
				}
				next();
			}
		);
	}

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/admin', function(req, res) {
  res.render('admin/admin');
});

	// phonebank
	app.get('/phonebank', loadPhonebanks,function(req, res) {
	  res.render('phonebank/list');
	});

	app.post('/phonebank/add', function(req, res) {

	  const newPhoneBank = new Phonebanks();

	  newPhoneBank.candidate = req.body.candidate;
		newPhoneBank.location = req.body.location;
	  newPhoneBank.office = req.body.office;
	  newPhoneBank.party = req.body.party;
	  newPhoneBank.link = req.body.link;
	  newPhoneBank.callDate = req.body.callDate;

	  newPhoneBank.save(function(err, phonebank){

	    if(phonebank && !err){
	      res.redirect('/phonebank');
	      return;
	  	}
	    const errors = "Error adding the phonebank";

	  });
	});

	// donate campaign
	app.get('/campaign/:zipcode', loadCampaigns,function(req, res) {
		res.render('campaign/list');
	});

	app.post('/campaign/add', function(req, res) {
		const newCampaign = new Campaigns();

		newCampaign.zipcode = req.body.zipcode;
		newCampaign.candidate = req.body.candidate;
		newCampaign.office = req.body.office;
		newCampaign.party = req.body.party;
		newCampaign.electionDate = req.body.electionDate;

		newCampaign.save(function(err, campaign){

			if(campaign && !err){
				res.redirect('/campaign/'+req.body.zipcode);
				return;
			}
			const errors = "Error adding the campaign";

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
