var User = require('../models/user');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var secret = 'ghostRider';

module.exports = function (router) {
    var options = {
        auth: {
            api_user: 'varesh',
            api_key: 'gvk9491535808'
        }
    }

    var client = nodemailer.createTransport(sgTransport(options));

    // localhost:8088/api/users
    // USER REGISATION ROUTE
    router.post('/users', function (req, res) {
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
            user.save(function (err) {
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
                    client.sendMail(email, function (err, info) {
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
    router.post('/checkusername', function (req, res) {
        console.log(req.body);
        User.findOne({ username: req.body.username }).select('username').exec(function (err, user) {
            if (err) throw err;
            if (user) {
                res.json({ success: false, message: 'username already taken' });
            } else {
                res.json({ success: true, message: 'valid username' });
            }
        });

    });
    // localhost:8088/api/checkemail
    router.post('/checkemail', function (req, res) {
        console.log(req.body);
        User.findOne({ email: req.body.email }).select('email').exec(function (err, user) {
            if (err) throw err;
            if (user) {
                res.json({ success: false, message: 'email already taken' });
            } else {
                res.json({ success: true, message: 'valid email' });
            }
        });

    });
    // localhost:8088/api/authenticate
    router.post('/authenticate', function (req, res) {
        console.log(req.body);
        User.findOne({ username: req.body.username }).select('email username password active').exec(function (err, user) {
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
                    // console.log(res);
                    res.send({ success: false, message: 'could not authenticate password' });
                } else if (!user.active) {
                    res.send({ success: false, message: 'please activate your account .. pls check ur Email', expired: true });
                }
                else {
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '1h' });
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
    router.put('/activate/:token', function (req, res) {
        User.findOne({ temporarytoken: req.params.token }, function (err, user) {
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
                client.sendMail(email, function (err, info) {
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
                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
                    } else if (!user) {
                        res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
                    } else {
                        user.temporarytoken = false; // Remove temporary token
                        user.active = true; // Change account status to Activated
                        // Mongoose Method to save user into the database
                        user.save(function (err) {
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
                                client.sendMail(email, function (err, info) {
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

    // router.post('/resend', function(req, res) {
    //     console.log(req.body);
    //     User.findOne({ username: req.body.username }).select('username password active').exec(function(err, user) {
    //         if (err) throw err;
    //         if (!user) {
    //             res.json({ success: false, message: 'could not authenticate user' });
    //         } else if (user) {
    //             if (req.body.password) {
    //                 var validpassword = user.comparePassword(req.body.password);
    //             } else {
    //                 res.json({ success: false, message: 'no pass or enter password' });
    //             }
    //             if (!validpassword) {
    //                 res.json({ success: false, message: 'could d not  authenticate password' });
    //              }else if(user.active) {
    //                 res.json({ success: false, message: 'account already activated' });
    //              }
    //              else {
    //                 res.json({ user: user });
    //             }

    //         }
    //     });

    // });

    router.post('/resend', function (req, res) {
        User.findOne({ username: req.body.username }).select('username password active').exec(function (err, user) {
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Resend, Rubiq@vareshResend.com',
                    to: 'gandhamvaresh@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function (err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                // Check if username is found in database
                if (!user) {
                    res.json({ success: false, message: 'Could not authenticate user' }); // Username does not match username found in database
                } else if (user) {
                    // Check if password is sent in request
                    if (req.body.password) {
                        var validPassword = user.comparePassword(req.body.password); // Password was provided. Now check if matches password in database
                        if (!validPassword) {
                            res.json({ success: false, message: 'Could not authenticate password' }); // Password does not match password found in database
                        } else if (user.active) {
                            res.json({ success: false, message: 'Account is already activated.' }); // Account is already activated
                        } else {
                            res.json({ success: true, user: user });
                        }
                    } else {
                        res.json({ success: false, message: 'No password provided' }); // No password was provided
                    }
                }
            }
        });
    });

    router.put('/resend', function (req, res) {
        User.findOne({ username: req.body.username }).select('username name email temporarytoken').exec(function (err, user) {
            if (err) throw err;
            user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail
            user.save(function (err) {
                if (err) {
                    console.log(err)
                } else {
                    var email = {
                        from: 'MEAN Stack Staff, varesh@rubiqo.com',
                        to: [user.email, 'gandhamvaresh@gmail.com'],
                        subject: 'Your Activation Link',
                        text: 'Hello ' + user.name + ', This Is an Resending link . Please click on the following link to complete your activation: http://localhost:8088/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This Is an Resending link -- . Please click on the link below to complete your activation:<br><br><a href="http://localhost:8088/activate/' + user.temporarytoken + '">http://localhost:8088/activate/</a>'

                    };
                    // Function to send e-mail to myself
                    client.sendMail(email, function (err, info) {
                        if (err) {
                            console.log(err); // If error with sending e-mail, log to console/terminal
                        } else {
                            console.log(info); // Log success message to console if sent
                            console.log(user.email); // Display e-mail that it was sent to
                        }
                    });
                    res.json({ success: true, message: 'Activation Link hassbeen sent to user  :  ' + user.email + '  !' })
                }
            })
        });
    });

    router.get('/resetusername/:email', function (req, res) {
        User.findOne({ email: req.params.email }).select('email name username').exec(function (err, user) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!req.params.email) {
                    res.json({ success: false, message: 'E-Mail was not provided' });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Email was not found' });
                    } else {
                        var email = {
                            from: 'MEAN Stack Staff, varesh@rubiq.com',
                            to: [user.email, 'gandhamvaresh@gmail.com'],
                            subject: 'localhost forgot Username request ',
                            text: 'Hello<strong> ' + user.name + '</strong>,<br><br>you recently requested your username -- Please save it:' + user.username,
                            html: 'Hello<strong> ' + user.name + '</strong>,<br><br>you recently requested your username -- Please save it:' + user.username

                        };
                        // Function to send e-mail to myself
                        client.sendMail(email, function (err, info) {
                            if (err) {
                                console.log(err); // If error with sending e-mail, log to console/terminal
                            } else {
                                console.log(info); // Log success message to console if sent
                                console.log(user.email); // Display e-mail that it was sent to
                            }
                        });

                        res.json({ success: true, message: 'username has been sent to Email' });
                    }
                }

            }
        });
    });
    router.put('/resetpassword', function (req, res) {
        User.findOne({ username: req.body.username }).select('username active email resettoken name').exec(function (err, user) {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'Username was not found' });
                } else if (!user.active) {
                    res.json({ success: false, message: 'user  was not yet activated' });
                }
                else {
                    user.resettoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); // Create a token for activating account through e-mail

                    user.save(function (err) {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            var email = {
                                from: 'MEAN Stack Staff, varesh@rubiq.com',
                                to: [user.email, 'gandhamvaresh@gmail.com'],
                                subject: 'localhost RESET  Password request ',
                                text: 'Hello<strong> ' + user.name + '</strong>,<br><br>you recently requested your password reset -- Please click below ro reset password: http://localhost:8088/reset/' + user.resettoken,
                                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>you recently requested your password reset -- Please click below ro reset password:<br><br><a href="http://localhost:8088/reset/' + user.resettoken + '">http://localhost:8088/reset/</a>'


                            };
                            // Function to send e-mail to myself
                            client.sendMail(email, function (err, info) {
                                if (err) {
                                    console.log(err); // If error with sending e-mail, log to console/terminal
                                } else {
                                    console.log(info); // Log success message to console if sent
                                    console.log(user.email); // Display e-mail that it was sent to
                                }
                            });

                            res.json({ success: true, message: 'please check your email for password reset link' });
                        }
                    });



                }


            }
        });
    });


    router.get('/resetpassword/:token', function (req, res) {
        console.log('get in now');

        User.findOne({ resettoken: req.params.token }).select().exec(function (err, user) {
            if (err) throw err;
            var token = req.params.token;
            // verify a token symmetric
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    res.json({ success: false, message: "password link has expired " })
                } else {
                    if (!user) {
                        res.json({ success: false, message: "password link has expired " })

                    } else {
                        res.json({ success: true, user: user });
                    }
                    // req.decoded = decoded;
                    // next();
                }
            });
        });
        console.log('get out now');

    });

    // router.put('/savePassword', function (req, res) {
    //     User.findOne({ username: req.body.username }).select('username password email resettoken name').exec(function (err, user) {
    //         if (err) throw err;
    //         if (re.body.password == null || re.body.password == '') {
    //             res.json({ success: false, message: "password not provided" })
    //         } else {
    //             user.password = req.body.password;
    //             user.resettoken = false;
    //             user.save(function (err) {
    //                 if (err) { res.json({ success: false, message: err }) }
    //                 else {
    //                     var email = {
    //                         from: 'MEAN Stack Staff, varesh@rubiq.com',
    //                         to: [user.email, 'gandhamvaresh@gmail.com'],
    //                         subject: 'localhost Password updated Successfully ',
    //                         text: 'Hello<strong> ' + user.name + '</strong>,<br><br>you recently requested your password localhost updated successfully',
    //                         html: 'Hello<strong> ' + user.name + '</strong>,<br><br>you recently requested your password localhost updated successfully'
    //                     };
    //                     // Function to send e-mail to myself
    //                     client.sendMail(email, function (err, info) {
    //                         if (err) {
    //                             console.log(err); // If error with sending e-mail, log to console/terminal
    //                         } else {
    //                             console.log(info); // Log success message to console if sent
    //                             console.log(user.email); // Display e-mail that it was sent to
    //                         }
    //                     });
    //                     res.json({
    //                         success: true, message: "password has been reset"
    //                     }
    //                     )
    //                 };
    //             })

    //         };


    //     });


    router.put('/savePassword', function (req, res) {
        console.log('put in now');
        // User.findOne({ username: req.body.username }).select('username email name password resettoken').exec(function(err, user) {
        User.findOne({ username: req.body.username }).select('username active email password resettoken name').exec(function (err, user) {

            console.log('put in now   + ' + err + "user is    :  " + user);
            if (err) {
                // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, Rubiq@zoho.com',
                    to: 'gandhamvaresh@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function (err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else {
                console.log('put in now req.body.password + ' + req.body.password);
                if (req.body.password === null || req.body.password === '') {
                    res.json({ success: false, message: 'Password not provided' });
                } else {
                    user.password = req.body.password; // Save user's new password to the user object
                    user.resettoken = false; // Clear user's resettoken 
                    // Save user's new data
                    user.save(function (err) {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            // Create e-mail object to send to user
                            var email = {
                                from: 'MEAN Stack Staff, Rubiq@AJS1.com',
                                to: user.email,
                                subject: 'Password Recently Reset success',
                                text: 'Hello ' + user.name + ', This e-mail is to notify you that your password was recently reset at ',
                                html: 'Hello<strong> ' + user.name + '</strong>,<br><br>This e-mail is to notify you that your password was recently reset at'
                            };
                            // Function to send e-mail to the user
                            client.sendMail(email, function (err, info) {
                                if (err) console.log(err); // If error with sending e-mail, log to console/terminal
                            });
                            res.json({ success: true, message: 'Password has been reset!' }); // Return success message
                        }
                    });
                }
            }
        });
        console.log('put in now');

    });

    router.use(function (req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            // verify a token symmetric
            jwt.verify(token, secret, function (err, decoded) {
                if (err) { res.json({ success: false, message: " success false token invalid " }) } else {
                    req.decoded = decoded;
                    next();
                }
            });

        } else { res.json({ success: false, message: "no token found" }) }
    });



    router.post('/me', function (req, res) {
        res.send(req.decoded);
    });

    // Route to provide the user with a new token to renew session
    router.get('/renewToken/:username', function (req, res) {
        User.findOne({ username: req.params.username }).select('username email').exec(function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: "no user found found" })
            } else {
                var newToken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24H' });
                res.send({ success: true, token: newToken })
            }
        });
    });


    router.get('/permission', function (req, res) {
        User.findOne({ username: req.decoded.username }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'no user found' });
            } else {
                res.json({ success: true, permission: user.permission });
            }
        });
    });

    router.get('/management', function (req, res) {
        User.find({}, function (err, users) {
            if (err) throw err;
            User.findOne({ username: req.decoded.username }, function (err, mainUser) {
                if (err) throw err;
                if (!mainUser) {
                    res.json({ success: false, message: 'no user found' });

                } else {
                    if (mainUser.permission === 'admin' || mainUser.permission === "moderator") {
                        // user has permitions
                        if (!users) {
                            res.json({ success: false, message: ' user  not found' });
                        } else {
                            res.json({ success: true, users: users, permission: mainUser.permission });
                        }

                    } else {
                        res.json({ success: false, message: 'insufficient permitions' });

                    }
                }
            })
        });
    });

    router.delete('/management/:username', function (req, res) {
        var deleteUser = req.params.username;
        User.findOne({ username: req.decoded.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: 'No user Found' });
            } else {
                if (mainUser.permission !== 'admin') {
                    res.json({ success: false, message: 'insufficient permitions' });
                } else {
                    User.findOneAndRemove({ username: deleteUser }, function (req, user) {
                        if (err) throw err;
                        res.json({ success: true });
                    })
                }
            }
        })
    });

    router.get('/edit/:id', function (req, res) {
        var editUser = req.params.id;
        User.findOne({ username: req.decoded.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: "No user Found" });
            } else {
                if (mainUser.permission === 'admin' || mainUser.permission === "moderator") {
                    User.findOne({ _id: editUser }, function (err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({ success: false, message: "No user Found" });
                        } else {
                            res.json({ success: true, user: user });
                        }
                    });
                } else {
                    res.json({ success: false, message: "Insufficient permissions" });
                }
            }
        });
    });

    router.put('/edit', function (req, res) {
        var editUser = req.body.username;
        if (req.body.name) var newName = req.body.name;
        if (req.body.username) var newUserName = req.body.username;
        if (req.body.email) var newEmail = req.body.email;
        if (req.body.permission) var newPermission = req.body.permission;
        User.findOne({ username: req.decoded.username }, function (err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: "No user Found" });
            } else {
                if (newName) {
                    if (mainUser.permission === 'admin' || mainUser.permission === "moderator") {
                        User.findOne({ username: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: "No user Found" });
                            } else {
                                user.name = newName;
                                user.save(function (err) {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        res.json({ success: true, message: "name has been updated" })
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission" })
                    }

                } if (newUserName) {
                    if (mainUser.permission === 'admin' || mainUser.permission === "moderator") {
                        User.findOne({ username: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: "No user Found" });
                            } else {
                                user.username = newUserName;
                                user.save(function (err) {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        res.json({ success: true, message: "UserName has been updated" })
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission" })
                    }

                }
                if (newEmail) {
                    if (mainUser.permission === 'admin' || mainUser.permission === "moderator") {
                        User.findOne({ username: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: "No user Found" });
                            } else {
                                user.email = newEmail;
                                user.save(function (err) {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        res.json({ success: true, message: "Email has been updated" })
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission" })
                    }

                } if (newPermission) {
                    if (mainUser.permission === 'admin' || mainUser.permission === "moderator") {
                        User.findOne({ username: editUser }, function (err, user) {
                            if (err) throw err;
                            if (!user) {
                                res.json({ success: false, message: "No user Found" });
                            } else {
                                if (newPermission === 'user') {
                                    if (user.permission === 'admin') {
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade an admin.' }); // Return error

                                            user.permission = newPermission;
                                            user.save(function (err) {
                                                if (err) {
                                                    console.log(err)
                                                } else {
                                                    res.json({ success: true, message: "Permission has been updated" })
                                                }
                                            });

                                        }
                                    } else {
                                        user.permission = newPermission;
                                        user.save(function (err) {
                                            if (err) {
                                                console.log(err)
                                            } else {
                                                res.json({ success: true, message: "Permission has been updated" })
                                            }
                                        });

                                    }

                                }
                                // -----------------
                                if (newPermission === 'moderator') {
                                    if (user.permission === 'admin') {
                                        if (mainUser.permission !== 'admin') {
                                            res.json({ success: false, message: 'Insufficient Permissions. You must be an admin to downgrade an admin.' }); // Return error

                                            user.permission = newPermission;
                                            user.save(function (err) {
                                                if (err) {
                                                    console.log(err)
                                                } else {
                                                    res.json({ success: true, message: "Permission has been updated" })
                                                }
                                            });


                                        }
                                    }

                                } else {
                                    user.permission = newPermission;
                                    user.save(function (err) {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            res.json({ success: true, message: "Permission has been updated" })
                                        }
                                    });


                                    
                                }
                            }
                        });
                    } else {
                        res.json({ success: false, message: "Insufficient Permission" })
                    }

                }
            }
        });
    });

    return router;   // Return router object to server
};