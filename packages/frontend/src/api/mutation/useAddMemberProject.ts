import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { z } from "zod";
import { assginedToUserIdSchema } from "@backend/src/schemas/taskSchema";
type ProjectAddMembersResponse = ResponseType<null>;

function useProjectAddMembersMutation(projectId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<ProjectAddMembersResponse>["response"],
    AxiosResponseAndError<ProjectAddMembersResponse>["error"],
   z.infer<typeof assginedToUserIdSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<ProjectAddMembersResponse>(
        `${requestURLs.project}/add-assignee/${projectId}`,
        data
      ),
  });

  return mutation;
}

export default useProjectAddMembersMutation;
