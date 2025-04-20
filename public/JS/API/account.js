import "./axios.js";

import userAPI from "./user.js";

const removeAccount = async () => {
  await axios.delete("/user");
  await userAPI.logout();
};

export default { removeAccount };
