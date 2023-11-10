export const baseURL = "http://192.168.29.102:8000/api";

export const requestURLs = {
  login: `${baseURL}/auth/login`,
  signup: `${baseURL}/auth/sign-up`,
  changePassword: `${baseURL}/auth/change-password`,
  me: `${baseURL}/user/me`,
};
