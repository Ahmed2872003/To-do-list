const validateData = (data) => data instanceof Uint8Array;

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

async function importRsaKey(pem) {
  const pemKeyRegex = /-----(\w|\s)+-----|\n/g;
  const pemContents = pem.replace(pemKeyRegex, "");

  // base64 decode the string to get the binary data
  const binaryDerString = window.atob(pemContents);
  // convert from a binary string to an ArrayBuffer
  const binaryDer = str2ab(binaryDerString);

  console.log(binaryDer);

  return window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

const publicEncrypt = async (pbKeyPem, data) => {
  if (!validateData(data)) throw new Error("Data must be buffer");

  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    await importRsaKey(pbKeyPem),
    data
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
};

const privateDecrypt = async (privateKeyPem, encryptedData) => {
  const binaryEncryptedData = str2ab(atob(encryptedData));

  const privateKey = await importRsaKey(privateKeyPem);

  const decryptedArrayBuffer = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    privateKey,
    binaryEncryptedData
  );

  return new TextDecoder().decode(decryptedArrayBuffer);
};

// (async () => {
//   const pbKey = await importRsaKey(
//     atob(localStorage.getItem("serverPublicKey"))
//   );

//   console.log(pbKey);

//   const encrypt = await publicEncrypt(pbKey, new TextEncoder().encode("Ahmed"));

//   console.log(encrypt);
// })();

export default { importRsaKey, publicEncrypt, privateDecrypt };
