import logout from "./user/logout.js";

axios.defaults.baseURL = "http://localhost:5000/api/v1/";

// Add access token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["authorization"] = "Bearer " + token;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const statusCode = error.response.status;
    const body = error.response.data;

    console.log(error.response);

    if (statusCode === 401 && body.msg.startsWith("Token error")) {
      const {
        data: { token },
      } = await axios.post("/auth/token", {
        refreshToken: localStorage.getItem("refreshToken"),
      });

      localStorage.setItem("token", token);
    }

    if (statusCode === 401 && body.msg.startsWith("Refresh token error")) {
      logout();
      return;
    }
    return Promise.reject(error);
  }
);
