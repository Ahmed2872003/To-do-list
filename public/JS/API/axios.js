import userService from "../services/user.js";

axios.defaults.baseURL = "http://localhost:5000/api/v1/";

axios.interceptors.response.use((response) => response, handleRefTokenError);

axios.interceptors.response.use((response) => response, handleTokenError);

async function handleTokenError(error) {
  const statusCode = error.response.status;
  const body = error.response.data;
  const originalRequest = error.config;

  if (statusCode === 401 && body.msg.startsWith("Token error")) {
    await axios.post("/auth/token");

    return axios(originalRequest);
  }

  return Promise.reject(error);
}

async function handleRefTokenError(error) {
  const statusCode = error.response.status;
  const body = error.response.data;

  if (statusCode === 401 && body.msg.startsWith("Refresh token error"))
    return await userService.logout();

  return Promise.reject(error);
}
