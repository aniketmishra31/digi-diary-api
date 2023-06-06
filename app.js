// Requiring packages
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./router/authRoutes");
const userRouter = require("./router/userRoutes.js");
const postRouter = require("./router/postRoutes.js");

//Middleware setup

app.use(cors(
    {
        origin: "https://master--funny-axolotl-e95f31.netlify.app",    // This is the port of react app
        credentials: true
    }
));

app.use(express.json());

dotenv.config();

// Connecting to database

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database."));

// Routers call setup

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

app.listen(process.env.PORT, () => {
    console.log("Server started at port " + process.env.PORT);
});