import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import { AxiosResponseAndError, ResponseType } from "@/api/types/axiosResponseType";
import { authLoginSchema } from "@backend/src/schemas/authSchema";
import ApiRequest from "../ApiRequest";


export type LoginApiResponse = ResponseType<{
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


function useLoginMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<LoginApiResponse>["response"],
    AxiosResponseAndError<LoginApiResponse>["error"],
    z.infer<typeof authLoginSchema>
  >({
    mutationFn: (data) => ApiRequest.post<LoginApiResponse>(requestURLs.login, data),
  });

  return mutation;
}

export default useLoginMutation;
