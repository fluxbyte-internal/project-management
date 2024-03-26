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
import Table, { ColumeDef } from "@/components/shared/Table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Settings } from "lucide-react";
import InputText from "@/components/common/InputText";
import CrossIcon from "@/assets/svg/CrossIcon.svg";
import useProjectMemberRoleMutation from "@/api/mutation/useProjectRoleUpdateMutation";
import InputSelect from "react-select";
import useDebounce from "@/hooks/useDebounce";
const reactSelectStyle = {
  control: (
    provided: Record<string, unknown>,
    state: { isFocused: boolean }
  ) => ({
    ...provided,
    border: "1px solid #E7E7E7",
    paddingTop: "0.2rem",
    paddingBottom: "0.2rem",
    zIndex: 1000,
    outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
    boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
    "&:hover": {
      outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
      boxShadow: "0px 0px 0px #943B0C",
    },
  }),
} as const;
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
  const [userId, setUserId] = useState<string>();
  const [userRole, setUserRole] = useState<string>();
  const [OrganizationMember, setOrganizationMember] =
    useState<UserOrganisationType[]>();

  useEffect(() => {
    setAssignedUsers(projectDetailQuery.data?.data.data.assignedUsers);
  }, [projectDetailQuery.data?.data.data]);
  const [filterString, setFilterString] = useDebounce("", 400);

  useEffect(() => {
    setOrganizationMember(
      projectMemberListQuery.data?.data.data.filter(
        (e) => !assignedUsers?.some((u) => u.user.userId === e.user.userId)
      )
    );
    if (filterString) {
      const stringToFilter = filterString.toLowerCase();
      setAssignedUsers(
        projectDetailQuery.data?.data.data.assignedUsers.filter((o) => {
          return (
            String(o.user.firstName).toLowerCase().includes(stringToFilter) ||
            String(o.user.lastName).toLowerCase().includes(stringToFilter) ||
            String(o.user.email).toLowerCase().includes(stringToFilter)
          );
        })
      );
    } else {
      setAssignedUsers(projectDetailQuery.data?.data.data.assignedUsers);
    }
  }, [
    filterString,
    projectMemberListQuery.data?.data.data,
    projectDetailQuery.data?.data.data,
    assignedUsers,
  ]);
  const [remove, setRemove] = useState<string>();
  const { user } = useUser();
  const verification = () => {
    if (user?.userOrganisation[0].role === UserRoleEnumValue.ADMINISTRATOR) {
      return true;
    } else {
      const projectManager =
        projectDetailQuery.data?.data.data.assignedUsers.filter((item) => {
          if (
            item.user.userOrganisation[0].role ===
            UserRoleEnumValue.PROJECT_MANAGER
          ) {
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
    )?.role === UserRoleEnumValue.ADMINISTRATOR;

  const columnDef: ColumeDef[] = [
    {
      header: "Full name",
      key: "firstname",
      onCellRender: (user: AssignedUsers) => {
        return (
          <div>
            {" "}
            {user.user.firstName && user.user.lastName
              ? ` ${user.user.firstName} ${user.user.lastName}`
              : "-"}
          </div>
        );
      },
    },
    {
      header: "Email",
      key: "email",
      onCellRender: (user: AssignedUsers) => {
        return <div>{user.user.email}</div>;
      },
    },
    {
      header: "firstName",
      key: "initial",
      onCellRender: (user: AssignedUsers) => {
        return (
          <div>
            {user.user.firstName
              ? user.user.lastName
                ? `${user.user.firstName.charAt(0)}${user.user.lastName.charAt(
                    0
                  )}`.toUpperCase()
                : `${user.user.firstName.charAt(0)}${user.user.firstName.charAt(
                    1
                  )}`.toUpperCase()
              : `${user.user.email.charAt(0)}${user.user.email.charAt(
                  1
                )}`.toUpperCase()}
          </div>
        );
      },
    },
    {
      header: "Role",
      key: "role",
      onCellRender: (user: AssignedUsers) => {
        return (
          <div>
            {user.user.userOrganisation[0].role
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </div>
        );
      },
    },
    {
      header: "Project role",
      key: "role",
      onCellRender: (user: AssignedUsers) => {
        return <div>{user.projectRole ? user.projectRole : "N/A"}</div>;
      },
    },
    {
      header: "Job title",
      key: "email",
      onCellRender: (user: AssignedUsers) => {
        return <div>{user.user.userOrganisation[0].jobTitle ?? "N/A"}</div>;
      },
    },
    {
      header: "Action",
      key: "projectId",
      onCellRender: (userInRow: AssignedUsers) => {
        return (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={user?.userOrganisation[0].role === UserRoleEnumValue.TEAM_MEMBER}>
                <div className="cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
                  <Settings className="mr-2 h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-24 !z-10  flex flex-col gap-1 bg-white shadow rounded">
                <DropdownMenuItem className="w-full flex  items-center">
                  <Button
                    variant={"none"}
                    className="flex w-full justify-start"
                    onClick={() => {
                      setUserId(userInRow.user.userId),
                        setUserRole(userInRow.projectRole ?? "");
                    }}
                  >
                    <Settings className="mr-0.5 h-4 w-4" />
                    Role
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full flex items-center">
                  <Button
                    variant={"none"}
                    className="flex justify-start w-full"
                    disabled={
                      !assignedUsers?.find(
                        (u) =>
                          u.user.userOrganisation[0].role ==
                          UserRoleEnumValue.PROJECT_MANAGER
                      ) &&
                      userInRow.user.userOrganisation[0].role ==
                        UserRoleEnumValue.ADMINISTRATOR
                    }
                    onClick={() => {
                      setRemove(
                        assignedUsers?.find(
                          (id) => id.user.userId == userInRow.user.userId
                        )?.projectAssignUsersId ?? ""
                      );
                    }}
                  >
                    <img src={TrashCan} alt="" />
                    Remove
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const getOptions = () => {
    const data = [{ label: "Select project role", value: "" }];
    if (
      user?.userOrganisation[0] &&
      user?.userOrganisation[0]?.organisation.jobTitlesOfOrg &&
      user.userOrganisation[0]?.organisation.jobTitlesOfOrg.length > 0
    ) {
      user?.userOrganisation[0]?.organisation.jobTitlesOfOrg.forEach((s) => {
        data.push({ label: s, value: s });
      });
    }
    return data;
  };
  const projectMemberRoleMutation = useProjectMemberRoleMutation();
  const submitRole = () => {
    const data = {
      assingprojectId: assignedUsers?.find((u) => u.user.userId == userId)
        ?.projectAssignUsersId,
      role: userRole,
    };

    projectMemberRoleMutation.mutate(
      { assingprojectId: data.assingprojectId, role: data.role },
      {
        onSuccess(data) {
          toast.success(data.data.message);
          projectDetailQuery.refetch();
          setUserId(undefined);
        },
        onError(error) {
          toast.error(error.response?.data.message);
        },
      }
    );
  };

  return (
    <div className="w-full relative h-full">
      {projectDetailQuery.isFetching ? (
        <Loader />
      ) : (
        <>
          <SideBar
            toggleSidebar={toggleSidebar}
            isSidebarExpanded={isSidebarExpanded}
          />
          <div
            className={`mt-5 overflow-auto h-full ${
              isSidebarExpanded ? "ml-64" : "ml-4"
            }`}
          >
            <div className="h-full w-full p-3">
              <div className="text-gray-400 text-lg  font-semibold mb-3">
                Project Members
              </div>
              <div className="mb-3 flex justify-between">
                <div>
                  <InputText
                    name="search filter"
                    id="search-filter"
                    placeholder="Filter by name or email"
                    className="mt-0 h-auto sm:w-fit max-w-full"
                    onChange={(event) => setFilterString(event.target.value)}
                  />
                </div>
                <div>
                  {currentUserIsAdmin && isAdmin && (
                    <div className="flex items-center">
                      <Popover>
                        <PopoverTrigger className="w-full">
                          <Button variant={"primary"} size={"sm"}>
                            Add Members
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto focus:outline-none">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Team member's
                              </h4>
                            </div>
                            <div>
                              {OrganizationMember?.map((data, index) => {
                                return (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-between p-1 my-1 gap-4 hover:bg-slate-100 rounded-md`}
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
                                    <div>
                                      {data.role
                                        ?.toLowerCase()
                                        .replace(/_/g, " ")
                                        .replace(/\b\w/g, (char) =>
                                          char.toUpperCase()
                                        )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {OrganizationMember?.length == 0 ? (
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
                </div>
              </div>
              <div>
                <Table columnDef={columnDef} data={assignedUsers ?? []}></Table>
              </div>
            </div>
          </div>
        </>
      )}
      {/* {currentUserIsAdmin && (
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
      )} */}

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
      <Dialog
        isOpen={Boolean(userId)}
        onClose={() => {}}
        modalClass="rounded-lg  overflow-visible"
      >
        <div className="flex flex-col gap-2 p-6 w-80">
          <div className="flex justify-between items-center ">
            Assign project role
            <img
              src={CrossIcon}
              className="w-4 h-4 cursor-pointer"
              onClick={() => setUserId(undefined)}
            />
          </div>
          <InputText
            value={
              assignedUsers?.find((u) => u.user.userId == userId)?.user.email
            }
            disabled
          />
          {user?.userOrganisation[0]?.organisationId && (
            <div className="z-40">
              <InputSelect
                name="jobTitle"
                options={getOptions()}
                placeholder={"Role"}
                onChange={(e) => {
                  if (e) {
                    setUserRole(e?.value);
                  }
                }}
                value={{ label: userRole, value: userRole }}
                menuPlacement="auto"
                className="z-10"
                styles={reactSelectStyle}
              />
            </div>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              variant={"outline"}
              isLoading={removeProjectMemberMutation.isPending}
              disabled={removeProjectMemberMutation.isPending}
              onClick={() => setUserId(undefined)}
            >
              Cancel
            </Button>
            <Button variant={"primary"} onClick={() => submitRole()}>
              Save
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default ProjectMember;
