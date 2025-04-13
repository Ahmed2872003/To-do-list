import "../API/axios.js";

import userService from "../services/user.js";

const removeAccount = async () => {
  await axios.delete("/user");
  await userService.logout();
};

export default { removeAccount };
