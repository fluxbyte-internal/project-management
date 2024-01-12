import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { AxiosResponseAndError } from "@/api/types/axiosResponseType";
import { UserResponseType } from "../query/useCurrentUserQuery";
import ApiRequest from "../ApiRequest";

function useFileUploadMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<UserResponseType>["response"],
    AxiosResponseAndError<UserResponseType>["error"],
    FormData
  >({
    mutationFn: (data) =>
      ApiRequest.put<UserResponseType>(requestURLs.fileUpload, data),
  });

  return mutation;
}
export default useFileUploadMutation;
