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
      header: "initial",
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
      key: "email",
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
      header: "Job title",
      key: "email",
      onCellRender: (user: AssignedUsers) => {
        return (
          <div>
            {user.user.userOrganisation[0].jobTitle ?? "N/A"}
          </div>
        );
      },
    },
    {
      header: "Action",
      key: "projectId",
      onCellRender: (user: AssignedUsers) => {
        return (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
                  <Settings className="mr-2 h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-24  flex flex-col gap-1 bg-white shadow rounded">
                <DropdownMenuItem className="w-full flex items-center">
                  <Button
                    variant={"none"}
                    className="p-1 flex justify-around w-full"
                    onClick={() => {
                      setRemove(
                        assignedUsers?.find(
                          (id) => id.user.userId == user.user.userId
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
                Project Members
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
    </div>
  );
}

export default ProjectMember;
