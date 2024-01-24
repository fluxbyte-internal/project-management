export const baseURL = import.meta.env.VITE_API_BASE_URL;

export const requestURLs = {
  rootAuth: `${baseURL}/auth/root-auth`,
  login: `${baseURL}/console/login`,
  project: `${baseURL}/project`,
  organisationStatus: `${baseURL}/console/organisation/status`,
  operators: `${baseURL}/console/operator`,
  user: `${baseURL}/console/user`,
  organisation: `${baseURL}/console/organisations`,
  userUpdateProfile: `${baseURL}/user/`,
  consoleUserUpdateProfile: `${baseURL}/console/`,
  updateUserOrganisationSettings: `${baseURL}/user/organisation/`,
  me: `${baseURL}/console/me`,
  verifyEmail: `${baseURL}/user/verify-email`,
  resendVerifyEmailOtp: `${baseURL}/user/resend-otp`,
  forgotPassword:`${baseURL}/auth/forgot-password`,
  resetPassword:`${baseURL}/auth/reset-password`,
  task:`${baseURL}/task/`,
  fileUpload:`${baseURL}/console/profile`,
  changePassword:`${baseURL}/console/change-password`,
  logOut:`${baseURL}/auth/logOut`,
};
