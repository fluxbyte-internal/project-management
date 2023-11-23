import { useContext, useEffect, useRef } from "react";
import { ResponseType } from "@/api/types/axiosResponseType";
import { AuthContext } from "@/context/AuthContext";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import { useAuth } from "./useAuth";

export type UserType = {
  userId: string;
  email: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  timezone: string | null;
  country: string | null;
  avatarImg: string | null;
  createdAt: string;
  updatedAt: string;
  userOrganisation: {
    organisationId: string,
    jobTitle: string | null,
    role: string | null
  }[]
}

export type UserResponseType = ResponseType<{
  userId: string;
  email: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  timezone: string | null;
  country: string | null;
  avatarImg: string | null;
  createdAt: string;
  updatedAt: string;
  userOrganisation: {
    organisationId: string,
    jobTitle: string | null,
    role: string | null
  }[]
}>

export function useUser() {
  const { setAuthUser, authUser } = useContext(AuthContext);
  const { token } = useAuth();
  const fetchingUser = useRef(false);
  const { data, refetch, isFetching, isFetched } = useCurrentUserQuery();

  if (token && !isFetching && !isFetched) {
    refetch();
  }

  useEffect(() => {
    if (isFetching) fetchingUser.current = true;
    if (isFetched && !isFetching && fetchingUser.current) {
      const user = data?.data?.data ? data.data.data : null;
      fetchingUser.current = false;
      setAuthUser(user);
    }
  }, [isFetching]);

  return {user: authUser};
}
