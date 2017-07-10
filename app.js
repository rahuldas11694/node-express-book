	var express = require('express');
	var app = express();
	app.set('port', process.env.PORT || 4000);
	var fortune = require('./lib/fortune');
	var formidable = require("formidable");
	var credentials = require('./credentials.js');
	global.LOG = console.log;


	// set up handlebars view engine
	var handlebars = require('express3-handlebars')
	    .create({ defaultLayout: 'main' });
	app.engine('handlebars', handlebars.engine);
	app.set('view engine', 'handlebars');

	// b4 declaring any route add this middleware
	app.use(require('cookie-parser')(credentials.cookieSecret));

	app.use(require('express-session')({secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true}));

	app.use(express.static(__dirname + '/public'));


	app.use(function(req, res, next){
 		console.log('processing request for "' + req.url + '"....');
 		LOG("first middleware")
 		next();
	});
	app.use(function(req, res, next){
	 console.log('terminating request');
	 // res.send('thanks for playing!');
	 next()
	 // note that we do NOT call next() here...this terminates the request
	});
	app.use(function(req, res, next){
	 console.log('whoops, i\'ll never get called!');
	 next()
	});

	app.get('/', function(req, res) {
		LOG("/////",req.session)
	    res.type('text/plain');
	    res.send('Meadowlark headers');
	});
/****************************************************************************************************/
	app.get('/b', function(req, res, next){
	 console.log('/b: route not terminated');
	 next();
	});
	app.use(function(req, res, next){
	 console.log('SOMETIMES');
	 next();
	});
	app.get('/b', function(req, res, next){
	 console.log('/b (part 2): error thrown' );
	 throw new Error('b failed');
	 // res.send("hey")
	});

	app.use('/b', function(err, req, res, next){
	 console.log('/b error detected and passed on');
	 next(err);
	});

	app.get('/c', function(err, req){
	 console.log('/c: error thrown');
	 throw new Error('c failed');
	});

	app.use('/c', function(err, req, res, next){
	 console.log('/c: error deteccted but not passed on');
	 next(); // if you pass err in this next then 500 will execute else 404
	});

	app.use(function(err, req, res, next){
	 console.log('unhandled error detected: ' + err.message);
	 res.send('500 - server error');
	});

	app.use(function(req, res){
	 console.log('route not handled');
	 res.send('404 - not found');
	});
/************************************************************************************************************/
	var fortunes = [
	    "Conquer your fears or they will conquer you.",
	    "Rivers need springs.",
	    "Do not fear what you don't know.",
	    "You will have a pleasant surprise.",
	    "Whenever possible, keep it simple.",
	];

	app.get('/about', function(req, res) {

	    var randomFortune = fortune.getFortune();
	    LOG("the cookies ",req.cookies,req.signedCookies['connect.sid'] = true,req.signedCookies)
	    // res.cookie('monster', 'nom nom');
	    res.render('about', { fortune: randomFortune }); //
	});

	app.get('/headers', function(req, res) {
	    res.set('Content-Type', 'text/plain');
	    var s = '';
	    console.log('IP ADDRESS', req.ip, req.path, req.host, req.xhr, req.secure)
	    for (var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
	    res.send(s);
	});

	app.get('/contest/vacation-photo', function(req, res) {
	    var now = new Date();
	    LOG('now.getFullYear()',now.getFullYear(),"now.getMonth()",now.getMonth())
	    res.render('contest/vacation-photo', {
	        year: now.getFullYear(),
	        month: now.getMonth()
	    });
	});
	app.post('/contest/vacation-photo/:year/:month', function(req, res) {
	    var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {
	        if (err) return res.redirect(303, '/error');
	        console.log('received fields:');
	        console.log(fields);
	        console.log('received files:');
	        console.log(files);
	        res.redirect(303, '/thank-you');
	    });
	});



	// custom 404 page
	app.use(function(req, res) {
	    res.type('text/plain');
	    res.status(404);
	    res.send('404 - Not Found');
	});

	// custom 500 page
	app.use(function(err, req, res, next) {
	    console.error(err.stack);
	    res.type('text/plain');
	    res.status(500);
	    res.send('500 - Server Error\n', err);
	});


	app.listen(app.get('port'), function() {
	    console.log('Express started on http://localhost:' +
	        app.get('port') + '; press Ctrl-C to terminate.');
	});
