var express 	= require('express');
var hbs  		= require('express-handlebars');
var app 		= express();
var user 		= {};


/* BASIC CONFIGURATION */
//route static files
app.use(express.static('public'));

//set handlebars layout engine
app.engine('.hbs', hbs({defaultLayout: 'default', extname: '.hbs'}));
app.set('view engine', '.hbs');


//guest init middleware, we will use a memory variable for the guest (shared with all sessions (is just an example))
app.use(function(req, res, next) {
	req.user = user;
	res.locals.user = user;
	next();
});


app.get('/', function (req, res) {
  	res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});