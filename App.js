require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const logger = require('morgan');
const app = express();

const authRoutes = require("./routes/auth-routes");
const usersRoutes = require("./routes/users-routes");
const financeRoutes = require("./routes/finance-routes");
const purchasesRoutes = require("./routes/purchases-routes");
const tasksRoutes = require("./routes/tasks-routes");
const fileUpload = require('express-fileupload');

app.use(fileUpload());

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", true)
app.use(cors({ credentials: true, origin: process.env.CORS }))
app.use(session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
        uri: process.env.DB_URL,
        databaseName: 'USERS',
        collection: 'loginsessions',
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.CORS === 'http://localhost' ? false : true, // required for cookies to work on HTTPS
        sameSite: 'lax',
        maxAge: Number(process.env.EXP_TIME) || 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));
app.use(passport.initialize()) 
app.use(passport.authenticate('session'));


// const findDB = (req, res, next)=>{
//     if (req.user) {
//         req.clientID = req.params.clientID
//         next()
//     }
//     else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
// }

app.use("/api", authRoutes);
app.use(`/api/users`, usersRoutes);
app.use(`/api/finances`, financeRoutes);
app.use(`/api/purchases`, purchasesRoutes);
app.use(`/api/tasks`, tasksRoutes);
mongoose.set("strictQuery", false);     // Will be the default after Mongoose 7. Remove after that
const connectionOptions = {
    // dbName: process.env.DB,
    useUnifiedTopology: true
}

mongoose
    .connect(
      `${process.env.DB_URL}`, connectionOptions
    )
    .then(() => {
    	  app.listen(process.env.PORT, () => {
    	  	  console.log(`Server has started on port ${process.env.PORT}`)
    	  })})
    .catch((err) => console.log(err));
