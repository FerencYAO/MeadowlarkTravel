var express = require('express');
var app = express();
var handlebars = require('express3-handlebars').create({defaultLayout:'main',helpers:
{
	section:function(name,options){
		if(!this._sections) this._sections={};
		this._sections[name] = options.fn(this);
		return null;
	}
}
});
var fortune = require('./lib/fortune.js');
var formidable = require('formidable');
var jqupload = require('jquery-file-upload-middleware');
var credentials = require('./credentials.js');
/* var nodemailer = require('nodemailer');
var mailTransport = nodemailer.createTransport('SMTP',{
	host:"smtp.126.com",
	secureConnection:true,
	port:465,
	secure:true,
	auth:{
		user:credentials.netease.user,
		pass:credentials.netease.pass,
	}
}); */
/* mailTransport.sendMail({
	from:'"ferencyao@126.com',
	to:'yao_junjun@sina.com',
	subject:'Your Meadowlark Travel Tour',
	text:'Thank you for booking your trip with Meadowlark Travel.'+
		'We look forward to your visit!',
},function(err){
	if(err) console.error('Unable to send email: ' + err);
}); */
/* mailTransport.sendMail({
	from:'"ferencyao@126.com',
	to:'yao_junjun@sina.com',
	subject:'Your Meadowlark Travel Tour',
	html:'<h1>Meadowlark Travel</h1>\n<p>Thanks for book our trip with '+
		'Meadownlark Travel. <b>We look forward to your visit!</b>',
	text:'Thank you for booking your trip with Meadowlark Travel.'+
		'We look forward to your visit!',
},function(err){
	if(err) console.error('Unable to send email: ' + err);
});
 */
function getWeatherData(){
	return {
		locations:[
		{
			name:'Portland',
			forecastUrl:'http://www.wunderground.com/US/OR/Portland.html',
			iconUrl:'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
			weather:'Overcast',
			temp:'54.1 F (12.3 C)',
		},
		{
			name:'Bend',
			forecastUrl:'http://www.wunderground.com/US/OR/Bend.html',
			iconUrl:'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
			weather:'Partly Cloudy',
			temp:'55.0 F (12.8 C)',
		},
		{
			name:'Manzanita',
			forecastUrl:'http://www.wunderground.com/US/OR/Manzanita.html',
			iconUrl:'http://icons-ak.wxug.com/i/c/k/rain.gif',
			weather:'Light Rain',
			temp:'55.0 F (12.8 C)',
		},
		]
	}
};
		

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');

app.use(require('body-parser')());
app.use(express.static(__dirname+'/public'));
app.use(function(req, res, next){
	res.locals.showTests=app.get('env')!=='production' &&
		req.query.test === '1';
	next();
});
app.use(function(req,res,next){
	if(!res.locals.partials)res.locals.partials={};
	res.locals.partials.weather = getWeatherData();
	next();
});
app.use('/upload',function(req,res,next){
	var now = Date.now();
	jqupload.fileHandler({
		uploadDir:function(){
			return __dirname+'/public/uploads/' + now;
		},
		uploadUrl:function(){
			return '/uploads/' + now;
		},
	})(req,res,next);
});
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
	resave:false,
	saveUninitialized:false,
	secret:credentials.cookieSecret,
}));
app.use(function(req,res,next){
	res.locals.flash = req.session.flash;
	delete req.session.flash;
	next();
});

app.get('/',function(req,res){
	res.render('home');
});
app.get('/about',function(req,res){
	res.render('about', {
		fortune:fortune.getFortune(),
		pageTestScript:'/qa/tests-about.js'
	});
});
app.get('/tours/hood-river',function(req,res){
	res.render('tours/hood-river');
});
app.get('/tours/request-group-rate',function(req,res){
	res.render('tours/request-group-rate');
});
app.get('/jquery-test', function(req,res){
	res.render('jquery-test');
});
/* app.get('/headers', function(req,res){
	res.set('Content-Type','text/plain');
	var s = '';
	for (var name in req.headers) s+= name + ': ' + req.headers[name] + '\n';
	res.send(s);
});
 */
app.get('/nursery-rhyme',function(req,res){
	res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme',function(req,res){
	res.json({
		animal:'squirrel',
		bodyPart:'tail',
		adjective:'bushy',
		noun:'heck',
	});
});
app.get('/thank-you',function(req,res){
	res.render('thank-you');
});
app.get('/newsletter',function(req,res){
	res.render('newsletter',{csrf:'CSRF token goes here'});
});
app.get('/newsletter2',function(req,res){
	res.render('newsletter2',{csrf:'CSRF token goes here'});
});
app.get('/contest/vacation-photo',function(req,res){
	var now = new Date();
	res.render('contest/vacation-photo',{year:now.getFullYear(),month:now.getMonth()});
});
app.get('/newsletter/archive',function(req,res){
	res.render('newsletter/archive');
});
app.post('/process',function(req,res){
	console.log('Form (from querystring): '+req.query.form);
	console.log('CSRF token (from hidden form field): '+req.body._csrf);
	console.log('Name (from visible form field): '+req.body.name);
	console.log('Email (from visible form field): '+req.body.email);
	res.redirect(303, '/thank-you');
});
app.post('/process2',function(req,res){
	if(req.xhr || req.accepts('json,html')==='json'){
		res.send({success:true});
	}else{
		res.redirect(303,'/thank-you');
	}
});
app.post('/contest/vacation-photo/:year/:month',function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req,function(err,fields,files){
		if(err)return res.redirect(303,'/error');
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
		res.redirect(303,'/thank-you');
	});
});
function NewsletterSignup(){}
NewsletterSignup.prototype.save = function(cb){
	cb();
};
var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?)+$/;
app.post('/newsletter',function(req,res){
	var name=req.body.name||'',email=req.body.email||'';
	if(!email.match(VALID_EMAIL_REGEX)){
		if(req.xhr) return res.json({error:'Invalid name email address.'});
		req.session.flash={
			type:'danger',
			intro:'Validation error!',
			message:'The email address you entered was not valid.',
		};
		return res.redirect(303,'/newsletter/archive');
	}
	new NewsletterSignup({name:name,email:email}).save(function(err){
		if(err){
			if(req.xhr) return res.json({error:'Database error.'});
			req.session.flash={
				type:'danger',
				intro:'Validation error!',
				message:'The email address you entered was not valid.',
			};
			return res.redirect(303,'/newsletter/archive');
		}
		if(req.xhr) return res.json({success:true});
		req.session.flash = {
			type:'success',
			intro:'Thank you!',
			message:'You have now been signed up for the newsletter.',
		};
		return res.redirect(303,'/newsletter/archive');
	});
});

var emailService = require('./lib/email.js')(credentials);
var cartValidation = require('./lib/cartValidation.js');
app.use(cartValidation.checkWaivers);
app.use(cartValidation.checkGuestCounts);
function Product(){}
Product.find = function(conditions, fields, options, cb){
	if(typeof conditions==='function'){
		cb = conditions;
		conditions = {};
		fields = null;
		options={};
	}else if(typeof fields==='function'){
		cb = fields;
		fields=null;
		options= {};
	}else if(typeof options==='function'){
		cb = options;
		options={};
	}
	var products = [
	{
		name:'Hood River Tour',
		slug:'hood-river',
		category:'tour',
		maximumGuests:15,
		sku:723,
	},
	{
		name:'Oregon Coast Tour',
		slug:'oregon-coast',
		category:'tour',
		maximumGuests:10,
		sku:446,
	},
	{
		name:'Rock Climbing in Bend',
		slug:'rock-climbing/bend',
		category:'adventure',
		requiresWaiver:true,
		maximumGuests:4,
		sku:944,
	}];
	cb(null, products.filter(function(p){
		if(conditions.category && p.category!== conditions.category) return false;
		if(conditions.slug && p.slug!==conditions.slug) return false;
		if(isFinite(conditions.sku) && p.sku!== Number(conditions.sku)) return false;
		return true;
	}));
};
Product.findOne = function(conditions,fields,options,cb){
	if(typeof conditions==='function'){
		cb = conditions;
		conditions={};
		fields=null;
		options={};
	}else if(typeof fields==='function'){
		cb = fields;
		fields = null;
		options= {};
	}else if(typeof options==='function'){
		cb = options;
		options = {};
	}
	Product.find(conditions,fields,options,function(err, products){
		cb(err,products && products.length ? products[0] : null);
	});
};
app.get('/tours/:tour', function(req,res,next){
	Product.findOne({category:'tour',slug:req.params.tour}, function(err, tour){
		if(err) return next(err);
		if(!tour) return next();
		res.render('tour',{tour:tour});
	});
});
app.get('/adventures/:subcat/:name',function(req,res,next){
	Product.findOne({category:'adventure',slug:req.params.subcat + '/' + req.params.name}, function(err,adventure){
		if(err) return next(err);
		if(!adventure) return next();
		res.render('adventure',{adventure:adventure});
	});
});
app.post('/cart/add',function(req,res,next){
	var cart = req.session.cart || (req.session.cart = {items:[]});
	Product.findOne({sku:req.body.sku}, function(err,product){
		if(err) return next(err);
		if(!product) return next(new Error('Unknown product SKU: ' + req.body.sku));
		cart.items.push({
			product:product,
			guests:req.body.guests || 0,
		});
		res.redirect(303, '/cart');
	});
});
app.get('/cart', function(req,res,next){
	var cart = req.session.cart;
	if(!cart) next();
	res.render('cart', {cart:cart});
});
app.get('/cart/checkout',function(req,res,next){
	var cart = req.session.cart;
	if(!cart) next();
	res.render('cart-checkout');
});
app.get('/cart/thank-you', function(req,res){
	res.render('cart-thank-you',{cart:req.session.cart});
});
app.get('/email/cart/thank-you', function(req,res){
	res.render('email/cart-thank-you',{cart:req.session.cart, layout:null});
});
app.post('/cart/checkout',function(req,res){
	var cart = req.session.cart;
	if(!cart) next(new Error('Cart does not exist.'));
	var name = req.body.name || '',email = req.body.email ||'';
	if(!email.match(VALID_EMAIL_REGEX)) return res.next(new Error('Invalid email address.'));
	cart.number = Math.random().toString().replace(/^0\.0*/, '');
	cart.billing = {name:name, email:email,};
	res.render('email/cart-thank-you', 
		{layout:null, cart:cart},function(err,html){
			if(err)console.log('error in email template');
			emailService.send(cart.billing.email,'Thank you for booking your trip with Meadowlark Travel!',html);
		}
	);
	res.render('cart-thank-you',{cart:cart});
});


app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});
app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
