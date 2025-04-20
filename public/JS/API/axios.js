import userAPI from "./user.js";

axios.defaults.baseURL = "http://localhost:5000/api/v1/";

axios.interceptors.response.use((response) => response, handleTokenError);

async function handleTokenError(error) {
  const statusCode = error.response.status;
  const body = error.response.data;
  const originalRequest = error.config;

  // console.log(error.response);

  if (statusCode === 401 && body.msg.startsWith("Token error")) {
    try {
      await axios.post("/auth/token");

      return axios(originalRequest);
    } catch (error) {
      // Refresh token error
      if (error.response.status === 401) {
        await userAPI.logout();
      }
    }
  }

  return Promise.reject(error);
}
