import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { changePasswordSchema } from "@backend/src/schemas/userSchema";
import ApiRequest from "../ApiRequest";
import { AxiosResponseAndError,ResponseType } from "../types/axiosResponseType";
import { z } from "zod";
import { UserType } from "../query/useCurrentUserQuery";

export type UserResponseType = ResponseType<UserType>;

function usePasswordChangeMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<UserResponseType>["response"],
    AxiosResponseAndError<UserResponseType>["error"],
    z.infer<typeof changePasswordSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<UserResponseType>(`${requestURLs.changePassword}`, data),
  });

  return mutation;
}

export default usePasswordChangeMutation;