const cryptoUtil = require("./crypto.js");

const cryptoConfig = {
  key: Buffer.from(process.env.SECRET_KEY, "base64"),
  iv: Buffer.from(process.env.IV, "base64"),
  targetFormat: "base64",
};

function encryptTask(task) {
  task.name = cryptoUtil.encrypt(cryptoConfig, Buffer.from(task.name, "utf-8"));
}

function decryptTask(task) {
  task.name = cryptoUtil.decrypt(
    { ...cryptoConfig, targetFormat: "utf-8" },
    Buffer.from(task.name, "base64")
  );
}

module.exports = { encryptTask, decryptTask };
