import logout from "./user/logout.js";

axios.defaults.baseURL = "http://localhost:5000/api/v1/";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const statusCode = error.response.status;
    const body = error.response.data;
    const originalRequest = error.config;

    if (statusCode === 401 && body.msg.startsWith("Token error"))
      return handleTokenError(originalRequest);

    if (statusCode === 401 && body.msg.startsWith("Refresh token error"))
      return await logout();

    return Promise.reject(error);
  }
);

async function handleTokenError(request) {
  await axios.post("/auth/token");

  return axios(request);
}
