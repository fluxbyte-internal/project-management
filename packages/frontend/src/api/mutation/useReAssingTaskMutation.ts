import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { reAssginedTaskSchema } from "@backend/src/schemas/organisationSchema";

type ReAssgingTaskApiResponse = ResponseType<null>;

function useReAssgingTaskMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ReAssgingTaskApiResponse>["response"],
    AxiosResponseAndError<ReAssgingTaskApiResponse>["error"],
    z.infer<typeof reAssginedTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<ReAssgingTaskApiResponse>(`${requestURLs.organisation}/re-assigned-task`, data, {
        headers: { "organisation-id": localStorage.getItem("organisation-id") },
      }),
  });

  return mutation;
}
export default useReAssgingTaskMutation;