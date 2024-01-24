import axios from "axios";
import { baseURL } from "@/Environment";

const ApiRequest = axios.create({
  baseURL,
<<<<<<< HEAD
});

ApiRequest.interceptors.request.use((config) => {
  config.withCredentials = true;
=======
  headers: {
    Authorization: `Bearer ${localStorage.getItem("Token")}`,
  },
});

ApiRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  config.headers["Authorization"] = `Bearer ${token}`;
  config.headers["organisation-id"] = localStorage.getItem("organisation-id");
  // config.headers["Content-Type"] = "application/json";
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
  return config;
});

export default ApiRequest;
