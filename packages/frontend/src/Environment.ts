export const baseURL = import.meta.env.VITE_API_BASE_URL;

export const requestURLs = {
  rootAuth: `${baseURL}/auth/root-auth`,
  login: `${baseURL}/auth/login`,
  signup: `${baseURL}/auth/sign-up`,
  getProject: `${baseURL}/project`,
  organisation: `${baseURL}/organisation`,
  userUpdateProfile: `${baseURL}/user/`,
  updateUserOrganisationSettings: `${baseURL}/user/organisation/`,
  me: `${baseURL}/user/me`,
};
