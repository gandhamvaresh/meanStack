// Packages -- ussing 
var express = require('express');
var app = express();
var port = process.env.PORT || 8089;
var morgan = require('morgan')
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');



// middle ware using 
app.use(morgan('dev'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));
app.use('/api',appRoutes); // order middle ware should be more imp




// mongo DB Connection 
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



// routes ---------------
app.get('*', function(req, res){
	console.log(path.join(__dirname + '/public/app/views/index.html'));
res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});




// server port 
app.listen(app.get(port), '127.0.0.1', function() {
  console.log('app listening on port %d in %s mode', app.get(port), app.get('env'));
});;
