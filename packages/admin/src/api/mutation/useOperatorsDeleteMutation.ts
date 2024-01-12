import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

export type OperatorStatusApiResponse = ResponseType<null>;
function useOperatorDeleteMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OperatorStatusApiResponse>["response"],
    AxiosResponseAndError<OperatorStatusApiResponse>["error"],
    string
  >({
    mutationFn: (userId) =>
      ApiRequest.delete<OperatorStatusApiResponse>(
        requestURLs.operators + "/" + userId
      ),
  });
  return mutation;
}
export default useOperatorDeleteMutation;
