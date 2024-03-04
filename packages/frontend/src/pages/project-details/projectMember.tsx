import useProjectDetail from "@/api/query/useProjectDetailQuery";
import { AssignedUsers } from "@/api/query/useProjectQuery";
import Loader from "@/components/common/Loader";
import SideBar from "@/components/layout/SideBar";
import UserAvatar from "@/components/ui/userAvatar";
import { useUser } from "@/hooks/useUser";
import { UserRoleEnumValue } from "@backend/src/schemas/enums";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TrashCan from "@/assets/svg/TrashCan.svg";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useProjectMemberListQuery from "@/api/query/useAllUserOfOrganition";
import { toast } from "react-toastify";
import { UserOrganisationType } from "@/api/query/useOrganisationDetailsQuery";
import useProjectAddMembersMutation from "@/api/mutation/useAddMemberProject";
import useRemoveProjectMemberMutation from "@/api/mutation/useRemoveMemberProject";
import Dialog from "@/components/common/Dialog";
import InputEmail from "@/components/common/InputEmail";
import FormLabel from "@/components/common/FormLabel";
import ErrorMessage from "@/components/common/ErrorMessage";
import InputSelect from "@/components/common/InputSelect";
import { z } from "zod";
import { useFormik } from "formik";
import { addOrganisationMemberSchema } from "@backend/src/schemas/organisationSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useAddOrganisationMemberMutation from "@/api/mutation/useAddOrganisationMemberMutation";
import { isAxiosError } from "axios";
import CrossIcon from "../../assets/svg/CrossIcon.svg";
import { SingleValue } from "react-select";

function ProjectMember() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const projectMemberListQuery = useProjectMemberListQuery();

  //   const navigate = useNavigate();
  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };
  const { projectId } = useParams();
  const projectDetailQuery = useProjectDetail(projectId);
  const [assignedUsers, setAssignedUsers] = useState<
    AssignedUsers[] | undefined
  >();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] =
    useState<SingleValue<(typeof memberRoleOptions)[number]>>(null);

  const addOrganisationMemberMutation = useAddOrganisationMemberMutation(
    localStorage.getItem("organisation-id") ?? ""
  );
  const [isAddOrgMemberSubmitting, setIsAddOrgMemberSubmitting] =
    useState(false);
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
          setIsOpen(false);
          projectMemberListQuery.refetch();
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
    },
  });

  const [OrganizationMember, setOrganizationMember] =
    useState<UserOrganisationType[]>();

  useEffect(() => {
    setAssignedUsers(projectDetailQuery.data?.data.data.assignedUsers);
  }, [projectDetailQuery.data?.data.data]);

  useEffect(() => {
    setOrganizationMember(
      projectMemberListQuery.data?.data.data.filter(
        (e) => !assignedUsers?.some((u) => u.user.userId === e.user.userId)
      )
    );
  }, [
    projectMemberListQuery.data?.data.data,
    projectDetailQuery.data?.data.data,
    assignedUsers,
  ]);
  const [remove, setRemove] = useState<string>();
  const { user } = useUser();
  const verification = () => {
    if (user?.userOrganisation[0].role ===  UserRoleEnumValue.ADMINISTRATOR) {
      return true;
    } else {
      const projectManager =
        projectDetailQuery.data?.data.data.assignedUsers.filter((item) => {
          if (item.user.userOrganisation[0].role === UserRoleEnumValue.PROJECT_MANAGER) {
            return item;
          }
        });
      const manager = projectManager?.find(
        (manager) => manager?.user.userId === user?.userId
      );
      if (manager?.user.userId) {
        return true;
      }
    }
    return false;
  };
  const isAdmin = verification();
  user?.userOrganisation[0].role === UserRoleEnumValue.ADMINISTRATOR;
  const projectAddMembersMutation = useProjectAddMembersMutation(projectId);
  const submitMembers = (user: UserOrganisationType) => {
    if (user) {
      projectAddMembersMutation.mutate(
        { assginedToUserId: user.user.userId },
        {
          onSuccess(data) {
            projectDetailQuery.refetch();
            toast.success(data.data.message);
          },
          onError(error) {
            toast.error(error.response?.data.message);
          },
        }
      );
    }
  };
  const removeProjectMemberMutation = useRemoveProjectMemberMutation();

  const removeMembers = (id: string) => {
    removeProjectMemberMutation.mutate(id, {
      onSuccess(data) {
        projectDetailQuery.refetch();
        projectMemberListQuery.refetch();
        toast.success(data.data.message);
        setRemove(undefined);
      },
      onError(error) {
        setRemove(undefined);
        toast.error(error.response?.data.message);
      },
    });
  };
  const currentUserIsAdmin =
    user?.userOrganisation.find(
      (org) => org.organisationId === localStorage.getItem("organisation-id")
    )?.role ===  UserRoleEnumValue.ADMINISTRATOR;
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
  return (
    <div className="w-full relative h-full">
      {projectDetailQuery.isLoading ? (
        <Loader />
      ) : (
        <>
          <SideBar
            toggleSidebar={toggleSidebar}
            isSidebarExpanded={isSidebarExpanded}
          />
          <div
            className={`mt-5 overflow-auto ${
              isSidebarExpanded ? "ml-64" : "ml-4"
            }`}
          >
            <div className="h-full w-full p-3">
              
              <div className="text-lg text-gray-400 font-semibold mb-3 flex justify-between">
                Project Manager
                <div>
                  {currentUserIsAdmin && <Button variant={"primary"} size={"sm"} onClick={()=>setIsOpen(true)}>Add Members</Button>}
                </div>
              </div>
              <div className="flex gap-5 h-full w-full py-2 flex-wrap">
                {assignedUsers
                  ?.filter(
                    (e) =>
                      e.user.userOrganisation[0].role ===
                        UserRoleEnumValue.PROJECT_MANAGER ||
                      e.user.userOrganisation[0].role ===
                        UserRoleEnumValue.ADMINISTRATOR
                  )
                  .map((res, index) => {
                    return (
                      <div
                        key={index}
                        className="group relative overflow-hidden flex flex-col gap-5 h-48 w-44 lg:justify-between items-center bg-primary-50 hover:bg-primary-100 border-[1px] border-[#FFE388] rounded-md lg:p-2"
                      >
                        <div className="flex flex-col items-center justify-between h-3/5 w-3/5 gap-2">
                          <div className="flex items-center rounded-full border-2 h-full w-full min-w-[100px] min-h-[100px] ">
                            <UserAvatar
                              user={res.user}
                              className="w-full h-full"
                            />
                            <div></div>
                          </div>
                          <div className="flex flex-col items-center">
                            <a className="group-hover:text-primary-800 font-semibold text-base text-center overflow-hidden max-w-[140px] w-fit text-ellipsis">
                              {res.user.firstName} {res.user.lastName}
                            </a>
                            <a className="group-hover:text-primary-500 text-gray-300   text-xs font-semibold text-center overflow-hidden max-w-[140px] w-fit text-ellipsis">
                              {res.user.email}
                            </a>
                          </div>
                          {(isAdmin && res.user.userOrganisation[0].role !==  UserRoleEnumValue.ADMINISTRATOR) && (
                            <div className="flex w-full absolute top-0 justify-end ">
                              <Button
                                variant={"none"}
                                className="p-1"
                                onClick={() => {
                                  setRemove(
                                    assignedUsers.find(
                                      (id) => id.user.userId == res.user.userId
                                    )?.projectAssignUsersId ?? ""
                                  );
                                }}
                              >
                                <img src={TrashCan} alt="" />
                              </Button>
                            </div>
                          )}
                          <div>
                            <a className="group-hover:text-primary-500 text-gray-300  mb-10 text-xs font-semibold text-center overflow-hidden max-w-[140px] w-fit text-ellipsis">
                              {res.user.userOrganisation[0].role
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {isAdmin && (
                  <div className="flex items-center">
                    <Popover>
                      <PopoverTrigger className="w-full">
                        <Button
                          variant={"secondary"}
                          className="rounded-full h-0 w-0 text-3xl p-5"
                        >
                          <div className="mb-2">+</div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 focus:outline-none">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Project Manager
                            </h4>
                          </div>
                          <div>
                            {OrganizationMember?.map((data, index) => {
                              return (
                                (data.role ===
                                  UserRoleEnumValue.PROJECT_MANAGER ||
                                  data.role ===
                                    UserRoleEnumValue.ADMINISTRATOR) && (
                                  <div
                                    key={index}
                                    className={`flex items-center p-1 my-1 gap-4 hover:bg-slate-100 rounded-md`}
                                    onClick={() => {
                                      submitMembers(data);
                                    }}
                                  >
                                    <UserAvatar
                                      user={data.user}
                                      className="rounded-full"
                                    />
                                    <div>
                                      <div className="">
                                        {data.user.firstName}{" "}
                                        {data.user.lastName}
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        {data.user.email}
                                      </div>
                                    </div>
                                  </div>
                                )
                              );
                            })}
                            {OrganizationMember?.length == 0 ||
                            OrganizationMember?.filter(
                              (e) =>
                                e.role ===  UserRoleEnumValue.PROJECT_MANAGER ||
                                e.role ===  UserRoleEnumValue.ADMINISTRATOR
                            ).length === 0 ? (
                                <div className="text-sm text-gray-400 font-semibold">
                                No More Project Manager Available!
                                </div>
                              ) : (
                                ""
                              )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                {assignedUsers?.filter(
                  (e) =>
                    e.user.userOrganisation[0].role ===
                      UserRoleEnumValue.PROJECT_MANAGER ||
                    e.user.userOrganisation[0].role ===
                      UserRoleEnumValue.ADMINISTRATOR
                ).length === 0 && "No team member assigned yet!"}
              </div>
              <div className="text-lg text-gray-400 font-semibold mt-3">
                Team Members
              </div>
              <div className="flex gap-5 h-full w-full py-2 flex-wrap">
                {assignedUsers
                  ?.filter(
                    (e) =>
                      e.user.userOrganisation[0].role ===
                      UserRoleEnumValue.TEAM_MEMBER
                  )
                  .map((res, index) => {
                    return (
                      <div
                        key={index}
                        className="group relative overflow-hidden flex flex-col gap-5 h-48 w-44 lg:justify-between items-center bg-primary-50 hover:bg-primary-100 border-[1px] border-[#FFE388] rounded-md lg:p-2"
                      >
                        <div className="flex flex-col items-center justify-between h-3/5 w-3/5 gap-2">
                          <div className="flex items-center rounded-full border-2 h-full w-full min-w-[100px] min-h-[100px] ">
                            <UserAvatar
                              user={res.user}
                              className="w-full h-full"
                            />
                            <div></div>
                          </div>
                          <div className="flex flex-col items-center">
                            <a className="group-hover:text-primary-800 font-semibold text-base text-center overflow-hidden max-w-[140px] w-fit text-ellipsis">
                              {res.user.firstName} {res.user.lastName}
                            </a>
                            <a className="group-hover:text-primary-500 text-gray-300   text-xs font-semibold text-center overflow-hidden max-w-[140px] w-fit text-ellipsis">
                              {res.user.email}
                            </a>
                          </div>
                          {isAdmin && (
                            <div className="flex w-full absolute top-0 justify-end ">
                              <Button
                                variant={"none"}
                                className="p-1"
                                onClick={() => {
                                  setRemove(
                                    assignedUsers.find(
                                      (id) => id.user.userId == res.user.userId
                                    )?.projectAssignUsersId ?? ""
                                  );
                                }}
                              >
                                <img src={TrashCan} alt="" />
                              </Button>
                            </div>
                          )}
                          <div>
                            <a className="group-hover:text-primary-500 text-gray-300  mb-10 text-xs font-semibold text-center overflow-hidden max-w-[140px] w-fit text-ellipsis">
                              {res.user.userOrganisation[0].role
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {isAdmin && (
                  <div className="flex items-center">
                    <Popover>
                      <PopoverTrigger className="w-full">
                        <Button
                          variant={"secondary"}
                          className="rounded-full h-0 w-0 text-3xl p-5"
                        >
                          <div className="mb-2">+</div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 focus:outline-none">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Team member's
                            </h4>
                          </div>
                          <div>
                            {OrganizationMember?.map((data, index) => {
                              return (
                                data.role === UserRoleEnumValue.TEAM_MEMBER && (
                                  <div
                                    key={index}
                                    className={`flex items-center p-1 my-1 gap-4 hover:bg-slate-100 rounded-md`}
                                    onClick={() => {
                                      submitMembers(data);
                                    }}
                                  >
                                    <UserAvatar
                                      user={data.user}
                                      className="rounded-full"
                                    />
                                    <div>
                                      <div className="">
                                        {data.user.firstName}{" "}
                                        {data.user.lastName}
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        {data.user.email}
                                      </div>
                                    </div>
                                  </div>
                                )
                              );
                            })}
                          </div>
                          {OrganizationMember?.length == 0 ||
                          OrganizationMember?.filter(
                            (e) => e.role ===UserRoleEnumValue.TEAM_MEMBER
                          ).length === 0 ? (
                              <div className="text-sm text-gray-400 font-semibold">
                              No More Team Member Available!
                              </div>
                            ) : (
                              ""
                            )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {assignedUsers?.filter(
                  (e) =>
                    e.user.userOrganisation[0].role ===
                    UserRoleEnumValue.TEAM_MEMBER
                ).length === 0 && "No team member assigned yet!"}
              </div>
            </div>
          </div>
        </>
      )}
      {currentUserIsAdmin && (
        <Dialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          hasEscClose={true}
          modalClass="sm:rounded-lg p-4 h-full md:h-auto w-full max-w-md"
        >
          <div>
            <div className="text-xl">Add Member</div>
            <Button
              onClick={() => setIsOpen(false)}
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
      <Dialog
        isOpen={Boolean(remove)}
        onClose={() => {}}
        modalClass="rounded-lg"
      >
        <div className="flex flex-col gap-2 p-6 ">
          <img src={TrashCan} className="w-12 m-auto" /> Are you sure you want
          to delete ?
          <div className="flex gap-2 ml-auto">
            <Button
              variant={"outline"}
              isLoading={removeProjectMemberMutation.isPending}
              disabled={removeProjectMemberMutation.isPending}
              onClick={() => setRemove(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant={"primary"}
              onClick={() => removeMembers(remove ?? "")}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default ProjectMember;
