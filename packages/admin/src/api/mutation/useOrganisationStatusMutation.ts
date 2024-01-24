import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import { organisationStatuSchema } from "@backend/src/schemas/organisationSchema";
import ApiRequest from "../ApiRequest";

export type OrganisationStatusApiResponse = ResponseType<null>;
function useOrganisationStatusMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OrganisationStatusApiResponse>["response"],
    AxiosResponseAndError<OrganisationStatusApiResponse>["error"],
    z.infer<typeof organisationStatuSchema> & { OrganisationId: string }
  >({
    mutationFn: (data) =>
    ApiRequest.put<OrganisationStatusApiResponse>(
        requestURLs.organisationStatus + "/" + data.OrganisationId,
        data
      ),
  });
  return mutation;
}
export default useOrganisationStatusMutation;
