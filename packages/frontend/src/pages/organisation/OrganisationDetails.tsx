import { useParams } from "react-router-dom";
import UserAvatar from "@/components/ui/userAvatar";
import { Button } from "@/components/ui/button";
import { UserRoleEnumValue } from "@backend/src/schemas/enums";
import ErrorMessage from "@/components/common/ErrorMessage";
import Dialog from "@/components/common/Dialog";
import { SingleValue } from "react-select";
import { useEffect, useState } from "react";
import FormLabel from "@/components/common/FormLabel";
import InputEmail from "@/components/common/InputEmail";
import InputSelect from "@/components/common/InputSelect";
import useOrganisationDetailsQuery from "@/api/query/useOrganisationDetailsQuery";
import Loader from "@/components/common/Loader";
import CrossIcon from "../../assets/svg/CrossIcon.svg";
import { useFormik } from "formik";
import { z } from "zod";
import { addOrganisationMemberSchema } from "@backend/src/schemas/organisationSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { isAxiosError } from "axios";
import useAddOrganisationMemberMutation from "@/api/mutation/useAddOrganisationMemberMutation";
import { useUser } from "@/hooks/useUser";
import InputText from "@/components/common/InputText";
import useDebounce from "@/hooks/useDebounce";
// import Setting from "../../assets/svg/Setting.svg";
import OrganisationForm from "./organisationForm";
import { OrganisationType } from "@/api/mutation/useOrganisationMutation";
import { toast } from "react-toastify";
import OrganisationNoPopUpForm from "./organisationForm/organisationNoPopupForm";
const memberRoleOptions = [
  {
    value: UserRoleEnumValue.PROJECT_MANAGER,
    label: "Project Manager",
  },
  {
    value: UserRoleEnumValue.TEAM_MEMBER,
    label: "Team member",
  },
];

function OrganisationDetails() {
  const organisationId = useParams().organisationId!;
  const addOrganisationMemberMutation =
    useAddOrganisationMemberMutation(organisationId);

  const addOrgMemberForm = useFormik<
    z.infer<typeof addOrganisationMemberSchema>
  >({
    initialValues: {
      email: "",
      role: "TEAM_MEMBER",
    },
    validationSchema: toFormikValidationSchema(addOrganisationMemberSchema),
    onSubmit: (values, helper) => {
      setIsAddOrgMemberSubmitting(true);
      addOrganisationMemberMutation.mutate(values, {
        onSuccess(data) {
          toast.success(data.data.message);
          setIsAddOrgMemberSubmitting(false);
          closeAddMember();
          refetch();
        },
        onError(error) {
          if (isAxiosError(error)) {
            if (
              error.response?.status === 400 &&
              error.response.data?.errors &&
              Array.isArray(error.response?.data.errors)
            ) {
              error.response.data.errors.forEach((item) => {
                helper.setFieldError(item.path[0], item.message);
              });
            }
            if (!Array.isArray(error.response?.data.errors)) {
              toast.error(
                error.response?.data?.message ?? "An unexpected error occurred."
              );
            }
          }
          setIsAddOrgMemberSubmitting(false);
        },
      });
    },
  });
  const { data, isLoading, status, refetch } =
    useOrganisationDetailsQuery(organisationId);
  const organisation = data?.data.data;
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [filterString, setFilterString] = useDebounce("", 400);
  const [isAddOrgMemberSubmitting, setIsAddOrgMemberSubmitting] =
    useState(false);
  const [selectedRole, setSelectedRole] =
    useState<SingleValue<(typeof memberRoleOptions)[number]>>(null);

  const [filteredOrganisationUsers, setFilteredOrganisationUsers] = useState(
    organisation?.userOrganisation ?? []
  );
  const [organisationForm, setOrganisationForm] = useState(false);
  const [editData, setEditData] = useState<OrganisationType>();

  const closeAddMember = () => {
    addOrgMemberForm.setValues({
      email: "",
      role: "TEAM_MEMBER",
    });
    setIsOpen(false);
  };

  useEffect(() => {
    setSelectedRole(
      () => memberRoleOptions.find((m) => m.value === "TEAM_MEMBER")!
    );
    addOrgMemberForm.setValues({
      email: "",
      role: "TEAM_MEMBER",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!organisation?.userOrganisation) return;
    if (filterString) {
      const stringToFilter = filterString.toLowerCase();
      setFilteredOrganisationUsers(
        organisation.userOrganisation.filter((o) => {
          return (
            String(o.user.firstName).toLowerCase().includes(stringToFilter) ||
            String(o.user.lastName).toLowerCase().includes(stringToFilter) ||
            String(o.user.email).toLowerCase().includes(stringToFilter)
          );
        })
      );
    } else {
      setFilteredOrganisationUsers(organisation.userOrganisation);
    }
    if (organisation) {
      setEditData({
        country: organisation.country,
        industry: organisation.industry,
        organisationId: organisation.organisationId,
        nonWorkingDays: organisation.nonWorkingDays,
        status: organisation.status,
        organisationName: data?.data.data.organisationName,
        tenantId: organisation.tenantId,
        createdByUserId: organisation.createdBy,
        createdAt: organisation.createdAt,
        updatedAt: organisation.updatedAt,
      });
    }
  }, [filterString, organisation?.userOrganisation,organisation]);

  if (isLoading) return <Loader />;
  if (status === "error" || !organisation)
    return (
      <div className="text-red-500 text-lg text-center">
        Organisation with id "{organisationId}" not found
      </div>
    );

  const currentUserIsAdmin =
    user?.userOrganisation.find((org) => org.organisationId === organisationId)
      ?.role === "ADMINISTRATOR";
  // const organisationFormOpen = () => {
  //   if (organisation) {
  //     setEditData({
  //       country: organisation.country,
  //       industry: organisation.industry,
  //       organisationId: organisation.organisationId,
  //       nonWorkingDays: organisation.nonWorkingDays,
  //       status: organisation.status,
  //       organisationName: data?.data.data.organisationName,
  //       tenantId: organisation.tenantId,
  //       createdByUserId: organisation.createdBy,
  //       createdAt:organisation.createdAt,
  //       updatedAt:organisation.updatedAt,
  //     });
  //   }
  //   setOrganisationForm(true);
  // };
  const organisationFormClose = () => {
    setEditData(undefined);
    refetch();
    setOrganisationForm(false);
  };
  return (
    <>
      <div className="overflow-auto w-full">
        <div className="max-w-5xl mx-auto p-4 pb-5">
          <div className="flex justify-between items-center">
            <div className="text-4xl my-2">{organisation.organisationName}</div>
            {/* <div>
              <Button
                onClick={organisationFormOpen}
                variant={"outline"}
              >
                <img src={Setting} />
              </Button>
            </div> */}
          </div>
          <div>
            {data&& <OrganisationNoPopUpForm
              editData={editData}
              viewOnly={currentUserIsAdmin ? false : true}
              refetch ={refetch}
            />}
          </div>
          <div className="text-2xl mt-5 mb-3">Members</div>
          <div className="border rounded-lg min-h-[300px]">
            <div className="flex justify-between items-center px-2 py-1.5 sm:px-5 sm:py-4 flex-wrap gap-1.5">
              <InputText
                name="search filter"
                id="search-filter"
                placeholder="Filter by name or email"
                className="mt-0 h-auto sm:w-fit max-w-full"
                onChange={(event) => setFilterString(event.target.value)}
              />
              {currentUserIsAdmin && (
                <Button
                  onClick={() => setIsOpen(true)}
                  variant={"primary_outline"}
                  className="ml-auto h-auto"
                >
                  Add member
                </Button>
              )}
            </div>
            <div key={"filteredOrganisationUsers"}>
              {filteredOrganisationUsers.map((userOrg) => (
                <>
                  <div
                    key={userOrg.userOrganisationId}
                    className="flex flex-wrap md:flex-nowrap items-center px-2 py-1.5 sm:px-5 sm:py-3 gap-2"
                  >
                    <div className="flex w-full sm:w-auto gap-2 items-center grow">
                      <UserAvatar user={userOrg.user}></UserAvatar>
                      <div className="text-sm">
                        <div className="text-slate-800 font-medium">
                          {userOrg.user.firstName ?? ""}{" "}
                          {userOrg.user.lastName ?? ""}
                        </div>
                        <div className="text-gray-400">
                          {userOrg.user.email}
                        </div>
                      </div>
                    </div>
                    <div className="capitalize text-gray-700 text-sm">
                      {userOrg.role?.toLowerCase().replaceAll("_", " ")}
                    </div>
                    {currentUserIsAdmin && (
                      <Button
                        variant="primary_outline"
                        disabled={userOrg.role === "ADMINISTRATOR"}
                        className="ml-auto text-danger border-danger hover:bg-danger hover:bg-opacity-10 hover:text-danger py-1.5 h-auto"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <hr className="h-px w-[98%] my-8 mx-auto bg-gray-200 border-0 " />
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
      {currentUserIsAdmin && (
        <Dialog
          isOpen={isOpen}
          onClose={() => closeAddMember()}
          hasEscClose={true}
          modalClass="sm:rounded-lg p-4 h-full md:h-auto w-full max-w-md"
        >
          <div>
            <div className="text-xl">Add member</div>
            <Button
              onClick={() => closeAddMember()}
              variant={"ghost"}
              size={"icon"}
              className="absolute top-1 right-1"
            >
              <img src={CrossIcon}></img>
            </Button>
            <form onSubmit={addOrgMemberForm.handleSubmit}>
              <div>
                <FormLabel htmlFor="email">Member Email</FormLabel>
                <InputEmail
                  name="email"
                  id="email"
                  placeholder="Enter member email"
                  value={addOrgMemberForm.values.email}
                  onChange={addOrgMemberForm.handleChange}
                />
                <ErrorMessage>
                  {addOrgMemberForm.touched.email &&
                    addOrgMemberForm.errors.email}
                </ErrorMessage>
              </div>
              <div>
                <FormLabel htmlFor="role">Role</FormLabel>
                <InputSelect
                  onChange={(val) => {
                    if (val) {
                      const selectedRole =
                        val as (typeof memberRoleOptions)[number];
                      const selectedRoleValue = selectedRole?.value;
                      setSelectedRole(selectedRole);
                      addOrgMemberForm.setFieldValue("role", selectedRoleValue);
                    }
                  }}
                  onBlur={addOrgMemberForm.handleBlur}
                  options={memberRoleOptions}
                  value={selectedRole}
                  placeholder="Select role"
                  name="role"
                  id="role"
                />
                <ErrorMessage>
                  {addOrgMemberForm.touched.role &&
                    addOrgMemberForm.errors.role}
                </ErrorMessage>
              </div>
              <div className="text-right">
                <Button
                  variant={"primary"}
                  type="submit"
                  isLoading={isAddOrgMemberSubmitting}
                  disabled={isAddOrgMemberSubmitting}
                >
                  Add
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
      {organisationForm && (
        <OrganisationForm editData={editData} close={organisationFormClose} />
      )}
    </>
  );
}

export default OrganisationDetails;
