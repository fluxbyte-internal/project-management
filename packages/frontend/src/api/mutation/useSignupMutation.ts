import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import axios from "axios";
import { z } from "zod";
import {
  ResponseType,
  AxiosResponseAndError,
} from "../mutation/useLoginMutation";
import { authSignUpSchema } from "@backend/src/schemas/authSchema";

type SignupResponseType = ResponseType<{
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

function useSignupMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<SignupResponseType>["response"],
    AxiosResponseAndError<SignupResponseType>["error"],
    z.infer<typeof authSignUpSchema>
  >({
    mutationFn: (data) =>
      axios.post<SignupResponseType>(requestURLs.signup, data),
  });

  return mutation;
}

export default useSignupMutation;
