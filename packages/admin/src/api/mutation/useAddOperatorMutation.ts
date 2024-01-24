import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
} from "@/api/types/axiosResponseType";
import ApiRequest from "../ApiRequest";
import { operatorSchema } from "@backend/src/schemas/consoleSchema";

type AddOperatorType = {
    message: string;
    email: string
};

function useAddOperatorMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<AddOperatorType>["response"],
    AxiosResponseAndError<AddOperatorType>["error"],
    z.infer<typeof operatorSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.post<AddOperatorType>(`${requestURLs.operators}`, data),
  });

  return mutation;
}



export default useAddOperatorMutation;
