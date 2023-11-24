import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

const AuthGuard = (props: PropsWithChildren) => {
  const token = localStorage.getItem("Token");
  const { children } = props;
  if (!token) {
    return <Navigate to="/login"></Navigate>;
  } else {
    return children;
  }
};

export default AuthGuard;
