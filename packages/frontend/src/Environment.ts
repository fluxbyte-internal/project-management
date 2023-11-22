export const baseURL = import.meta.env.VITE_API_BASE_URL;

export const requestURLs = {
  login: `${baseURL}/auth/login`,
  signup: `${baseURL}/auth/sign-up`,
  me: `${baseURL}/user/me`,
};
