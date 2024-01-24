import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import { useNavigate } from "react-router-dom";

export function useUser() {
  const { setAuthUser, authUser } = useContext(AuthContext);
  const fetchingUser = useRef(false);
  const { data, refetch ,isFetching, isFetched } = useCurrentUserQuery();
  const navigate = useNavigate();
  useEffect(() => {
    if(!authUser){
      refetch();
    }
  }, [authUser]);

  useEffect(() => {
    if (isFetching) fetchingUser.current = true;
    if (isFetched && !isFetching && fetchingUser.current) {
      const user = data?.data?.data ? data.data.data : null;
      fetchingUser.current = false;
      setAuthUser(user);

      if (user && !user.isVerified) {
        navigate("/verify-email");
      }
      if (!user) {
        navigate("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, setAuthUser]);
  
  return { user: authUser };
}
