import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { changeOrganisationMemberRoleSchema } from "@backend/src/schemas/consoleSchema";

export type OperatorStatusApiResponse = ResponseType<null>;
function useUserRoleUpdateMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OperatorStatusApiResponse>["response"],
    AxiosResponseAndError<OperatorStatusApiResponse>["error"],
    z.infer<typeof changeOrganisationMemberRoleSchema> & { organisationId: string }
  >({
    mutationFn: (data) =>
    ApiRequest.put<OperatorStatusApiResponse>(
        requestURLs.user + "/role/" + data.organisationId,
        data
      ),
  });
  return mutation;
}
export default useUserRoleUpdateMutation;
