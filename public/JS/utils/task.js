import cryptoUtil from "./crypto.js";

import { str2ab } from "./string.js";

const decryptTask = async (task, privateKey) => {
  const decryptedName = await cryptoUtil.privateDecrypt(
    privateKey,
    str2ab(atob(task.name))
  );

  return {
    ...task,
    name: decryptedName,
  };
};

const encryptTask = async (task, publicKey) => {
  const encryptedName = await cryptoUtil.publicEncrypt(
    publicKey,
    new TextEncoder().encode(task.name)
  );
  const encryptedTask = { ...task, name: encryptedName };

  return encryptedTask;
};

export default { encryptTask, decryptTask };
