var express = require('express');
var app = express();
var port = process.env.PORT || 8086;
var morgan = require('morgan')
var mongoose = require('mongoose');
var User = require('./app/models/user');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(morgan('dev'));

const dbname = 'mongodb://gvaresh:gvk$3415@ds243295.mlab.com:43295/meanjsva'
mongoose.connect(dbname, function(err){
	if(err){
   console.log('node collection error =========>' + err)
	throw err
	} else{
		console.log('connection successfull')
	}
}) 
/*var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
      console.log("Hopppk  " );

});*/
mongoose.Promise = global.Promise;

app.get('/home', function(req, res){
res.send('Mean Hello world from home');
})

app.post('/users', function(req,res){
/*res.send('testinmg route');*/
var user = new User();
user.username = req.body.username;
user.password = req.body.password;
user.email =  req.body.email;
user.save( function(err){
 if(err){
 	res.send( 'username or email already exixt')
 }
 else{
 	res.send(user +  ': values  saved');
 }
});
console.log(user);
})
app.listen(port, function(){
    console.log("Hello MEAN stack  " + port);
})


