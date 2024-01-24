import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
<<<<<<< HEAD
import { z } from "zod";
import { AxiosResponseAndError, ResponseType } from "@/api/types/axiosResponseType";
import { authLoginSchema } from "@backend/src/schemas/authSchema";
import ApiRequest from "../ApiRequest";
=======
import axios from "axios";
import { z } from "zod";
import { AxiosResponseAndError, ResponseType } from "@/api/types/axiosResponseType";
import { authLoginSchema } from "@backend/src/schemas/authSchema";
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d


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
<<<<<<< HEAD
    mutationFn: (data) => ApiRequest.post<LoginApiResponse>(requestURLs.login, data),
=======
    mutationFn: (data) => axios.post<LoginApiResponse>(requestURLs.login, data),
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
  });

  return mutation;
}

export default useLoginMutation;
