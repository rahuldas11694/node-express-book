	var express = require('express');
	var app = express();
	app.set('port', process.env.PORT || 4000);
	var fortune = require('./lib/fortune');
	global.LOG = console.log;


	// set up handlebars view engine
	var handlebars = require('express3-handlebars')
	 .create({ defaultLayout:'main' });
	app.engine('handlebars', handlebars.engine);
	app.set('view engine', 'handlebars');

	// b4 declaring any route add this middleware
	
	app.use(express.static(__dirname + '/public'));

	app.get('/', function(req, res){
	 res.type('text/plain');
	 res.send('Meadowlark Travel');
	});


	var fortunes = [
			 "Conquer your fears or they will conquer you.",
			 "Rivers need springs.",
			 "Do not fear what you don't know.",
			 "You will have a pleasant surprise.",
			 "Whenever possible, keep it simple.",
			];

	app.get('/about', function(req, res){
	 // res.type('text/plain');
	 // res.send('About Meadowlark Travel');
	 var randomFortune = fortune.getFortune()
						 res.render('about', { fortune: randomFortune }) //
	});



	// custom 404 page
	app.use(function(req, res){
	 res.type('text/plain');
	 res.status(404);
	 res.send('404 - Not Found');
	});

	// custom 500 page
	app.use(function(err, req, res, next){
	 console.error(err.stack);
	 res.type('text/plain');
	 res.status(500);
	 res.send('500 - Server Error');
	});


	app.listen(app.get('port'), function(){
	 console.log( 'Express started on http://localhost:' +
	 app.get('port') + '; press Ctrl-C to terminate.' );
	});
