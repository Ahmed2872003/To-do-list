const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Must provide a username"],
    trim: true,
    minlength: [5, "username can not be less than 5 characters"],
    maxlength: [20, "Username can not be more than 20 characters"],
  },
  password: {
    type: String,
    required: [true, "Must provide a password"],
    minlength: [5, "password can not be less than 5 characters"],
    maxlength: [30, "Password can not be more than 30 characters"],
  },
});

module.exports = mongoose.model("User", userSchema);
