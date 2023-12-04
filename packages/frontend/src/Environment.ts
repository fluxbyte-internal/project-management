export const baseURL = import.meta.env.VITE_API_BASE_URL;

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
  ForgotPassword:`${baseURL}/auth/forgot-password`,
  ResetPassword:`${baseURL}/auth/reset-password`,
};
