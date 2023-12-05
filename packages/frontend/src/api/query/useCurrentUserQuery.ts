import { UserResponseType } from "@/hooks/useUser";
import { AxiosResponseAndError } from "../types/axiosResponseType";
import { QUERY_KEYS } from "./querykeys";
import ApiRequest from "../ApiRequest";
import { requestURLs } from "@/Environment";
import { useQuery } from "@tanstack/react-query";

function useCurrentUserQuery() {
  return useQuery<
    AxiosResponseAndError<UserResponseType>["response"],
    AxiosResponseAndError<UserResponseType>["error"]
  >({
    queryKey: [QUERY_KEYS.currentUser],

    queryFn: async () => {
      const response = await ApiRequest.get(requestURLs.me);

      if (response.data) {
        localStorage.setItem(
          "organisation-id",
          response.data.data.userOrganisation[0].organisation.organisationId
        );
      }

      return response;
    },
    enabled: false,
  });
}

export default useCurrentUserQuery;