
var User = require('../models/user');

module.exports =function(router) {
// localhost:8088/api/users
// USER REGISATION ROUTE
router.post('/users', function(req,res){
/*res.send('testinmg route');*/
console.log('here');
var user = new User();
user.username = req.body.username;
user.password = req.body.password;
user.email =  req.body.email;
    if(user.username == ""|| user.username == null || user.password  == '' || user.password  == null || user.email =='' || user.email == null){
    	//res.send('check all fields username password email are present');
    	res.json({success: false, message: 'check all fields username password email are present'});
    }else{
     user.save( function(err){
 if(err){
 //	res.send( 'username or email already exixt')
 	res.json({success: false, message: 'username or email already exixt'});
 }
 else{
 //	res.send(user +  ': values  saved');
     /*console.log(req.body.username +  ':req.body.username;');
          console.log(req.body.password +  ':req.body.password;');*/
    
 	res.json({success: true, message:' values saved succesfully','username': req.body.username, "password": req.body.username  });
 }
});	
    }
console.log(user);
});



router.post('/authenticate', function(req,res){
     User.findOne({ username: req.body.username}).select('email username password').exec(function(err, user){
        if (err) throw err;
        if(!user){
        	res.json({ success: false, message: 'could not authenticate user',"user": user});
        }else if(user){
        var validpassword = user.comparePassword(req.body.password, ) 

          if(!validPassword){
          	res.json({success: false, message: 'could not authenticate password'});
          }else{  res.json({success: true, message: 'user validated succesfully'}) 
                 }

           }
     });

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

