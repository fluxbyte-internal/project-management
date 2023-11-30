import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import { userOrgSettingsUpdateSchema } from "@backend/src/schemas/userSchema";
import ApiRequest from "../ApiRequest";

type UseOrgSettingsUpdateResponse = ResponseType<null>;

function useOrgSettingsUpdateMutation(id: string) {
  const mutation = useMutation<
    AxiosResponseAndError<UseOrgSettingsUpdateResponse>["response"],
    AxiosResponseAndError<UseOrgSettingsUpdateResponse>["error"],
    z.infer<typeof userOrgSettingsUpdateSchema>
  >({
    mutationFn: (data) =>
      ApiRequest.put<UseOrgSettingsUpdateResponse>(
        requestURLs.updateUserOrganisationSettings + id,
        data
      ),
  });

  return mutation;
}

export default useOrgSettingsUpdateMutation;
