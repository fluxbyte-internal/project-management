import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import axios from "axios";
import type { createOrganisationSchema } from "backend/src/schemas/organisationSchema";
import { z } from "zod";
import { AxiosResponseAndError, ResponseType } from "@/api/types/axiosResponseType";

type OrganisationApiResponse = ResponseType<{
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
}>;

function useOrganisationMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OrganisationApiResponse>["response"],
    AxiosResponseAndError<OrganisationApiResponse>["error"],
    z.infer<typeof createOrganisationSchema>
  >({
    mutationFn: (data) =>
      axios.post<OrganisationApiResponse>(requestURLs.organisation, data),
  });

  return mutation;
}

export default useOrganisationMutation;
