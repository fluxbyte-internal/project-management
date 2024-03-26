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
import useOrganisationDetailsQuery, {
  UserOrganisationType,
} from "@/api/query/useOrganisationDetailsQuery";
import Loader from "@/components/common/Loader";
import CrossIcon from "../../assets/svg/CrossIcon.svg";
import { useFormik } from "formik";
import { z } from "zod";
import {
  addOrganisationMemberSchema,
  memberRoleSchema,
  reAssginedTaskSchema,
} from "@backend/src/schemas/organisationSchema";
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
import TrashCan from "../../assets/svg/TrashCan.svg";
import useOrganisationRemoveMemberMutation from "@/api/mutation/useOrganisationRemoveMemberMutation";
import useUpdateOrganisationMemberMutation from "@/api/mutation/useUpdateOrganisationMemberMutation";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import useReAssignTaskMutation from "@/api/mutation/useReAssingTaskMutation";
import useResendInvitationMutation from "@/api/mutation/useResendUserInvitaionMutation";
import MailResendIcon from "@/assets/svg/mailResendIcon.svg";
import SendIcon from "@/assets/svg/sendIcon.svg";
import useProjectQuery from "@/api/query/useProjectQuery";
import Select from "react-select";
import useProjectAddMembersMutation from "@/api/mutation/useAddMemberProject";
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
  const [editData, setEditData] = useState<OrganisationType>();
  const [UpdateData, setUpdateData] = useState<
    UserOrganisationType | undefined
  >();
  const [isAddOrgMemberSubmitting, setIsAddOrgMemberSubmitting] =
    useState(false);
  const organisationId = useParams().organisationId!;
  const addOrganisationMemberMutation =
    useAddOrganisationMemberMutation(organisationId);
  const removeOrganisationMemberMutation =
    useOrganisationRemoveMemberMutation();
  const updateOrganisationMemberMutation =
    useUpdateOrganisationMemberMutation();
  const [reAssing, setReAssign] = useState(false);
  const [reAssingUser, setReAssignUser] = useState<
    z.infer<typeof reAssginedTaskSchema> & { organisationUserId?: string }
  >();

  const reAssgingTaskMutation = useReAssignTaskMutation();

  const addOrgMemberForm = useFormik<
    z.infer<typeof addOrganisationMemberSchema>
  >({
    initialValues: {
      email: UpdateData?.user.email ?? "",
      role: UpdateData?.role ?? UserRoleEnumValue.TEAM_MEMBER,
    },
    validationSchema: UpdateData
      ? toFormikValidationSchema(memberRoleSchema)
      : toFormikValidationSchema(addOrganisationMemberSchema),
    onSubmit: (values, helper) => {
      if (UpdateData && UpdateData.user.userId) {
        updateOrganisationMemberMutation.mutate(
          { ...values, userId: UpdateData?.userOrganisationId },
          {
            onSuccess(data) {
              refetch();
              setIsAddOrgMemberSubmitting(false);
              closeAddMember();
              toast.success(data.data.message);
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
                    error.response?.data?.message ??
                      "An unexpected error occurred."
                  );
                }
              }
              setIsAddOrgMemberSubmitting(false);
            },
          }
        );
      } else {
        setIsAddOrgMemberSubmitting(true);
        addOrganisationMemberMutation.mutate(values, {
          onSuccess(data) {
            toast.success(data.data.message);
            setIsAddOrgMemberSubmitting(false);
            closeAddMember();
            refetch();
            assingUser(data.data.data.userId);
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
                  error.response?.data?.message ??
                    "An unexpected error occurred."
                );
              }
            }
            setIsAddOrgMemberSubmitting(false);
          },
        });
      }
    },
  });
  const { data, isLoading, status, refetch } =
    useOrganisationDetailsQuery(organisationId);
  const organisation = data?.data.data;
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState(false);
  const [filterString, setFilterString] = useDebounce("", 400);
  const [selectedRole, setSelectedRole] =
    useState<SingleValue<(typeof memberRoleOptions)[number]>>(null);

  const [filteredOrganisationUsers, setFilteredOrganisationUsers] = useState(
    organisation?.userOrganisation ?? []
  );
  const [organisationForm, setOrganisationForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const resendInvitationMutation = useResendInvitationMutation();
  const projectQuery = useProjectQuery();
  const [project, setProject] = useState("");
  const projectAddMembersMutation = useProjectAddMembersMutation(project);

  const closeAddMember = () => {
    addOrgMemberForm.setValues({
      email: UpdateData?.user.email ?? "",
      role: UpdateData?.role ?? UserRoleEnumValue.TEAM_MEMBER,
    });
    setIsOpen(false);
    setUpdateData(undefined);
  };

  useEffect(() => {
    addOrgMemberForm.setValues({
      email: UpdateData?.user.email ?? "",
      role: UpdateData?.role ?? UserRoleEnumValue.TEAM_MEMBER,
    });

    const defaultRole = memberRoleOptions.find(
      (m) => m.value === UpdateData?.role
    );

    if (defaultRole) {
      setSelectedRole(defaultRole);
    }
  }, [UpdateData]);

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
        holidayCsvUrl:organisation.holidayCsvUrl,
        jobTitlesOfOrg:organisation.jobTitlesOfOrg
      });
    }
  }, [filterString, organisation?.userOrganisation, organisation]);

  if (isLoading) return <Loader />;
  if (status === "error" || !organisation)
    return (
      <div className="text-red-500 text-lg text-center">
        Organisation with id "{organisationId}" not found
      </div>
    );

  const currentUserIsAdmin =
    user?.userOrganisation.find((org) => org.organisationId === organisationId)
      ?.role === UserRoleEnumValue.ADMINISTRATOR;
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
  const handleRemoveMember = (id: string) => {
    removeOrganisationMemberMutation.mutate(id, {
      onSuccess(data) {
        setShowConfirmDelete("");
        refetch();
        toast.success(data.data.message);
        setReAssignUser(undefined);
      },
      onError(error) {
        toast.error(error.response?.data.message);
        if (
          error.response?.data.message ==
          "Pending tasks is already exists for this user!" ||  error.response?.data.message ==
          "Pending projects is already exists for this user!"
        ) {
          setReAssign(true);
          setShowConfirmDelete("");
        }
      },
    });
  };

  const handleReAssign = () => {
    if (reAssingUser) {
      reAssgingTaskMutation.mutate(reAssingUser, {
        onSuccess(data) {
          if (reAssingUser.organisationUserId) {
            handleRemoveMember(reAssingUser.organisationUserId);
          }
          toast.success(data.data.message);
          setReAssignUser(undefined);
          setReAssign(false);
        },
        onError(error) {
          toast.error(error.message);
        },
      });
    }
  };
  const resend = (id: string) => {
    resendInvitationMutation.mutate(
      { id: id },
      {
        onSuccess(data) {
          toast.success(data.data.message);
          setResendEmail("");
        },
        onError(error) {
          toast.error(error.message);
        },
      }
    );
  };
  const projectOption = () => {
    const options = projectQuery.data?.data.data.map((d) => {
      return { label: d.projectName, value: d.projectId };
    });
    return [{ label: "select", value: "" }, ...(options ?? [])];
  };
  const assingUser = (userId: string) => {
    if (userId) {
      projectAddMembersMutation.mutate(
        { assginedToUserId: userId },
        {
          onSuccess(data) {
            toast.success(data.data.message);
          },
          onError(error) {
            toast.error(error.response?.data.message);
          },
        }
      );
    }
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
            {data && (
              <OrganisationNoPopUpForm
                editData={editData}
                viewOnly={currentUserIsAdmin ? false : true}
                refetch={refetch}
              />
            )}
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
                    <div
                      className={`flex w-full sm:w-auto gap-2 items-center grow ${
                        userOrg.role !==  UserRoleEnumValue.ADMINISTRATOR ? "cursor-pointer" : ""
                      }`}
                      onClick={() => {
                        if (userOrg.role !==  UserRoleEnumValue.ADMINISTRATOR) {
                          setUpdateData(userOrg),
                          setIsOpen(true),
                          setReAssignUser((prev) => ({
                            oldUserId: userOrg.user.userId ?? "",
                            newUserId: prev?.newUserId ?? "",
                            organisationUserId:
                                prev?.organisationUserId ?? "",
                          }));
                        }
                      }}
                    >
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
                      <div className=" h-full">
                        {userOrg.user.firstName
                          ? userOrg.user.lastName
                            ? `${userOrg.user.firstName.charAt(
                                0
                              )}${userOrg.user.lastName.charAt(
                                0
                              )}`.toUpperCase()
                            : `${userOrg.user.firstName.charAt(
                                0
                              )}${userOrg.user.firstName.charAt(
                                1
                              )}`.toUpperCase()
                          : `${userOrg.user.email.charAt(
                              0
                            )}${userOrg.user.email.charAt(1)}`.toUpperCase()}
                      </div>
                      <div className="capitalize text-gray-700 ml-10 text-sm">
                        {userOrg.jobTitle}
                      </div>
                    </div>
                    <div className="capitalize text-gray-700 text-sm">
                      {userOrg.role?.toLowerCase().replaceAll("_", " ")}
                    </div>
                    {currentUserIsAdmin && (
                      <div className="flex gap-3">
                        <Button
                          variant="primary_outline"
                          disabled={userOrg.role ===  UserRoleEnumValue.ADMINISTRATOR}
                          className="ml-auto text-danger border-danger hover:bg-danger hover:bg-opacity-10 hover:text-danger py-1.5 h-auto"
                          onClick={() => {
                            setReAssignUser((prev) => ({
                              oldUserId: userOrg.user.userId,
                              newUserId: prev?.newUserId ?? "",
                              organisationUserId: userOrg.userOrganisationId,
                            }));
                            setShowConfirmDelete(userOrg.userOrganisationId);
                          }}
                        >
                          Remove
                        </Button>
                        {!userOrg.user.isVerified && (
                          <Button
                            variant="primary_outline"
                            disabled={userOrg.role ===  UserRoleEnumValue.ADMINISTRATOR}
                            className="ml-auto text-danger border-danger hover:bg-danger hover:bg-opacity-10 hover:text-danger py-1.5 h-auto"
                            onClick={() => {
                              setResendEmail(userOrg.userOrganisationId);
                            }}
                          >
                            Resend email
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <hr className="h-px w-[98%] my-8 mx-auto bg-gray-200 border-0" />
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
            <div className="text-xl">
              {UpdateData ? "Update Member" : "Add Member"}
            </div>
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
                  disabled={UpdateData ? true : false}
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
              {currentUserIsAdmin && !UpdateData && (
                <div className="mb-4">
                  <FormLabel htmlFor="role">Projects</FormLabel>
                  <Select
                    options={projectOption()}
                    onChange={(e) => setProject(e?.value ?? "")}
                  />
                </div>
              )}
              <div className="text-right">
                <Button
                  variant={"primary"}
                  type="submit"
                  isLoading={isAddOrgMemberSubmitting}
                  disabled={isAddOrgMemberSubmitting}
                >
                  {UpdateData ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      )}
      {organisationForm && (
        <OrganisationForm editData={editData} close={organisationFormClose} />
      )}
      <Dialog
        isOpen={reAssing}
        onClose={() => closeAddMember()}
        hasEscClose={true}
        modalClass="sm:rounded-lg p-4 h-full md:h-auto w-full max-w-md"
      >
        <div className="flex flex-col">
          <div className="text-lg font-semibold text-gray-600">
            Task reassign to other user
          </div>
          <div className="border rounded-md border-gray-100 mt-3 ">
            {filteredOrganisationUsers.map((userOrg) => {
              return (
                reAssingUser?.oldUserId != userOrg.user.userId && (
                  <>
                    <div
                      key={userOrg.userOrganisationId}
                      className="flex flex-wrap md:flex-nowrap items-center px-2 py-1.5 sm:px-5 sm:py-3 gap-9 hover:bg-slate-50"
                      onClick={() => {
                        setReAssignUser((prev) => ({
                          oldUserId: prev?.oldUserId ?? "",
                          newUserId: userOrg.user.userId,
                          organisationUserId: prev?.organisationUserId ?? "",
                        }));
                      }}
                    >
                      <div
                        className={`flex w-full sm:w-auto gap-2 items-center grow ${
                          currentUserIsAdmin ? "cursor-pointer" : ""
                        }`}
                      >
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
                        <div className="w-full h-full">
                          {userOrg.user.firstName
                            ? userOrg.user.lastName
                              ? `${userOrg.user.firstName.charAt(
                                0
                              )}${userOrg.user.lastName.charAt(
                                0
                              )}`.toUpperCase()
                              : `${userOrg.user.firstName.charAt(
                                0
                              )}${userOrg.user.firstName.charAt(
                                1
                              )}`.toUpperCase()
                            : `${userOrg.user.email.charAt(
                              0
                            )}${userOrg.user.email.charAt(1)}`.toUpperCase()}
                        </div>
                      </div>
                      <div className="capitalize text-gray-700 text-sm">
                        {userOrg.role?.toLowerCase().replaceAll("_", " ")}
                      </div>
                      <div>
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            userOrg.user.userId === reAssingUser?.newUserId
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </div>
                    </div>
                    <hr className="h-px w-[98%] my-1 mx-auto bg-gray-200 border-0 " />
                  </>
                )
              );
            })}
          </div>
          <div className="text-sm text-gray-400">
            The user has pending tasks. Please assign these tasks to someone
            else before deleting the user.
          </div>
          <div className="flex justify-end gap-2">
            <Button
              size={"sm"}
              variant={"destructive"}
              onClick={() => {
                setReAssign(false);
                setReAssignUser(undefined);
              }}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              variant={"primary"}
              onClick={() => handleReAssign()}
            >
              Submit
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        isOpen={Boolean(showConfirmDelete)}
        onClose={() => {}}
        modalClass="rounded-lg"
      >
        <div className="flex flex-col gap-2 p-6 ">
          <img src={TrashCan} className="w-12 m-auto" /> Are you sure you want
          to delete ?
          <div className="flex gap-2 ml-auto">
            <Button
              variant={"outline"}
              isLoading={removeOrganisationMemberMutation.isPending}
              disabled={removeOrganisationMemberMutation.isPending}
              onClick={() => setShowConfirmDelete("")}
            >
              Cancel
            </Button>
            <Button
              variant={"primary"}
              // onClick={removeTask}
              isLoading={removeOrganisationMemberMutation.isPending}
              disabled={removeOrganisationMemberMutation.isPending}
              onClick={() => {
                handleRemoveMember(showConfirmDelete);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        isOpen={Boolean(resendEmail)}
        onClose={() => {}}
        modalClass="rounded-lg"
      >
        <div className="flex flex-col gap-2 p-6 ">
          <div className="flex justify-center m-auto w-14 items-center h-14 p-2 rounded-full">
            <img src={MailResendIcon} className="w-14  m-auto " />
          </div>
          Are you sure you want to Resend invitation ?
          <div className="flex gap-2 ml-auto">
            <Button variant={"outline"} onClick={() => setResendEmail("")}>
              Cancel
            </Button>
            <Button
              variant={"primary"}
              onClick={() => {
                resend(resendEmail);
              }}
            >
              Resend
              <img src={SendIcon} className="w-3 ml-2" />
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default OrganisationDetails;
