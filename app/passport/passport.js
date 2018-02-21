var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var User = require('../models/user');
var session = require('express-session');

var jwt = require('jsonwebtoken');
var secret = 'ghostRider';


module.exports = function(app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));

    passport.serializeUser(function(user, done) {
        token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new FacebookStrategy({
            clientID: '402241610215778',
            clientSecret: '6f80c7bffff92d808542eb2b44ea7782',
            callbackURL: "http://localhost:8088/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'photos', 'email']

        },
        function(accessToken, refreshToken, profile, done) {
            // User.findOrCreate(..., function(err, user) {
            User.findOne({ email: profile._json.email }).select('username password email')
                .exec(function(err, user) {
                    if (err) done(err);
                    if (user && user != null) {
                        done(null, user);
                    } else { done(err) }
                });
        }
    ));


    passport.use(new TwitterStrategy({
            consumerKey: 'SLhlxxq1u8Y3dWmsYjsPFxGMh',
            consumerSecret: 'N4cfL87WdRZ3lVK21W4vUDSwAoPLwtkLjNEGJ0TYCMiBnHLBOI',
            callbackURL: "http://localhost:8088/auth/twitter/callback",
            userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"

        },
        function(token, tokenSecret, profile, done) {
            console.log(profile.emails[0].value);
            User.findOne({ email: profile.emails[0].value }).select('username password email')
                .exec(function(err, user) {
                    console.log(user, 'user');
                    if (err) done(err);
                    if (user && user != null) {
                        done(null, user);
                    } else { done(err) }
                });
            /*console.log(profile);
            done(null, profile);*/
        }
    ));



    passport.use(new GoogleStrategy({
            clientID: '141211173246-3b7tprg95jbfpfu2jjb6nsqfkhfsi5r9.apps.googleusercontent.com',
            clientSecret: 'GvRQdcqNG3qrLCPa-ii6B8dT',
            callbackURL: "http://localhost:8088/auth/google/callback"
        },
        function(token, tokenSecret, profile, done) {
            console.log(profile.emails[0].value);
            User.findOne({ email: profile.emails[0].value }).select('username password email')
                .exec(function(err, user) {
                    console.log(user, 'user');
                    if (err) done(err);
                    if (user && user != null) {
                        done(null, user);
                    } else { done(err) }
                });
        }
    ));

    // FB Route URLS 
    // get user email
    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: 'email' })
    );

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/facebookerror' }),
        function(req, res) {
            res.redirect('/facebook/' + token)
        });


    // Twitter Routes
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req, res) {
        res.redirect('/twitter/' + token); // Redirect user with newly assigned token
    });

    // GOOGLE ROUTEs
    app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/googleerror' }),
        function(req, res) {
            res.redirect('/google/' + token);
        });;

    return passport;
}