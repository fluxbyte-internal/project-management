import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import type { addOrganisationMemberSchema } from "backend/src/schemas/organisationSchema";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

type OrgAddMemberResponseType = ResponseType<null>;

function useUpdateOrganisationMemberMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OrgAddMemberResponseType>["response"],
    AxiosResponseAndError<OrgAddMemberResponseType>["error"],
    z.infer<typeof addOrganisationMemberSchema> & {userId:string|undefined}
  >({
    mutationFn: (data) =>
      ApiRequest.put<OrgAddMemberResponseType>(
        `${requestURLs.organisation}/change-role/${data.userId}`,
        data
      ),
  });

  return mutation;
}

export default useUpdateOrganisationMemberMutation;
