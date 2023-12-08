import { useMutation } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { z } from "zod";
import {
  AxiosResponseAndError,
  ResponseType,
} from "@/api/types/axiosResponseType";
import { userUpdateSchema } from "@backend/src/schemas/userSchema";
import ApiRequest from "../ApiRequest";

type UserProfileUpdateResponse = ResponseType<{
  userId: string;
  email: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  timezone: string | null;
  country: string | null;
  avatarImg: string | null;
  createdAt: string;
  updatedAt: string;
}>;

function useUserProfileUpdateMutation() {
  const mutation = useMutation<
    AxiosResponseAndError<UserProfileUpdateResponse>["response"],
    AxiosResponseAndError<UserProfileUpdateResponse>["error"],
    z.infer<typeof userUpdateSchema>
  >({
    
    mutationFn: (data) =>
      ApiRequest.put<UserProfileUpdateResponse>(
        requestURLs.userUpdateProfile,
        data
      ),
  });

  return mutation;
}

export default useUserProfileUpdateMutation;
