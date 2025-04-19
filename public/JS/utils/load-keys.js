import cryptoUtil from "./crypto.js";

const loadKeys = async () => {
  const RSAKyes = await cryptoUtil.generateRSAKeys();

  window.CLIENT_PUBLIC_KEY = await cryptoUtil.exportKey(RSAKyes.publicKey);

  window.CLIENT_PRIVATE_KEY = await cryptoUtil.exportKey(
    RSAKyes.privateKey,
    true
  );

  window.SERVER_PUBLIC_KEY = atob(localStorage.getItem("serverPublicKey"));
};

export default loadKeys;
