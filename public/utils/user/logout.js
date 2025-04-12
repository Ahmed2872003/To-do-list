const logout = async () => {
  await axios.post("/auth/logout");
  localStorage.removeItem("username");
  window.open("/", "_self");
};

export default logout;
