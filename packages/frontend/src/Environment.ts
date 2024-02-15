export const baseURL = import.meta.env.VITE_API_BASE_URL;
export const googleCredentialsClientId = import.meta.env.GOOGLE_CLIENT_ID;

export const requestURLs = {
  adminPortfolioDashboardData: `${baseURL}/api/dashboard/administartorProjects`,
  changePassword: `${baseURL}/api/user/change-password`,
  fileUpload: `${baseURL}/api/user/avatarImg-update`,
  forgotPassword: `${baseURL}/api/auth/forgot-password`,
  kanbanColumn: `${baseURL}/api/project/kanban-column/`,
  logOut: `${baseURL}/api/auth/logOut`,
  login: `${baseURL}/api/auth/login`,
  managerPortfolioDashboardData: `${baseURL}/api/dashboard/projectManagerProjects`,
  me: `${baseURL}/api/user/me`,
  notification: `${baseURL}/api/notification/`,
  organisation: `${baseURL}/api/organisation`,
  project: `${baseURL}/api/project`,
  projectDashboardData: `${baseURL}/api/dashboard/dashboardByProjectId`,
  resendVerifyEmailOtp: `${baseURL}/api/user/resend-otp`,
  resetPassword: `${baseURL}/api/auth/reset-password`,
  rootAuth: `${baseURL}/api/auth/root-auth`,
  signup: `${baseURL}/api/auth/sign-up`,
  task: `${baseURL}/api/task/`,
  updateUserOrganisationSettings: `${baseURL}/api/user/organisation/`,
  userUpdateProfile: `${baseURL}/api/user/`,
  verifyEmail: `${baseURL}/api/user/verify-email`,
};
