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
const financeRoutes = require("./routes/finance-routes");
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
        databaseName: process.env.DB,
        collection: 'LoginSessions',
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


const findDB = (req, res, next)=>{
    if (req.user) {
        req.clientID = req.params.clientID
        next()
    }
    else {return res.status(400).json({ message: "Couldn't find user", status: 400 })}
}

app.use("/api", authRoutes);
app.use(`/api/:clientID`, findDB, financeRoutes); //Não precisar utilizar o DB name. Mudar para "finance" e mudar no front tbm
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
