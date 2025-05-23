import axios from "axios";

const baseURL = "https://stock-api.krushang.dev/";
const axiosBaseApi = axios.create({
  baseURL: baseURL + "api/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosBaseApi.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete axiosBaseApi.defaults.headers.common.Authorization;
    }
    return config;
  },

  (error) => console.error(error)
);

export default axiosBaseApi;
