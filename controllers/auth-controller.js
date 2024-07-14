
const isAuthenticated = (req, res, next)=>{
    if (req.user) {
        next()
    }
    else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
}

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

exports.isAuthenticated = isAuthenticated;
exports.logout = logout;