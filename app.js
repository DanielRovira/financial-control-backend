require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user-routes");
const financialControl = require("./routes/financial-control-routes");

// const router = express.Router()
// app.use(cors());
// router.get("/", (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Max-Age", "1800");
//     res.setHeader("Access-Control-Allow-Headers", "content-type");
//     res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
//      });

//  app.all('*', (req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     next();
// });


app.use(cors({ credentials: true, origin: process.env.CORS }))
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
		// app.listen(process.env.PORT, () => {
		app.listen(process.env.PORT, "0.0.0.0", () => {
			console.log(`Server has started on port ${process.env.PORT}`)
		})})
        
  .catch((err) => console.log(err));

