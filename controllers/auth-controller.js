const User = require('../models/User');
const bcrypt = require('bcryptjs');

const isAuthenticated = (req, res, next)=>{
    if (req.user) {
        next()
    }
    else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
}

const getUser = async (req, res, next) => {
    const userId =  req.user.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({ messsage: "User Not Found" });
    }

    return res
    .status(200)
    .json({ user: {name: user.name, email: user.email, token: req.token}, status: 200 });
};

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return new Error(err);
    }
    if (existingUser) {
        return res
            .status(400)
            .json({ message: "User already exists! Login Instead" });
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    try {
        await user.save();
    } catch (err) {
        return new Error(err);
    }
    return res.status(201).json({ message: user });
};

const logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.clearCookie("token");
        res.clearCookie("connect.sid");
        req.cookies["token"] = "";
        req.cookies["connect.sid"] = "";
        req.session.destroy()
        res.redirect('/');
      });


    // return res.status(200).json({ message: "Successfully Logged Out" });
};

// exports.isAuthenticated = isAuthenticated;
// exports.logout = logout;
module.exports = { isAuthenticated, getUser, signup, logout }