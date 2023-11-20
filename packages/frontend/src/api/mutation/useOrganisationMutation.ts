import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import axios, { AxiosError, AxiosResponse } from "axios";
import { createOrganisationSchema } from "backend/src/schemas/organisationSchema";
import { z } from "zod";

export type ResponseType<T> = {
  code: number;
  message: string;
  data: T;
};

export type ErrorResponseType = {
  code: number;
  message: string;
  errors: unknown;
};

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

export type AxiosResponseAndError<T> = {
  response: AxiosResponse<T>;
  error: AxiosError<ErrorResponseType>;
};

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
