import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
<<<<<<< HEAD
import { organisationStatuSchema } from "@backend/src/schemas/organisationSchema";
import ApiRequest from "../ApiRequest";

export type OrganisationStatusApiResponse = ResponseType<null>;
=======
import { organisationStatusSchema } from "@backend/src/schemas/organisationSchema";
import ApiRequest from "../ApiRequest";

export type OrganisationStatusApiResponse = ResponseType<{}>;
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
function useOrganisationStatusMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OrganisationStatusApiResponse>["response"],
    AxiosResponseAndError<OrganisationStatusApiResponse>["error"],
<<<<<<< HEAD
    z.infer<typeof organisationStatuSchema> & { OrganisationId: string }
=======
    z.infer<typeof organisationStatusSchema> & { OrganisationId: string }
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
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
