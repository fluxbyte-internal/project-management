import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { updateOrganisationSchema } from "@backend/src/schemas/organisationSchema";
import { OrganisationResponseType } from "../query/useOrganisationDetailsQuery";


function useOrganisationUpdateMutation(id: string) {
  const mutation = useMutation<
    AxiosResponseAndError<OrganisationResponseType>["response"],
    AxiosResponseAndError<OrganisationResponseType>["error"],
    z.infer<typeof updateOrganisationSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<OrganisationResponseType>(
        `${requestURLs.organisation}/${id}`,
        data
      ),
  });

  return mutation;
}

export default useOrganisationUpdateMutation;
