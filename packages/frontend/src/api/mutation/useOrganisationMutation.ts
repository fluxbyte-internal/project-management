import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import type { createOrganisationSchema } from "backend/src/schemas/organisationSchema";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

type OrganisationApiResponse = ResponseType<{
  organisationId: string;
  organisationName: string;
  industry: string;
  status: string;
  country: string;
  nonWorkingDays: number;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  createdBy: string;
  createdByUserId: string;
  updatedByUserId: string;
}>;

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
