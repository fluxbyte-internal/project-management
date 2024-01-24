import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { blockAndReassignAdministatorSchema } from "@backend/src/schemas/consoleSchema";

export type OperatorStatusApiResponse = ResponseType<{}>;
function useAssignAdministratorMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OperatorStatusApiResponse>["response"],
    AxiosResponseAndError<OperatorStatusApiResponse>["error"],
    z.infer<typeof blockAndReassignAdministatorSchema>
  >({
    mutationFn: (data) =>
    ApiRequest.put<OperatorStatusApiResponse>(
        requestURLs.organisation + "/block-reassigned",
        data
      ),
  });
  return mutation;
}
export default useAssignAdministratorMutation;
