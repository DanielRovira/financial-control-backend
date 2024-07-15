const User = require('../models/User');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
var LocalStrategy = require('passport-local');

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

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        cb(null, { id: user.id, email: user.email, name: user.name });
    });
});

passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, user);
    });
});

router.post('/',
    passport.authenticate('local'),
    function(req, res) {
        return res
        .status(200)
        .json({ message: "Successfully Logged In", user: {name: req.user.name, email: req.user.email}, status: 200 });      
    }
);

module.exports = router;