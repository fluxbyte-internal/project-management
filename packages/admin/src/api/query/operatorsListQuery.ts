import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "../../api/query/querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../../api/types/axiosResponseType";
import ApiRequest from "../../api/ApiRequest";
import { OperatorStatusEnumValue, UserRoleEnumValue } from "@backend/src/schemas/enums";

export type operatorDataType = {
  avatarImg: null;
  createdAt: Date;
  email: string;
  firstName: string;
  isVerified: boolean;
  lastName: string;
  role: keyof typeof UserRoleEnumValue;
  status: keyof typeof OperatorStatusEnumValue;
  updatedAt: Date;
  userId: string;
};
export type OperatorsListApiType = {
  userOrganisationId: string;
  jobTitle?: string;
  role?: keyof typeof UserRoleEnumValue;
  user: {
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarImg?: string;
  };
};
type OperatorsListApiResponse = ResponseType<operatorDataType[]>;

function useOperatorsListQuery() {
  return useQuery<
    AxiosResponseAndError<OperatorsListApiResponse>["response"],
    AxiosResponseAndError<OperatorsListApiResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.operators],
    queryFn: async () => await ApiRequest.get(`${requestURLs.operators}`),
    enabled: true,
  });
}

export default useOperatorsListQuery;
