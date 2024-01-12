import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import ApiRequest from "../ApiRequest";
import { AxiosResponseAndError,ResponseType } from "../types/axiosResponseType";
import { z } from "zod";
import { UserType } from "../query/useCurrentUserQuery";
import { consolePasswordSchema } from "@backend/src/schemas/consoleSchema";

export type UserResponseType = ResponseType<UserType>;

function usePasswordChangeMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<UserResponseType>["response"],
    AxiosResponseAndError<UserResponseType>["error"],
    z.infer<typeof consolePasswordSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<UserResponseType>(`${requestURLs.changePassword}`, data),
  });

  return mutation;
}

export default usePasswordChangeMutation;