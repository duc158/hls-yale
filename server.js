const express = require('express');
const app = express();
const host = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const session = require('express-session')

// setup connection to database
const configDB = require('./config/database.js');
mongoose.Promise = require('bluebird');
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(express.static(__dirname + '/public'));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.set('views', './views');
app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'thisisasecretsession' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

const Phonebanks = require('./models/phonebank.js');
const Campaigns = require('./models/campaign.js');

// route
app.get('/', function(req, res) {
  res.render('home', {user: req.user});
});

	// user authentication

		// login
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/',
			failureRedirect : '/login',
			failureFlash : true
		}));

		// signup
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/',
			failureRedirect : '/signup',
			failureFlash : true
		}));

		// profile
		app.get('/profile', isLoggedIn, function(req, res) {
			res.render('profile.ejs', {
				user : req.user
			});
		});

		// logout
		app.get('/logout', function(req, res) {
			req.logout();
			res.redirect('/');
		});

    // admin
    app.get('/admin', isLoggedIn, function(req, res) {
      const admin = "alex.le@yale.edu, ssanyal@jd17.law.harvard.edu, byronruby@gmail.com";
      if (admin.indexOf(req.user.local.email) > -1) {
        res.render('admin/admin', {user : req.user});
      } else {
        res.send('You are not authorized');
      }
		});

	// phonebank
	app.get('/phonebank/:zipcode', loadPhonebanks, function(req, res) {
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

	// Middleware

		// load all phonebank
		function loadPhonebanks(req, res, next) {
			Phonebanks.find({zipcode: req.params.zipcode}, function(err, phonebank) {
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

		// route middleware to make sure a user is logged in
		function isLoggedIn(req, res, next) {
		    // if user is authenticated in the session, carry on
		    if (req.isAuthenticated())
		        return next();
		    // if they aren't redirect them to the home page
		    res.redirect('/');
		}

// server start
const server = app.listen(port, host, function () {
  console.log(
    'Example app listening at http://%s:%s',
    server.address().address,
    server.address().port
  );
});
