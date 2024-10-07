const { User } = require('../models/User');
const bcrypt = require('bcryptjs');

const isAuthenticated = (req, res, next)=>{
    if (req.user) {
        next()
    }
    else {return res.status(400).json({ message: "User Not Found", status: 400 })}
}

const getUser = async (req, res, next) => {
    const userId =  req.user.id;
    let user;
    let type
    try {
        user = await User.findById(userId, "-password");
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({ messsage: "User Not Found" });
    }

    if (userId === process.env.DEFAULT_USER_DB) {
        type = "admin"
    }
    else {
        type = "user"
    }

    return res
    .status(200)
    .json({ user: {name: user.name, email: user.email, permissions: user.permissions, language: user.language, type: type}, status: 200 });
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
};

module.exports = { isAuthenticated, getUser, signup, logout }