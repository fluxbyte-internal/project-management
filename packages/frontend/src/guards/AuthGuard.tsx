import { useUser } from "@/hooks/useUser";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

const AuthGuard = (props: PropsWithChildren) => {
  const token = localStorage.getItem("Token");
  const { user } = useUser();
  const { children } = props;
  if (!token) {
    return <Navigate to="/login"></Navigate>;
  } else if (!user) {
    return null;
  } else {
    return children;
  }
};

export default AuthGuard;
