var express 	= require('express');
var hbs  		= require('express-handlebars');
var bodyParser 	= require('body-parser')
var app 		= express();
var user 		= {};
user.cart 		= [];
var products 	= [];



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

//body parser for post forms
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  	extended: true
}));


//generate 40 products and assigned them to a category
//product generation
for(var i = 0; i < 40; i++) {
	var product = {};
	product.id = i + 1;
	product.name = 'Product ' + (i + 1);
	product.price = 100 % ((i + 5)*3);
	product.category = 2 - (i % 2);
	products.push(product);
}

/* ROUTES */
//add to cart
app.post('/product/addToCart', function(req, res) {
	var id = req.body.id;
	var product = products.filter(function(p) {
		return p.id== id;
	})[0];
	user.cart.push(product);
	res.json({added: true});
})


//home
app.get('/', function (req, res) {
  	res.render('index', {products:products.slice(0,4)});
});

//categories
app.get('/category/:id', function(req, res) {
	var id = req.params.id;
	var c_products = products.filter(function(p) {
		return p.category == id;
	});

	res.render('category', {category: {id: id}, products: c_products});
});

//product
app.get('/product/:id', function(req, res) {
	var id = req.params.id;
	var p_products = products.filter(function(p) {
		return p.id== id;
	});

	res.render('product', {product: p_products[0]});
});

//shopping cart
app.get('/cart', function(req, res) {
	res.render('cart', {products: req.user.cart});
})

//shipping

//payment

//confirmation



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});