const User = require('../models/User');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local');
var GoogleStrategy = require('passport-google-oauth20');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'},
    function(username, password, done) {
        User.findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: `${process.env.CORS}/api/login/oauth2/redirect/google`,
  scope: [ 'profile' , 'email' ],
  state: true
},
function(accessToken, refreshToken, profile, cb) {
  User.findOne({ email: profile.emails[0].value }, function (err, user) {
    return cb(err, user);
  });
}))

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, email: user.email, name: user.name, permissons: user.permissons });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

router.post('/', passport.authenticate('local'),
    function(req, res) {
        return res.status(200).json({ user: {name: req.user.name, email: req.user.email} });      
    }
);

router.get('/federated/google', passport.authenticate('google'));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successReturnToOrRedirect: `/`,
    failureRedirect: process.env.CORS
}));

module.exports = router;