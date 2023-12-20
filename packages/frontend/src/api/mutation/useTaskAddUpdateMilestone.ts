import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { z } from "zod";
import { milestoneTaskSchema } from "@backend/src/schemas/taskSchema";
import { Task } from "./useTaskCreateMutation";

type TaskAddUpdateMilestoneResponse = ResponseType<Task>;

function useTaskAddUpdateMilestoneMutation(taskId?: string) {
  const mutation = useMutation<
    AxiosResponseAndError<TaskAddUpdateMilestoneResponse>["response"],
    AxiosResponseAndError<TaskAddUpdateMilestoneResponse>["error"],
   z.infer<typeof milestoneTaskSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<TaskAddUpdateMilestoneResponse>(
        `${requestURLs.task}milestone/${taskId}`,
        data
      ),
  });

  return mutation;
}

export default useTaskAddUpdateMilestoneMutation;
