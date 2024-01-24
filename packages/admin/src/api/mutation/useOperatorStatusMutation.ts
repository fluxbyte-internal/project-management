import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { operatorStatusSchema } from "@backend/src/schemas/consoleSchema";

export type OperatorStatusApiResponse = ResponseType<{}>;
function useOperatorStatusMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OperatorStatusApiResponse>["response"],
    AxiosResponseAndError<OperatorStatusApiResponse>["error"],
    z.infer<typeof operatorStatusSchema> & { userId: string }
  >({
    mutationFn: (data) =>
    ApiRequest.put<OperatorStatusApiResponse>(
        requestURLs.operators + "/status/" + data.userId,
        data
      ),
  });
  return mutation;
}
export default useOperatorStatusMutation;
