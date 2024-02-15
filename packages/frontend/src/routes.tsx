import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/authentication/login';
import Layout from './components/layout';
import AuthGuard from './guards/AuthGuard';
import Organisation from './pages/organisation';
import Signup from './pages/authentication/signup';
import OrganisationGuard from './guards/OrganisationGuard';
import ProjectsList from './pages/projectsList';
import AccountSettings from './pages/account-settings';
import ProjectDetails from './pages/project-details/ProjectDetails';
import OrganisationDetails from './pages/organisation/OrganisationDetails';
import Verification from './pages/authentication/verification';
import ForgotPassword from './pages/authentication/forgot-password';
import ResetPassword from './pages/authentication/forgot-password/reset-password';
import TaskViews from './components/views';
import Page404 from './rootAuth/404page';
import Dashboard from './pages/dashboard';
import ProjectDashboard from './pages/dashboard/projectDashboard';

export const router = createBrowserRouter([
  {
    element: <Login />,
    path: '/login',
  },
  {
    element: <Signup />,
    path: '/signup',
  },
  {
    element: <ForgotPassword />,
    path: '/forgot-password',
  },
  {
    element: <ResetPassword />,
    path: '/reset-password',
  },
  {
    element: (
      <AuthGuard>
        <Verification />
      </AuthGuard>
    ),
    path: '/verify-email',
  },
  {
    children: [
      {
        element: <Organisation />,
        path: '/',
      },
      {
        element: <Dashboard />,
        path: '/dashboard',
      },
      {
        element: <ProjectDashboard />,
        path: '/projectDashboard/:projectId',
      },
      {
        element: <AccountSettings />,
        path: '/account-settings',
      },
      {
        element: <ProjectDetails />,
        path: '/project-details/:id',
      },
      {
        element: <OrganisationDetails />,
        path: '/organisation/:organisationId',
      },
      {
        children: [
          {
            element: <ProjectsList />,
            path: '/projects',
          },
          {
            element: <TaskViews />,
            path: '/tasks/:projectId',
          },
        ],
        element: <OrganisationGuard />,
        path: '/',
      },
    ],
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    path: '/',
  },
  {
    element: <Page404 />,
    path: '*',
  },
]);
