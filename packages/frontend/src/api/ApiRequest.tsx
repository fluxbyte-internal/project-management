import axios from "axios";
import { baseURL } from "@/Environment";

const ApiRequest = axios.create({
  baseURL,
});

ApiRequest.interceptors.request.use((config) => {
  config.headers["organisation-id"] = localStorage.getItem("organisation-id");
  config.headers["Content-Type"] = "application/json";
  config.withCredentials=true;
  return config;
});

export default ApiRequest;
