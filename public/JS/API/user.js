import "./axios.js";

const signin = async (user) => {
  const { data } = await axios.post("/auth/signin", user);

  localStorage.setItem("username", user.username);

  return data;
};

const getUser = async () => {
  const { data: user } = await axios.get("/user");

  return user;
};

const signup = async (user) => {
  const { data } = await axios.post("/auth/signup", user);

  return data;
};

const logout = async () => {
  await axios.post("/auth/logout");

  localStorage.clear();

  if (window.location.pathname !== "/") window.open("/", "_self");
};

export default { getUser, signin, signup, logout };
