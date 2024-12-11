import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("authToken");

    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    console.log("Request error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default api;
