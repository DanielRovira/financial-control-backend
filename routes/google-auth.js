const User = require('../models/User');
var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: `${process.env.CORS}/api/oauth/oauth2/redirect/google`,
  scope: [ 'profile' , 'email' ],
  state: true
},
function(accessToken, refreshToken, profile, cb) {
  User.findOne({ email: profile.emails[0].value }, function (err, user) {
    return cb(err, user);
  });
}))
  
// passport.serializeUser(function(user, cb) {
//   process.nextTick(function() {
//     cb(null, { id: user.id, email: user.email, name: user.name });
//   });
// });

// passport.deserializeUser(function(user, cb) {
//   process.nextTick(function() {
//     return cb(null, user);
//   });
// });

var router = express.Router();

router.get('/login/federated/google', passport.authenticate('google'));
router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successReturnToOrRedirect: `/`,
    failureRedirect: process.env.CORS
}));

module.exports = router;
