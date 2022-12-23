require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user-routes");
const financialControl = require("./routes/financial-control-routes");

app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.CORS }))
app.use("/api", userRoutes);
app.use("/api/financial-control", financialControl);

const connectionOptions = {
    dbName: process.env.DB,
    useUnifiedTopology: true
}

mongoose
    .connect(
        // `mongodb://myUserAdmin:${process.env.DB_PASS}@${process.env.DB_PATH}/?authMechanism=DEFAULT`, connectionOptions
        // `mongodb+srv://admin:${process.env.DB_PASS}@cluster0.ifkxjyh.mongodb.net/?retryWrites=true&w=majority`, connectionOptions
        `${process.env.DB_URL}`, connectionOptions
    )
    .then(() => {
    	app.listen(process.env.PORT, () => {
    		console.log(`Server has started on port ${process.env.PORT}`)
    	})})
    .catch((err) => console.log(err));
