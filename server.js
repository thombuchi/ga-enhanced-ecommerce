var express 		= require('express');
var hbs  			= require('express-handlebars');
var bodyParser 		= require('body-parser')
var app 			= express();
var user 			= {};
user.cart 			= {};
user.cart.products 	= [];
user.cart.total 	= 0;
var products 		= [];
var shipping 		= [];
var payment 		= [];

/** WARNING 
This code is a simplification with no standards, you shlould not use this like an example of how to program in node js. There are many good practices that are not being used on purpose.
**/


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

//set shipping methods
shipping.push({id: 1, name: 'Pickup in Store', price: 0});
shipping.push({id: 2, name: 'Deliver Home', price: 5});

//set shipping methods
payment.push({id: 1, name: 'Visa'});
payment.push({id: 2, name: 'American Express'});





/* ROUTES */
//add to cart
app.post('/product/addToCart', function(req, res) {
	var id = req.body.id;
	var product = products.filter(function(p) {
		return p.id== id;
	})[0];
	user.cart.products.push(product);
	var total = 0;
	for(var i = 0, len = user.cart.products.length; i < len; i++) {
		total += user.cart.products[i].price;
	}
	user.cart.total = total;
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
	res.render('cart', {total: user.cart.total, products: req.user.cart.products});
})

//shipping
app.get('/checkout/shipping', function(req, res) {
	res.render('shipping', {total: user.cart.total, products: req.user.cart.products});
})

//payment
app.post('/checkout/payment', function(req, res) {
	var id = req.body.shipping;
	var c_shipping = shipping.filter(function(p) {
		return p.id == id;
	})[0];

	//calucate cart total
	user.cart.shipping = c_shipping;
	var total = 0;
	for(var i = 0, len = user.cart.products.length; i < len; i++) {
		total += user.cart.products[i].price;
	}
	total += user.cart.shipping.price;
	user.cart.total = total;
	res.render('payment', {total: user.cart.total, products: req.user.cart.products, shipping: user.cart.shipping});
})

//confirmation
app.post('/checkout/summary', function(req, res) {
	var id = req.body.shipping;
	var c_payment = payment.filter(function(p) {
		return p.id == id;
	})[0];

	//calucate cart total
	user.cart.payment = c_payment;
	var total = 0;
	for(var i = 0, len = user.cart.products.length; i < len; i++) {
		total += user.cart.products[i].price;
	}
	total += user.cart.shipping.price;
	user.cart.total = total;

	var purchase = user.cart;
	user.cart 			= {};
	user.cart.products 	= [];
	user.cart.total 	= 0;
	res.render('summary', {total: purchase.total, products: purchase.products, shipping: purchase.shipping, payment: purchase.payment});
})



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});