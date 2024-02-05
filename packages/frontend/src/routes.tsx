import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/authentication/login";
import Layout from "./components/layout";
import AuthGuard from "./guards/AuthGuard";
import Organisation from "./pages/organisation";
import Signup from "./pages/authentication/signup";
import OrganisationGuard from "./guards/OrganisationGuard";
import ProjectsList from "./pages/projectsList";
import AccountSettings from "./pages/account-settings";
import ProjectDetails from "./pages/project-details/ProjectDetails";
import OrganisationDetails from "./pages/organisation/OrganisationDetails";
import Verification from "./pages/authentication/verification";
import ForgotPassword from "./pages/authentication/forgot-password";
import ResetPassword from "./pages/authentication/forgot-password/reset-password";
import ProjectView from "./pages/projectView/ProjectView";
import TaskViews from "./components/views";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
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
        element: <Organisation />,
      },
      {
        path: "/dashboard",
        element: <div>Dashboard</div>,
      },
      {
        path: "/account-settings",
        element: <AccountSettings />,
      },
      {
        path: "/project-details/:id",
        element: <ProjectDetails />,
      },
      {
        path: "/project-view/:projectId",
        element: <ProjectView  />,
      },
      {
        path: "/organisation/:organisationId",
        element: <OrganisationDetails />,
      },
      {
        path: "/",
        element: <OrganisationGuard />,
        children: [
          {
            path: "/projects",
            element: <ProjectsList />,
          },
          {
            path: "/tasks/:projectId",
            element: <TaskViews />,
          },
        ],
      },
     
    ],
  },
]);
