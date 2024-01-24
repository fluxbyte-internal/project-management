import axios from "axios";
import { baseURL } from "@/Environment";

const ApiRequest = axios.create({
  baseURL,
});

ApiRequest.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export default ApiRequest;
