const express = require("express");

const router = express.Router();

const { signup, signin } = require("../controller/auth.js");

const authenticationMiddleware = require("../middleware/auth.js");

router.route("/signup").post(signup);
router.route("/signin").post(signin);

module.exports = router;
