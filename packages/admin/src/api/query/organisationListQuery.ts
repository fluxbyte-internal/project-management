import { useQuery } from "@tanstack/react-query";
import { requestURLs } from "../../Environment";
import { QUERY_KEYS } from "../../api/query/querykeys";
import {
  AxiosResponseAndError,
  ResponseType,
} from "../../api/types/axiosResponseType";
import ApiRequest from "../../api/ApiRequest";
import { OrgStatusEnumValue } from "@backend/src/schemas/enums";

export type OrganisationsType = {
  organisationId: string;
  organisationName: string;
  industry: string;
  status: keyof typeof OrgStatusEnumValue;
  country: string;
  nonWorkingDays: string[];
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
  createdByUserId: string;
  updatedByUserId: string;
};
type OrganisationResponse = ResponseType<OrganisationsType[]>;


function useOrganisationsListQuery() {
  return useQuery<
    AxiosResponseAndError<OrganisationResponse>["response"],
    AxiosResponseAndError<OrganisationResponse>["error"]
  >({
    queryKey: [QUERY_KEYS.organisations],
    queryFn: async () => await ApiRequest.get(`${requestURLs.organisation}`),
    enabled: true,
  });
}

export default useOrganisationsListQuery;
