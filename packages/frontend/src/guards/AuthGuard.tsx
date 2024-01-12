import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import Loader from "@/components/common/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { PropsWithChildren } from "react";

const AuthGuard = (props: PropsWithChildren) => {
  const { logout } = useAuth();
  const { user } = useUser();
  const { error } = useCurrentUserQuery();
  const { children } = props;
  if (!user) {
    if (error) {
      logout();
      return "Invalid session";
    }
    return  <Loader/>;
  }
  return children;
};

export default AuthGuard;
