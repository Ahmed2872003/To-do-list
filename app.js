require("dotenv").config();
require("express-async-errors");

const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

const taskRouter = require("./routes/tasks.js");

const userRouter = require("./routes/user.js");

const connectDB = require("./db/connect.js");

const notFound = require("./middleware/notFound.js");

const errorHandler = require("./middleware/errorHandler.js");
const authenticationMiddleware = require("./middleware/auth.js");

// Middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/v1/tasks", authenticationMiddleware);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/user", userRouter);
app.use(notFound);
app.use(errorHandler);
// Middlewares

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => console.log(`API is listening on port : ${port}`));
    console.log("CONNECTED TO THE DATABASE...");
  } catch (err) {
    console.log(err);
  }
};

start();
