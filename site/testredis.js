var express = require('express');
var app = express();
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var credentials = require('./credentials.js');
app.use(session({
	store: new RedisStore({'testkey':'testvalue'}),
	secret: credentials.cookieSecret,
	resave:false
}));