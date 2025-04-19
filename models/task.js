const mongoose = require("mongoose");

const taskCrypto = require("../utils/taskCrypto.js");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name"],
    trim: true,
    maxlength: [20, "Name can not be more than 20 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userID: {
    type: String,
    required: true,
  },
});

taskSchema.index({ name: 1, userID: 1 }, { unique: true });

taskSchema.pre("save", function (next) {
  taskCrypto.encryptTask(this);

  next();
});

taskSchema.post("save", function (taskDoc, next) {
  taskCrypto.decryptTask(taskDoc);

  next();
});

taskSchema.post("find", function (taskDocs, next) {
  taskDocs.forEach((taskDoc) => taskCrypto.decryptTask(taskDoc));

  next();
});

taskSchema.post("findOne", function (taskDoc, next) {
  if (taskDoc) taskCrypto.decryptTask(taskDoc);

  next();
});
const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;
