const mongoose = require("mongoose");

const crypto = require("crypto");

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

userSchema.pre("save", function hashPass(next) {
  if (this.isModified("password")) {
    this.password = crypto
      .createHash("sha256")
      .update(this.password)
      .digest("hex");
  }
  next();
});

userSchema.methods.comparePass = function compare(password) {
  const hashedPass = crypto.createHash("sha256").update(password).digest("hex");

  return this.password === hashedPass;
};

module.exports = mongoose.model("User", userSchema);
