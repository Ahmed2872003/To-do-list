import "../API/axios.js";

const signin = async (user) => {
  const { data } = await axios.post("/auth/signin", user);

  localStorage.setItem("username", user.username);

  return data;
};

const signup = async (user) => {
  const { data } = await axios.post("/auth/signup", user);

  return data;
};

const logout = async () => {
  await axios.post("/auth/logout");
  localStorage.removeItem("username");
  localStorage.removeItem("serverPublicKey");

  if (window.location.pathname !== "/") window.open("/", "_self");
};

const removeAccount = async () => {
  await axios.delete("/user");
  await logout();
};

export default { signin, signup, logout };
