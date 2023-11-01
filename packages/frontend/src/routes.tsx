import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import Layout from "./components/layout";
import Test from "./pages/Test";
import AuthGuard from "./guards/AuthGuard";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
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
    ],
  },
]);
