import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { useState } from "react";
import RootAuth from "./rootAuth";
import Page404 from "./rootAuth/404page";

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
    <QueryClientProvider client={queryClient}>
      {!Show && !notFound && (
        <RootAuth allow={allowRoute} notfound={setNotFound} />
      )}
      {Show && (
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      )}
      {notFound && !Show && <Page404 />}
    </QueryClientProvider>
  );
}

export default App;
