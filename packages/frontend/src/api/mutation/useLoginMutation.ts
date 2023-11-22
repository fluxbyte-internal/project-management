import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import axios, { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
import { authLoginSchema } from "@backend/src/schemas/authSchema";

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

type LoginApiResponse = ResponseType<{
  token: string;
  user: {
    userId: string;
    email: string;
    status: string;
    firstName: string | null;
    lastName: string | null;
    timezone: string | null;
    country: string | null;
    avatarImg: string | null;
    createdAt: string;
    updatedAt: string;
  };
}>;

export type AxiosResponseAndError<T> = {
  response: AxiosResponse<T>;
  error: AxiosError<ErrorResponseType>;
};

function useLoginMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<LoginApiResponse>["response"],
    AxiosResponseAndError<LoginApiResponse>["error"],
    z.infer<typeof authLoginSchema>
  >({
    mutationFn: (data) => axios.post<LoginApiResponse>(requestURLs.login, data),
  });

  return mutation;
}

export default useLoginMutation;
