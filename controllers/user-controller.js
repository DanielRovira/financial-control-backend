const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.log(err);
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
        console.log(err);
    }
    return res.status(201).json({ message: user });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return new Error(err);
    }
    if (!existingUser) {
        return res.status(400).json({ message: "User not found. Signup Please", status: 400 });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Inavlid Email / Password", status: 400 });
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: `${process.env.EXP_TIME}s`,
    });
  
    console.log("Generated Token\n", token);
  
    if (req.cookies[`${existingUser._id}`]) {
        req.cookies[`${existingUser._id}`] = "";
    }
  
    res.cookie(String(existingUser._id), token
    , {
        path: "/",
        expires: new Date(Date.now() + 1000 * process.env.EXP_TIME), // seconds
        httpOnly: true,
        sameSite: "lax",
    }
    );
  
    return res
        .status(200)
        .json({ message: "Successfully Logged In", user: existingUser, token, status: 200 });
};

const verifyToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    if (cookies) {
    const token = cookies?.split("=")[1];
    if (!token) {
        res.status(404).json({ message: "No token found", status: 404 });
    }
    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Invalid Token", status: 400 });
        }
        console.log(user.id);
        req.id = user.id;
        next();
    })}
    else {return res.status(400).json({ message: "Couldn't find token", status: 400 })}
};

const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({ messsage: "User Not Found" });
    }
    return res.status(200).json({ user });
};

const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;

    if (cookies) {
        const prevToken = cookies.split("=")[1];
        if (!prevToken) {
            return res.status(400).json({ message: "Couldn't find token" });
        }
        jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json({ message: "Authentication failed" });
            }
            res.clearCookie(`${user.id}`);
            req.cookies[`${user.id}`] = "";

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
                expiresIn: "3005s",
            });
            console.log("Regenerated Token\n", token);

            res.cookie(String(user.id), token, {
                path: "/",
                expires: new Date(Date.now() + 1000 * process.env.EXP_TIME), // seconds
                httpOnly: true,
                sameSite: "lax",
            });

            req.id = user.id;
            next();
        })
    }
    else {return res.status(400).json({ message: "Couldn't find token" })}
};

const logout = (req, res, next) => {
    const cookies = req.headers.cookie;

    if (cookies) {
        const prevToken = cookies.split("=")[1];
        if (!prevToken) {
            return res.status(400).json({ message: "Couldn't find token" });
        }
        jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
            console.log(err);
            return res.status(403).json({ message: "Authentication failed" });
            }
            res.clearCookie(`${user.id}`);
            req.cookies[`${user.id}`] = "";
            return res.status(200).json({ message: "Successfully Logged Out" });
        });
    }
    else {return res.status(400).json({ message: "Couldn't find token" });}
};

exports.logout = logout;
exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
