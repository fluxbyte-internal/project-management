import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { useState } from "react";
import RootAuth from "./rootAuth";
import Page404 from "./rootAuth/404page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CookiesProvider } from "react-cookie";
import { googleCredentialsClientId } from "./Environment";
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const [Show, setShow] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const allowRoute = (value: boolean) => {
    setShow(value);
  };
  return (
    <CookiesProvider>
      <GoogleOAuthProvider clientId={googleCredentialsClientId}>
        <QueryClientProvider client={queryClient}>
          {!Show && !notFound && (
            <RootAuth allow={allowRoute} notfound={setNotFound} />
          )}
          {Show && (
            <AuthProvider>
              <RouterProvider router={router} />
              <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover={false}
                draggable={true}
                theme="light"
              />
            </AuthProvider>
          )}
          {notFound && !Show && <Page404 />}
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </CookiesProvider>
  );
}

export default App;
