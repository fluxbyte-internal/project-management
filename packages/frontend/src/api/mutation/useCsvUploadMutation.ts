import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";

type TaskAttechmentAddResponse = ResponseType<null>;

function useCsvUploadMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<TaskAttechmentAddResponse>["response"],
    AxiosResponseAndError<TaskAttechmentAddResponse>["error"],
    FormData
  >({
    mutationFn: (data) =>
      ApiRequest.put<TaskAttechmentAddResponse>(
        `${requestURLs.organisation}/holiday-csv/${localStorage.getItem("organisation-id")}`,
        data
      ),
  });

  return mutation;
}

export default useCsvUploadMutation;
