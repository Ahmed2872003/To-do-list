const express = require("express");

const router = express.Router();

const {
  signup,
  signin,
  generateNewToken,
  logout,
} = require("../controller/auth.js");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/logout").post(logout);
router.route("/token").post(generateNewToken);

module.exports = router;
