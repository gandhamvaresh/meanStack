var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'ghostRider';

module.exports = function(router) {
    // localhost:8088/api/users
    // USER REGISATION ROUTE
    router.post('/users', function(req, res) {
        /*res.send('testinmg route');*/
        console.log(req.body);
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;
        if (user.username == "" || user.username == null || user.password == '' || user.password == null || user.email == '' || user.email == null) {
            res.json({ success: false, message: 'check all fields username password email are present' });
        } else {
            user.save(function(err) {
                if (err) {
                    if (err.errors = !null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message });
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            console.log('here');
                            res.json({ success: false, message: err });
                        }
                    }
                    // abouve errors validates only there formats 
                    // below error validates from duplicate exists or other errors from DB
                    else if (err) {
                        console.log('here2');
                        if (err.code == 11000) {
                            res.json({ success: false, message: 'Username or EMAIl already taken' });
                        } else {
                            res.json({ success: false, message: err });

                        }
                    }

                } // below if everyting ok save success 
                else {
                    res.json({ success: true, message: ' values saved succesfully', 'username': req.body.username, "password": req.body.username });
                }
            });
        }
        console.log(user);
    });


    // localhost:8088/api/authenticate
    router.post('/authenticate', function(req, res) {
        console.log(req.body);
        User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
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
                } else {
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                    res.send({ success: true, message: 'user validated succesfully', token: token })
                }

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