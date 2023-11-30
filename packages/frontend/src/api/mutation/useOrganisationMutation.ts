import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import type { OrgListOfNonWorkingDaysEnum, createOrganisationSchema } from "backend/src/schemas/organisationSchema";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

export type OrganisationType = {
  organisationId: string;
  organisationName: string;
  industry: string;
  status: string;
  country: string;
  nonWorkingDays: OrgListOfNonWorkingDaysEnum[];
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  createdByUserId: string;
  updatedByUserId?: string;
}
type OrganisationApiResponse = ResponseType<OrganisationType>;

function useOrganisationMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OrganisationApiResponse>["response"],
    AxiosResponseAndError<OrganisationApiResponse>["error"],
    z.infer<typeof createOrganisationSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<OrganisationApiResponse>(requestURLs.organisation, data),
  });

  return mutation;
}

export default useOrganisationMutation;
