require("dotenv").config();

const { log } = require("console");
const crypto = require("crypto");

const validateData = (data) => (Buffer.isBuffer(data) ? true : false);

const encrypt = (config, data) => {
  const { algorithm = "aes-256-cbc", key, iv, targetFormat } = config;

  if (!validateData(data)) throw new Error("data must be a buffer");

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  return (
    cipher.update(data, undefined, targetFormat) + cipher.final(targetFormat)
  );
};

const decrypt = (config, encryptedData) => {
  const { algorithm = "aes-256-cbc", key, iv, targetFormat } = config;

  if (!validateData(encryptedData)) throw new Error("data must be a buffer");

  const cipher = crypto.createDecipheriv(algorithm, key, iv);

  return (
    cipher.update(encryptedData, undefined, targetFormat) +
    cipher.final(targetFormat)
  );
};

const publicEncryption = (pbKey, data) => {
  if (!validateData(data)) throw new Error("data must be a buffer");

  return crypto.publicEncrypt(pbKey, data).toString("base64");
};

const privateDecryption = (privateKey, encryptedData) => {
  if (!validateData(encryptedData)) throw new Error("data must be a buffer");

  return crypto.privateDecrypt(privateKey, encryptedData).toString("utf-8");
};

module.exports = { encrypt, decrypt, publicEncryption, privateDecryption };
