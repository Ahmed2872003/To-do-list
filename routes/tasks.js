const express = require("express");

const router = express.Router();
const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} = require("../controller/tasks.js");

router.route("/").get(getAllTasks).post(createTask).delete(deleteAllTasks);
router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

module.exports = router;
