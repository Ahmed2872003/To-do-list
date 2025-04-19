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

  const config = {
    key: pbKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  };

  return crypto.publicEncrypt(config, data).toString("base64");
};

const privateDecryption = (privateKey, encryptedData) => {
  if (!validateData(encryptedData)) throw new Error("data must be a buffer");

  const config = {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  };

  return crypto.privateDecrypt(config, encryptedData).toString("utf-8");
};

module.exports = { encrypt, decrypt, publicEncryption, privateDecryption };
