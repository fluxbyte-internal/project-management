import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import { userUpdateSchema } from "@backend/src/schemas/userSchema";
import ApiRequest from "../ApiRequest";
type consoleUserProfileUpdateResponse = ResponseType<{
  userId: string;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}>;
function useConsoleUserProfileUpdateMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<consoleUserProfileUpdateResponse>["response"],
    AxiosResponseAndError<consoleUserProfileUpdateResponse>["error"],
    z.infer<typeof userUpdateSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<consoleUserProfileUpdateResponse>(
        requestURLs.operators,
        data
      ),
  });
  return mutation;
}
export default useConsoleUserProfileUpdateMutation;
