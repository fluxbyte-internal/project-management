import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
<<<<<<< HEAD
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
=======
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
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d

  useEffect(() => {
    if (isFetching) fetchingUser.current = true;
    if (isFetched && !isFetching && fetchingUser.current) {
      const user = data?.data?.data ? data.data.data : null;
      fetchingUser.current = false;
      setAuthUser(user);
<<<<<<< HEAD

      if (user && !user.isVerified) {
        navigate("/verify-email");
      }
      if (!user) {
        navigate("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, setAuthUser]);
  
=======
    }
  }, [isFetching]);

>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
  return { user: authUser };
}
