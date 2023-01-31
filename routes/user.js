const express = require("express");

const router = express.Router();

const { signup, signin, deleteUser } = require("../controller/user.js");

const authenticationMiddleware = require("../middleware/auth.js");

router.route("/signup").post(signup);
router.route("/signin").post(signin);

router.use(authenticationMiddleware);

router.route("/delete-user").delete(deleteUser);
module.exports = router;
