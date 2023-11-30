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
  userOrganisation: OrganisationType[];
};
export type OrganisationType = {
  userOrganisationId: string;
  userId: string;
  organisationId: string;
  role: string;
  jobTitle: null;
  taskColour: null;
  createdAt: Date;
  updatedAt: Date;
  organisation: {
    organisationId: string;
    organisationName: string;
    industry: string;
    status: string;
    country: string;
    listOfNonWorkingDays: number;
    createdAt: Date;
    updatedAt: Date;
    tenantId: string;
    createdBy: string;
  };
};

export type UserResponseType = ResponseType<UserType>;

export function useUser() {
  const { setAuthUser, authUser } = useContext(AuthContext);
  const { token } = useAuth();
  const fetchingUser = useRef(false);
  const { data, refetch, isFetching, isFetched } = useCurrentUserQuery();

  useEffect(() => {
    if (token && !authUser) {
      refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (isFetching) fetchingUser.current = true;
    if (isFetched && !isFetching && fetchingUser.current) {
      const user = data?.data?.data ? data.data.data : null;
      fetchingUser.current = false;
      setAuthUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  return { user: authUser };
}
