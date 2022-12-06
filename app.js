const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user-routes");
const router = require("./routes/routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/A", router);

const connectionOptions = {
    dbName: "financial-control",
    useUnifiedTopology: true
}


mongoose
  .connect(
    // `mongodb://myUserAdmin:${process.env.DB_PASS}@${process.env.DB_PATH}/?authMechanism=DEFAULT`, connectionOptions
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORORD}@cluster0.ifkxjyh.mongodb.net/?retryWrites=true&w=majority`, connectionOptions
  )

	.then(() => {
		app.listen(3001, "127.0.0.1", () => {
			console.log("Server has started!")
		})})
        
  .catch((err) => console.log(err));

