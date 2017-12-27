
var User = require('../models/user');

module.exports =function(router) {

router.post('/users', function(req,res){
/*res.send('testinmg route');*/
var user = new User();
user.username = req.body.username;
user.password = req.body.password;
user.email =  req.body.email;
    if(user.username == ""|| user.username == null || user.password  == '' || user.password  == null || user.email =='' || user.email == null){
    	res.send('check all fields username password email are present');
    }else{
     user.save( function(err){
 if(err){
 	res.send( 'username or email already exixt')
 }
 else{
 	res.send(user +  ': values  saved');
 }
});	
    }
console.log(user);
});

return router;
}


/*
app.get('/home', function(req, res){
res.send('Mean Hello world from home');
})*/


/*app.get('/users', function(req,res){
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
*/