import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { userStatuSchema } from "@backend/src/schemas/userSchema";

export type OperatorStatusApiResponse = ResponseType<{}>;
function useUserStatusMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<OperatorStatusApiResponse>["response"],
    AxiosResponseAndError<OperatorStatusApiResponse>["error"],
    z.infer<typeof userStatuSchema> & { userId: string } & {organisationId:string}
  >({
    mutationFn: (data) =>
    ApiRequest.put<OperatorStatusApiResponse>(
        requestURLs.user + "/status/" + data.userId,
        data
      ),
  });
  return mutation;
}
export default useUserStatusMutation;
