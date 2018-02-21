var User = require('../models/user');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var secret = 'ghostRider';

module.exports = function(router) {
var options = {
  auth: {
    api_user: 'varesh',
    api_key: 'gvk9491535808'
  }
}

var client = nodemailer.createTransport(sgTransport(options));

    // localhost:8088/api/users
    // USER REGISATION ROUTE
    router.post('/users', function(req, res) {
        var user = new User(); // Create new User object
        user.username = req.body.username; // Save username from request to User object
        user.password = req.body.password; // Save password from request to User object
        user.email = req.body.email; // Save email from request to User object
        user.name = req.body.name; // Save name from request to User object
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail

        // Check if request is valid and not empty or null
        if (req.body.username === null || req.body.username === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === '' || req.body.name === null || req.body.name === '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            // Save new user to database
            user.save(function(err) {
                if (err) {
                    // Check if any validation errors exists (from user model)
                    if (err.errors !== null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); // Display error in validation (name)
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); // Display error in validation (email)
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); // Display error in validation (username)
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); // Display error in validation (password)
                        } else {
                            res.json({ success: false, message: err }); // Display any other errors with validation
                        }
                    } else if (err) {
                        // Check if duplication error exists
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'That username is already taken' }); // Display error if username already taken
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken' }); // Display error if e-mail already taken
                            }
                        } else {
                            res.json({ success: false, message: err }); // Display any other error
                        }
                    }
                } else {
                    // Create e-mail object to send to user
                    var email = {
                        from: 'MEAN Stack Staff, varesh@rubiqo.com',
                        to: [user.email, 'gandhamvaresh@gmail.com'],
                        subject: 'Your Activation Link',
                        text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8088/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8088/activate/' + user.temporarytoken + '">http://localhost:8088/activate/</a>'
                    };
                    // Function to send e-mail to the user
                    client.sendMail(email, function(err, info) {
                        if (err) {
                            console.log(err); // If error with sending e-mail, log to console/terminal
                        } else {
                            console.log(info); // Log success message to console if sent
                            console.log(user.email); // Display e-mail that it was sent to
                        }
                    });
                    res.json({ success: true, message: 'Account registered! Please check your e-mail for activation link.' }); // Send success message back to controller/request
                }
            });
        }
    });

    // router.post('/users', function(req, res) {
    //     /*res.send('testinmg route');*/
    //     console.log(req.body);
    //     var user = new User();
    //     user.username = req.body.username;
    //     user.password = req.body.password;
    //     user.email = req.body.email;
    //     user.name = req.body.name;
    //     user.temporarytoken =  jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });

    //     if (user.username == "" || user.username == null || user.password == '' || user.password == null || user.email == '' || user.email == null) {
    //         res.json({ success: false, message: 'check all fields username password email are present' });
    //     } else {
    //         user.save(function(err) {
    //             if (err) {
    //                 if (err.errors = !null) {
    //                     if (err.errors.name) {
    //                         res.json({ success: false, message: err.errors.name.message });
    //                     } else if (err.errors.email) {
    //                         res.json({ success: false, message: err.errors.email.message });
    //                     } else if (err.errors.username) {
    //                         res.json({ success: false, message: err.errors.username.message });
    //                     } else if (err.errors.password) {
    //                         res.json({ success: false, message: err.errors.password.message });
    //                     } else {
    //                         console.log('here');
    //                         res.json({ success: false, message: err });
    //                     }
    //                 }
    //                 // abouve errors validates only there formats 
    //                 // below error validates from duplicate exists or other errors from DB
    //                 else if (err) {
    //                     console.log('here2');
    //                     if (err.code == 11000) {
    //                         res.json({ success: false, message: 'Username or EMAIl already taken' });
    //                     } else {
    //                         res.json({ success: false, message: err });

    //                     }
    //                 }

    //             } // below if everyting ok save success 
    //             else {
    //                 var email = {
    //                     from: 'Localhost Saff , staff@localhost.com',
    //                     to: user.email,
    //                     subject: 'LocalHost Activation link',
    //                     text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8088/activate/' + user.temporarytoken,
    //                     html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8088/activate' + user.temporarytoken + '">http://www.herokutestapp3z24.com/activate/</a>'
    //             };
                      
    //                   client.sendMail(email, function(err, info){
    //                       if (err ){
    //                         console.log(error);
    //                       }
    //                       else {
    //                         console.log('Message sent: ' + info.response);
    //                       }
    //                   });
    //                 res.json({ success: true, message: ' Account Registered: please check for active link' });
    //             }
    //         });
    //     }
    // });


    // localhost:8088/api/checkusername
    router.post('/checkusername', function(req, res) {
        console.log(req.body);
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) throw err;
            if (user) {
                res.json({ success: false, message: 'username already taken' });
            } else {
                res.json({ success: true, message: 'valid username' });
            }
        });

    });
    // localhost:8088/api/checkemail
    router.post('/checkemail', function(req, res) {
        console.log(req.body);
        User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) throw err;
            if (user) {
                res.json({ success: false, message: 'email already taken' });
            } else {
                res.json({ success: true, message: 'valid email' });
            }
        });

    });
     // localhost:8088/api/authenticate
     router.post('/authenticate', function(req, res) {
        console.log(req.body);
        User.findOne({ username: req.body.username }).select('email username password active').exec(function(err, user) {
            if (err) throw err;
            if (!user) {
                res.send({ success: false, message: 'could not authenticate user', "user": user });
            } else if (user) {
                if (req.body.password) {
                    var validpassword = user.comparePassword(req.body.password);
                } else {
                    res.send({ success: false, message: 'no pass or enter password' });
                }
                if (!validpassword) {
                    res.send({ success: false, message: 'could not authenticate password' });
                 }else if(!user.active) {
                    res.send({ success: false, message: 'please activate your account .. pls check ur Email' });
                 }
                 else {
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                    res.send({ success: true, message: 'user validated succesfully', token: token })
                }

            }
        });

    });

//    router.put('/activate/:token', function(req,res){
//        user.findOne({ temporarytoken: req.params.token }, function(err, user){
//         if(err) throw err;
//         var token = req.params.token;
//         jwt.verify(token, secret, function(err, decoded) {
//             if (err) { res.json({ success: false, message: " Activation link Expaired invalid " })
//         } else if(!user){
// res.json({ success: false, message: " Activation link Expaired invalid " })
//         }
//              else {
//                  user.temporarytoken = false;
//                  user.active = true;
//                  user.save(function(err){
//                      if(err){
//                       console.log(err);  
//                      }else{
//                         var email = {
//                             from: 'Localhost Saff , staff@localhost.com',
//                             to: user.email,
//                             subject: 'LocalHost Activation link',
//                             text: 'Hello<strong> ' + user.name + '</strong>,<br><br> Your account activated successfully',
//                             html: 'Hello<strong> ' + user.name + '</strong>,<br><br> Your account activated successfully'
//                     };
                          
//                           client.sendMail(email, function(err, info){
//                               if (err ){
//                                 console.log(error);
//                               }
//                               else {
//                                 console.log('Message sent: ' + info.response);
//                               }
//                           });

//                     }
//                  })
//                 res.json({ success: true, message: " Activation success " })
//             }
//         });
//        });
//  });
   // Route to activate the user's account 
   router.put('/activate/:token', function(req, res) {
    User.findOne({ temporarytoken: req.params.token }, function(err, user) {
        if (err) {
            // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
            var email = {
                from: 'MEAN Stack Staff, varesh@rubiq.com',
                to: [user.email, 'gandhamvaresh@gmail.com'],
                subject: 'Error Logged',
                text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
            };
            // Function to send e-mail to myself
            client.sendMail(email, function(err, info) {
                if (err) {
                    console.log(err); // If error with sending e-mail, log to console/terminal
                } else {
                    console.log(info); // Log success message to console if sent
                    console.log(user.email); // Display e-mail that it was sent to
                }
            });
            res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
        } else {
            var token = req.params.token; // Save the token from URL for verification 
            // Function to verify the user's token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
                } else if (!user) {
                    res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
                } else {
                    user.temporarytoken = false; // Remove temporary token
                    user.active = true; // Change account status to Activated
                    // Mongoose Method to save user into the database
                    user.save(function(err) {
                        if (err) {
                            console.log(err); // If unable to save user, log error info to console/terminal
                        } else {
                            // If save succeeds, create e-mail object
                            var email = {
                                from: 'MEAN Stack Staff, varesh@rubiq.com',
                                to: user.email,
                                subject: 'Account Activated',
                                text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                            };
                            // Send e-mail object to user
                            client.sendMail(email, function(err, info) {
                                if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
                            });
                            res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
                        }
                    });
                }
            });
        }
    });
});

    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            // verify a token symmetric
            jwt.verify(token, secret, function(err, decoded) {
                if (err) { res.json({ success: false, message: " success false token invalid " }) } else {
                    req.decoded = decoded;
                    next();
                }
            });

        } else { res.json({ success: false, message: "no token found" }) }
    });



    router.post('/me', function(req, res) {
        res.send(req.decoded);
    });


    return router;
}