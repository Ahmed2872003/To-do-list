const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

const routes = require("./routes/tasks.js");

const connectDB = require("./db/connect.js");

const notFound = require("./middleware/notFound.js");

const errorHandler = require("./middleware/errorHandler.js");

require("dotenv").config();

// Middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api/v1/tasks", routes);
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
