var mongoose = require("mongoose"); 
var credentials = require('./credentials.js');
 
var url = credentials.mongo.development.connectionString; 


var db = mongoose.connect(url); 

console.log(db);
