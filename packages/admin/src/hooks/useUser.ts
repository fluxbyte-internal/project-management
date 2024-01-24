import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import { useAuth } from "./useAuth";

export function useUser() {
  const { setAuthUser, authUser } = useContext(AuthContext);
  const { token } = useAuth();
  const fetchingUser = useRef(false);
  const { data, refetch, isFetching, isFetched } = useCurrentUserQuery();
  useEffect(() => {
    if (token && !authUser) {
      refetch();
    }
  }, [token]);

  useEffect(() => {
    if (isFetching) fetchingUser.current = true;
    if (isFetched && !isFetching && fetchingUser.current) {
      const user = data?.data?.data ? data.data.data : null;
      fetchingUser.current = false;
      setAuthUser(user);
    }
  }, [isFetching]);

  return { user: authUser };
}
