require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user-routes");
const financialControl = require("./routes/financial-control-routes");

app.use(cors());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/financial-control", financialControl);

const connectionOptions = {
    dbName: process.env.DB,
    useUnifiedTopology: true
}

mongoose
  .connect(
    // `mongodb://myUserAdmin:${process.env.DB_PASS}@${process.env.DB_PATH}/?authMechanism=DEFAULT`, connectionOptions
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORORD}@cluster0.ifkxjyh.mongodb.net/?retryWrites=true&w=majority`, connectionOptions
  )

	.then(() => {
		// app.listen(process.env.PORT, "127.0.0.1", () => {
		app.listen(process.env.PORT, () => {
			console.log(`Server has started on port ${process.env.PORT}`)
		})})
        
  .catch((err) => console.log(err));

