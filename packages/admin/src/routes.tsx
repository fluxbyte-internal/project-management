import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/authentication/login";
import Layout from "./components/layout";
import AuthGuard from "./guards/AuthGuard";
import OperatorsList from "./pages/operators";
import AdminConsole from "./pages/admin-console";
import OrganisationUsers from "./pages/organisation-user";

import OrganisationGuard from "./guards/OrganisationGuard";
import AccountSettings from "./pages/account-settings";
import Verification from "./pages/authentication/verification";
import ForgotPassword from "./pages/authentication/forgot-password";
import ResetPassword from "./pages/authentication/forgot-password/reset-password";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
 
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/verify-email",
    element: (
      <AuthGuard>
        <Verification />
      </AuthGuard>
    ),
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: <AdminConsole />,
      },
      {
        path: "/organisationUsers/:organisationId",
        element: <OrganisationUsers />,
      },
      {
        path: "/operators",
        element: <OperatorsList />,
      },
      {
        path: "/account-settings",
        element: <AccountSettings />,
      },
      {
        path: "/",
        element: <OrganisationGuard />,
        children: [
        ],
      },
     
    ],
  },
]);
