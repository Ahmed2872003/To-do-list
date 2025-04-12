const express = require("express");

const router = express.Router();

const { getUser, deleteUser } = require("../controller/user.js");

router.route("/").get(getUser).delete(deleteUser);

module.exports = router;
