export const baseURL = import.meta.env.VITE_API_BASE_URL;
export const googleCredentialsClientId = import.meta.env.GOOGLE_CLIENT_ID;

export const requestURLs = {
  rootAuth: `${baseURL}/auth/root-auth`,
  login: `${baseURL}/auth/login`,
  signup: `${baseURL}/auth/sign-up`,
  project: `${baseURL}/project`,
  organisation: `${baseURL}/organisation`,
  userUpdateProfile: `${baseURL}/user/`,
  updateUserOrganisationSettings: `${baseURL}/user/organisation/`,
  me: `${baseURL}/user/me`,
  verifyEmail: `${baseURL}/user/verify-email`,
  resendVerifyEmailOtp: `${baseURL}/user/resend-otp`,
  forgotPassword:`${baseURL}/auth/forgot-password`,
  resetPassword:`${baseURL}/auth/reset-password`,
  task:`${baseURL}/task/`,
  fileUpload:`${baseURL}/user/avatarImg-update`,
  changePassword:`${baseURL}/user/change-password`,
  logOut:`${baseURL}/auth/logOut`,
};
