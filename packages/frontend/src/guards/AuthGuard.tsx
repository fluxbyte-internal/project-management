import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import Spinner from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router";

const AuthGuard = (props: PropsWithChildren) => {
  const { token, logout } = useAuth();
  const { user } = useUser();
  const { error } = useCurrentUserQuery();
  const { children } = props;
  if (!token) return <Navigate to="/login"></Navigate>;
  if (!user) {
    if (error) {
      logout();
      return "Invalid session";
    }
    return <Spinner className="mx-auto" />;
  }
  return children;
};

export default AuthGuard;
