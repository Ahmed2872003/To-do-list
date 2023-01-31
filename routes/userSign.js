const express = require("express");

const router = express.Router();

const { signup, signin } = require("../controller/sign.js");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
module.exports = router;
