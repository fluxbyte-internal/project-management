import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import type { updateProjectSchema } from "backend/src/schemas/projectSchema";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { Project } from "../query/useProjectQuery";

type ProjectApiResponse = ResponseType<Project>;

function useProjectMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<ProjectApiResponse>["response"],
    AxiosResponseAndError<ProjectApiResponse>["error"],
    Project,
    z.infer<typeof updateProjectSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<ProjectApiResponse>(`${requestURLs.project}/${data.projectId}`, data, {
        headers: { "organisation-id": localStorage.getItem("organisation-id") },
      }),
  });

  return mutation;
}
export default useProjectMutation;