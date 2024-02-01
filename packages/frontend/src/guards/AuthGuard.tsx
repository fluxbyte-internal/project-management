import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import Loader from "@/components/common/Loader";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { PropsWithChildren } from "react";

const AuthGuard = (props: PropsWithChildren) => {
  const { user } = useUser();
  const { logout } = useAuth();
  const { error ,isSuccess ,isFetched } = useCurrentUserQuery();
  const { children } = props;

  if (!user && isFetched && isSuccess) {
    if (error) {
      logout();
      return "Invalid session";
    }
    return  <Loader/>;
  }
  return children;
};

export default AuthGuard;