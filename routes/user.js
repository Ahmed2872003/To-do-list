const express = require("express");

const router = express.Router();

const { deleteUser } = require("../controller/user.js");

router.route("/").delete(deleteUser);
module.exports = router;
