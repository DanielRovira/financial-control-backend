require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const logger = require('morgan');

// const SQLiteStore = require('connect-sqlite3')(session);
const app = express();

const authRouter = require('./routes/auth');
const userRoutes = require("./routes/user-routes");
const DB = require("./routes/financial-control-routes");

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("trust proxy", true)
app.use(cors({ credentials: true, origin: process.env.CORS }))
app.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new MongoDBStore({
            uri: process.env.DB_URL,
            databaseName: process.env.DB,
            collection: 'LoginSessions',
    })
  }));
app.use(passport.initialize()) 
app.use(passport.authenticate('session'));

app.use('/api/oauth', authRouter);
app.use("/api", userRoutes);
app.use(`/api/${process.env.DB}`, DB);
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
