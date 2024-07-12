const User = require('../models/User');
const LoginSessions = require('../models/LoginSession');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const findSession = async (req, res, next) => {
    // const sessionID = req.body.sessionID;
    const sessionID = req.sessionID;
    try {
        sessionExists = await LoginSessions.findOne({ _id: sessionID });
    } catch (err) {
        return new Error(err);
    }

    const customError = new Error('Error 123123');
    customError.statusCode = 401;
    // (!req.sessionID) ? next(customError) : next()
    if (sessionExists) {

        // return res.send({ message: "Suc", user: {name: sessionExists.session.passport.user.name, email: sessionExists.session.passport.user.email} });
        res.user = sessionExists.session.passport.user
        next();
    }
    else {return res.status(400).json({ message: "Couldn't find session", status: 400 })}
}


const oauthLogin = async (req, res, next) => {
    console.log(req.user)
    // console.log(req.session.passport.user)
    const userId = req.user.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({ messsage: "User Not Found" });
    }

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET_KEY, {
        expiresIn: `${process.env.EXP_TIME}s`,
    });

    if (req.cookies["token"]) {
        req.cookies["token"] = "";
    }

    res.cookie("token", token
        , {
            path: "/",
            expires: new Date(Date.now() + 1000 * process.env.EXP_TIME), // seconds
            httpOnly: true,
            sameSite: "lax",
        }
        );
        
        // return res.redirect(`${process.env.CORS}/api/getUser`)
        return res.redirect(`${process.env.CORS}`)
        // return res
        // .status(200)
        // .json({ message: "Successfully Logged In", user: {name: user.name, email: user.email}, token, status: 200 });
};

exports.oauthLogin = oauthLogin;
exports.findSession = findSession;