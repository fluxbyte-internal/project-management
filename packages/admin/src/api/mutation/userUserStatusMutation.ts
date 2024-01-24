import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { userStatuSchema } from "@backend/src/schemas/userSchema";

<<<<<<< HEAD
export type OperatorStatusApiResponse = ResponseType<null>;
=======
export type OperatorStatusApiResponse = ResponseType<{}>;
>>>>>>> 8c5818bb7fd918c6cd870ad09c51bd4a32c5607d
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
