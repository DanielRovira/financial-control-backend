require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const logger = require('morgan');
const { isAuthenticated } = require('./controllers/auth-controller');

const app = express();

const passportLocal = require('./routes/passport-local');
const googleRouter = require('./routes/google-auth');
const userRoutes = require("./routes/user-routes");
const DB = require("./routes/financial-control-routes");

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", true)
app.use(cors({ credentials: true, origin: [process.env.CORS] }))
app.use(session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
        uri: process.env.DB_URL,
        databaseName: process.env.DB,
        collection: 'LoginSessions',
        expires: Number(process.env.EXP_TIME) || 1000 * 60 * 60 * 24 * 7 // 1 week
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

app.use("/api/login", passportLocal);
app.use('/api/oauth', googleRouter);
app.use("/api", userRoutes);
app.use(`/api/${process.env.DB}`, isAuthenticated, DB);
mongoose.set("strictQuery", false);     // Will be the default after Mongoose 7. Remove after that
const connectionOptions = {
    dbName: process.env.DB,
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
