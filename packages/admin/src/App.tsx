import { useState } from 'react'
import './App.css'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./context/AuthContext";
import RootAuth from "./rootAuth";
import Page404 from "./rootAuth/404page";
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  const [Show, setShow] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const allowRoute = (value: boolean) => {
    setShow(value);
  };
  return (
    <>
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

    </>
  )
}

export default App
