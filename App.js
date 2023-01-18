require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user-routes");
const DB = require("./routes/financial-control-routes");

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", true)
app.use(cors({ credentials: true, origin: process.env.CORS }))
app.use("/api", userRoutes);
app.use(`/api/${process.env.DB_URL}`, DB);
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
