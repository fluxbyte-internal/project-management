import axios, { AxiosError, AxiosResponse } from "axios";
import { baseURL } from "@/Environment";

const ApiRequest = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("Token")}`,
  },
});

const responseHandler = (response: AxiosResponse) => {
  return response;
};

const errorHandler = (error: AxiosError) => {
  return Promise.reject(error);
};

ApiRequest.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

ApiRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token");
    config.headers["Authorization"] = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error)
);

export default ApiRequest;
