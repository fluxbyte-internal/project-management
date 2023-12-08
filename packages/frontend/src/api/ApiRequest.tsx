import axios from "axios";
import { baseURL } from "@/Environment";

const ApiRequest = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("Token")}`,
  },
});

ApiRequest.interceptors.request.use((config) => {
  const token = localStorage.getItem("Token");
  config.headers["Authorization"] = `Bearer ${token}`;
  config.headers["organisation-id"] = localStorage.getItem("organisation-id");
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default ApiRequest;
