import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/authentication/login";
import Layout from "./components/layout";
import Test from "./pages/Test";
import AuthGuard from "./guards/AuthGuard";
import Organisation from "./pages/organisation";
import Signup from "./pages/authentication/signup";

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
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: <Test />,
      },
      {
        path: "/organisation",
        element: <Organisation />,
      },
    ],
  },
]);
