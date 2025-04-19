import { str2ab } from "./string.js";

const validateData = (data) => data instanceof Uint8Array;

async function importRsaKey(pem, isPrivate = false) {
  const pemKeyRegex = /-----(\w|\s)+-----|\n/g;
  const pemContents = pem.replace(pemKeyRegex, "");

  // Decode base64 to binary DER
  const binaryDerString = window.atob(pemContents);
  const binaryDer = str2ab(binaryDerString);

  const algo = {
    name: "RSA-OAEP",
    hash: "SHA-256",
  };

  const format = isPrivate ? "pkcs8" : "spki";
  const usages = isPrivate ? ["decrypt"] : ["encrypt"];

  return window.crypto.subtle.importKey(format, binaryDer, algo, true, usages);
}

const publicEncrypt = async (pbKeyPem, dataBuffer) => {
  if (!validateData(dataBuffer)) throw new Error("Data must be buffer");

  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    await importRsaKey(pbKeyPem),
    dataBuffer
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
};

const privateDecrypt = async (privateKeyPem, encryptedDataBuffer) => {
  if (!validateData(encryptedDataBuffer))
    throw new Error("Data must be buffer");

  const privateKey = await importRsaKey(privateKeyPem, true);

  const decryptedArrayBuffer = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    privateKey,
    encryptedDataBuffer
  );

  return new TextDecoder().decode(decryptedArrayBuffer);
};

const generateRSAKeys = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return keyPair;
};

const exportKey = async (key, isPrivate = false) => {
  const exported = await window.crypto.subtle.exportKey(
    isPrivate ? "pkcs8" : "spki",
    key
  );

  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  const exportedAsBase64 = btoa(exportedAsString);

  const type = isPrivate ? "PRIVATE" : "PUBLIC";
  const pem = `-----BEGIN ${type} KEY-----\n${exportedAsBase64
    .match(/.{1,64}/g)
    .join("\n")}\n-----END ${type} KEY-----`;

  return pem;
};

export default {
  generateRSAKeys,
  publicEncrypt,
  privateDecrypt,
  importRsaKey,
  exportKey,
};
