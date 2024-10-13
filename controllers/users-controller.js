const mongoose = require("mongoose")
const { User, Session } = require('../models/User');

const isAdminAuthenticated = (req, res, next)=>{
    if (req.user) {
        defaultDB = process.env.DEFAULT_USER_DB || req.user.id
        if (req.user.id === defaultDB) {
            next()
        }
        else {return res.status(403).json({ message: "User is not Admin" })}
    }
    else {return res.status(404).json({ message: "User Not Found" })}
}

const getUsersList = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, "-password -__v");
    } catch (err) {
        return new Error(err);
    }
    if (!users) {
        return res.status(404).json({ messsage: "Users Not Found" });
    }

    return res
    .status(200)
    .json({ users: users, status: 200 });
};

const patchUserData = async (req, res) => {
    try {
        const post = await User.findByIdAndUpdate(req.params.id , req.body)
        await post.save();
        req.user.id !== req.defaultDB && await Session.deleteMany({ 'session.passport.user.id': req.params.id})
        res.send(req.body);
    } catch {
        res.status(404)
    }
}

module.exports = { isAdminAuthenticated, getUsersList, patchUserData }