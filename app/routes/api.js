var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'ghostRider';

module.exports = function(router) {
    // localhost:8088/api/users
    // USER REGISATION ROUTE
    router.post('/users', function(req, res) {
        /*res.send('testinmg route');*/
        console.log('here');
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        if (user.username == "" || user.username == null || user.password == '' || user.password == null || user.email == '' || user.email == null) {
            res.json({ success: false, message: 'check all fields username password email are present' });
        } else {
            user.save(function(err) {
                if (err) {
                    res.json({ success: false, message: 'username or email already exixt' });
                } else {
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