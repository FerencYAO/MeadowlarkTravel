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

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port', process.env.PORT || 3000);
app.disable('x-powered-by');
/* app.set('env', 'production') */
switch(app.get('env')){
	case 'development':
		app.use(require('morgan')('dev'));
		break;
	case 'production':
		app.use(require('express-logger')({
			path:__dirname + '/log/requests.log'
		}));
		break;
}
var mongoose = require('mongoose');
switch(app.get('env')){
	case 'development':
		mongoose.connect(credentials.mongo.development.connectionString);
		
		break;
	case 'production':
		mongoose.connect(credentials.mongo.production.connectionString);
		break;
	default:
		throw new Error('Unknown execution environment: ' + app.get('env'));
}
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
var Vacation = require('./models/vacation.js');
var VacationInSeasonListener = require('./models/vacationInSeasonListener.js');
Vacation.find(function(err, vacations){
	if(vacations.length) return;
	new Vacation({
		name:'Hood River Day Trip',
		slug:'hood-river-day-trip',
		category:'Day Trip',
		sku:'HR199',
		description:'Spend a day sailing on the Columbia and ' +
			'enjoying craft beers in Hood River!',
		priceInCents:9995,
		tags:['day trip','hood river','sailing','windsurfing','breweries'],
		inSeason:true,
		maximumGuests:16,
		available:true,
		packagesSold:0,
	}).save();
	new Vacation({
		name:'Oregon Coase Getaway',
		slug:'oregon-coase-getaway',
		category:'Weekend Getaway',
		sku:'OC39',
		description:'Enjoy the ocean air and quaint coastal towns!',
		priceInCents:269995,
		tags:['weekend getaway','oregon coast','beachcombing'],
		inSeason:false,
		maximumGuests:8,
		available:true,
		packagesSold:0,
	}).save();
	new Vacation({
		name:'Rock Climbing in Bend',
		slug:'rock-climbing-in-bend',
		category:'Adventure',
		sku:'B99',
		description:'Experience the thrill of climbing in the high desert.',
		priceInCents:289995,
		tags:['weekend getaway','bend','high desert','rock climbing'],
		inSeason:true,
		requiresWaiver:true,
		maximumGuests:4,
		available:false,
		packagesSold:0,
		notes:'The tour guide is currently recovering from a skiing accident.',
	}).save();
});
var MongoSessionStore = require('session-mongoose')(require('connect'));
var sessionStore = new MongoSessionStore({url:credentials.mongo.connectionString});
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({store:sessionStore}));
app.use(function(req,res,next){
	var domain = require('domain').create();
	domain.on('error',function(err){
		console.error('DOMAIN ERROR CAUGHT\n', err.stack);
		try{
			setTimeout(function(){
				console.error('Failsafe shutdown.');
				process.exit(1);
			}, 5000);
			var worker = require('cluster').worker;
			if(worker) worker.disconnect();
			server.close();
			try{
				next(err);
			}catch(err){
				console.error('Express error mechanism failed.\n', err.stack);
				res.statusCode = 500;
				res.setHeader('content-type', 'text/plain');
				res.end('Server error.');
			}
		}catch(err){
			console.error('Unable to send 500 response.\n', err.stack);
		}
	});
	domain.add(req);
	domain.add(res);
	domain.run(next);
});
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

app.get('/tours/hood-river',function(req,res){
	res.render('tours/hood-river');
});
/* app.get('/headers', function(req,res){
	res.set('Content-Type','text/plain');
	var s = '';
	for (var name in req.headers) s+= name + ': ' + req.headers[name] + '\n';
	res.send(s);
});
 */
app.get('/newsletter2',function(req,res){
	res.render('newsletter2',{csrf:'CSRF token goes here'});
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

var emailService = require('./lib/email.js')(credentials);
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

require('./routes.js')(app);

app.use('/api', require('cors')());
var Attraction = require('./models/attraction.js');
app.get('/api/attractions',function(req,res){
	Attraction.find({approved:true},function(err,attractions){
		if(err) return res.send(500, 'Error occurred: database errror.');
		res.json(attractions.map(function(a){
			return {
				name:a.name,
				id:a._id,
				description:a.description,
				location:a.location,
			}
		}));
	});
});
app.post('/api/attraction',function(req,res){
	var a = new Attraction({
		name:req.body.name,
		description:req.body.description,
		location:{lat:req.body.lat,lng:req.body.lng},
		history:{
			event:'created',
			email:req.body.email,
			date:new Date(),
		},
		approved:false,
	});
	a.save(function(err,a){
		if(err) return res.send(500, 'Error occurred: database error.');
		res.json({id:a._id});
	});
});
app.get('/api/attraction/:id',function(req,res){
	Attraction.findById(req.params.id,function(err, a){
		if(err) return res.send(500, 'Error occurred: database error.');
		res.json({
			name:a.name,
			id:a._id,
			description:a.description,
			location:a.location,
		});
	});
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

function startServer(){
	app.listen(app.get('port'),function(){
		console.log('Express started in ' + app.get('env') + 
			' mode on http://localhost:' + app.get('port') +
			'; press Ctrl-C to terminate.');
	});
}
if(require.main === module){
	startServer();
}else {
	module.exports = startServer;
}
/* app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
 */