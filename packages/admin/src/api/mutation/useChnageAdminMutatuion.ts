import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { changeAdministatorSchema } from "@backend/src/schemas/consoleSchema";

export type OperatorStatusApiResponse = ResponseType<null>;
function useAdminRoleUpdateMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OperatorStatusApiResponse>["response"],
    AxiosResponseAndError<OperatorStatusApiResponse>["error"],
    z.infer<typeof changeAdministatorSchema> 
  >({
    mutationFn: (data) =>
    ApiRequest.put<OperatorStatusApiResponse>(
        requestURLs.organisation + "/administrator-change/",
        data
      ),
  });
  return mutation;
}
export default useAdminRoleUpdateMutation;
