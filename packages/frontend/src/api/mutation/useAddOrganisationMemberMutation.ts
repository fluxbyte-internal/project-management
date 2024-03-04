import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import type { addOrganisationMemberSchema } from "backend/src/schemas/organisationSchema";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { UserType } from "../query/useCurrentUserQuery";

type OrgAddMemberResponseType = ResponseType<UserType>;

function useAddOrganisationMemberMutation(organisationId: string) {
  const mutation = useMutation<
    AxiosResponseAndError<OrgAddMemberResponseType>["response"],
    AxiosResponseAndError<OrgAddMemberResponseType>["error"],
    z.infer<typeof addOrganisationMemberSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<OrgAddMemberResponseType>(`${requestURLs.organisation}/${organisationId}/user`, data),
  });

  return mutation;
}

export default useAddOrganisationMemberMutation;
