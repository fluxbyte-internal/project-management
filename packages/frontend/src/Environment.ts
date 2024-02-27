export const baseURL = import.meta.env.VITE_API_BASE_URL;
export const CSVDownloadUrl = import.meta.env.CSV_DOWNLOAD_URL;
export const googleCredentialsClientId = import.meta.env.GOOGLE_CLIENT_ID;

export const requestURLs = {
  rootAuth: `${baseURL}/api/auth/root-auth`,
  login: `${baseURL}/api/auth/login`,
  signup: `${baseURL}/api/auth/sign-up`,
  project: `${baseURL}/api/project`,
  organisation: `${baseURL}/api/organisation`,
  userUpdateProfile: `${baseURL}/api/user/`,
  updateUserOrganisationSettings: `${baseURL}/api/user/organisation/`,
  me: `${baseURL}/api/user/me`,
  verifyEmail: `${baseURL}/api/user/verify-email`,
  resendVerifyEmailOtp: `${baseURL}/api/user/resend-otp`,
  forgotPassword: `${baseURL}/api/auth/forgot-password`,
  resetPassword: `${baseURL}/api/auth/reset-password`,
  task: `${baseURL}/api/task/`,
  fileUpload: `${baseURL}/api/user/avatarImg-update`,
  changePassword: `${baseURL}/api/user/change-password`,
  notification: `${baseURL}/api/notification/`,
  kanbanColumn: `${baseURL}/api/project/kanban-column/`,
  logOut: `${baseURL}/api/auth/logOut`,
  adminPortfolioDashboardData: `${baseURL}/api/dashboard/administartorProjects`,
  managerPortfolioDashboardData: `${baseURL}/api/dashboard/projectManagerProjects`,
  projectDashboardData: `${baseURL}/api/dashboard/dashboardByProjectId`,
};
