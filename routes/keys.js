const router = require("express").Router();

const { getPublicKey } = require("../controller/keys.js");

router.get("/public", getPublicKey);

module.exports = router;
