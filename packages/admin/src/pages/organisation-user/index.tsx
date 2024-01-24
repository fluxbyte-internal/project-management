import Table, { ColumeDef } from "@/components/shared/Table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "@/components/common/Loader";
import UserAvatar from "@/components/ui/userAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";

import {
  UserRoleEnumValue,
  UserStatusEnumValue,
} from "@backend/src/schemas/enums";
import useUserStatusMutation from "@/api/mutation/userUserStatusMutation";
import { toast } from "react-toastify";
import useUserRoleUpdateMutation from "@/api/mutation/useUserRoleUpdateMutation";
import useGetusersOrganisationsQuery, { OrganisationUserType } from "@/api/query/useGetUsersOrganisationMemberList";
import Dialog from "@/components/common/Dialog";
import useAssignAdministratorMutation from "@/api/mutation/useAssignAdministratorMutation";
import Alert from "../../assets/svg/Alert.svg";
import Blocked from "../../assets/svg/Blocked.svg";
import Active from "../../assets/svg/Active.svg";
import CrossIcon from "../../assets/svg/CrossIcon.svg";
import OperartorBackground from "../../assets/operatorHomePageImage.jpg";
import Dropdown from "../../assets/svg/Dropdown.svg"

function OrganisationUsers() {
  const location = useLocation();
  const state = location.state;
  const [data, setData] = useState<OrganisationUserType[]>();
  const [currentAdminId, setCurrentAdminId] = useState<string>("");
  const [newAdminId, setAdminId] = useState<string>("");
  const [userList, setUserList] = useState<OrganisationUserType[]>();
  const [adminAlert, setadminAlert] = useState(false);
  const [filterData, setFilterData] = useState<OrganisationUserType[]>();
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [isAdminConfirmOpenPopUp, setIsAdminConfirmOpenPopUp] = useState(false);
  const userStatusMutation = useUserStatusMutation();
  const userRoleUpdateMutation = useUserRoleUpdateMutation();
  const assignAdministratorMutation = useAssignAdministratorMutation();
  const usersOrganisationsQuery = useGetusersOrganisationsQuery(
    state[0].organisationId
  );
  useEffect(() => {
    setData(usersOrganisationsQuery.data?.data?.data);
    setFilterData(usersOrganisationsQuery.data?.data?.data);
  }, [usersOrganisationsQuery.data?.data?.data]);

  useEffect(() => {
    const adminUser = data?.find(
      (res) =>
        res.role === UserRoleEnumValue.ADMINISTRATOR &&
        res.user.status === UserStatusEnumValue.ACTIVE
    );

    if (adminUser) {
      setadminAlert(false);
      return;
    } else {
      setadminAlert(true);
    }
  }, [data]);

  const fetchData = () => {
    usersOrganisationsQuery.refetch();
    setData(usersOrganisationsQuery.data?.data?.data);
    setFilterData(usersOrganisationsQuery.data?.data?.data);
  };
  const handleView = (
    id: string,
    status: keyof typeof UserStatusEnumValue,
    organisationId: string
  ) => {
    userStatusMutation.mutate(
      { userId: id, status: status, organisationId },
      {
        onSuccess(data) {
          fetchData();
          toast.success(data.data.message);
        },
        onError(err) {
          toast.error(
            err.response?.data?.message ?? "An unexpected error occurred."
          );
        },
      }
    );
  };

  const handleAdministratorReassign = () => {
    if (adminAlert) {
      handleUserRoleUpdate(
        data ? data[0].organisationId : "",
        newAdminId,
        UserRoleEnumValue.ADMINISTRATOR
      );
      setIsAdminConfirmOpenPopUp(false);
      setIsOpenPopUp(false);
      setadminAlert(false);
    } else {
      assignAdministratorMutation.mutate(
        {
          organisationId: data ? data[0].organisationId : "",
          userOrganisationBlockId: currentAdminId,
          reassginAdministratorId: newAdminId,
        },
        {
          onSuccess(data) {
            fetchData();
            toast.success(data.data.message);
            setIsAdminConfirmOpenPopUp(false);
            setIsOpenPopUp(false);
          },
          onError(err) {
            toast.error(
              err.response?.data?.message ?? "An unexpected error occurred."
            );
            setIsAdminConfirmOpenPopUp(false);
            setIsOpenPopUp(false);
          },
        }
      );
    }
  };
  const handleNoAdministrator = () => {
    setIsOpenPopUp(true);
    setUserList(usersOrganisationsQuery?.data?.data?.data);
  };

  const handleBlock = (
    id: string,
    status: keyof typeof UserStatusEnumValue,
    organisationId: string,
    role: keyof typeof UserRoleEnumValue
  ) => {
    if (role === UserRoleEnumValue.ADMINISTRATOR) {
      setUserList(usersOrganisationsQuery?.data?.data?.data);
      setIsOpenPopUp(true);
    } else {
      userStatusMutation.mutate(
        { userId: id, status: status, organisationId },
        {
          onSuccess(data) {
            fetchData();
            toast.success(data.data.message);
          },
          onError(err) {
            toast.error(
              err.response?.data?.message ?? "An unexpected error occurred."
            );
          },
        }
      );
    }
  };

  const handleUserRoleUpdate = (
    organisationId: string,
    userOrganisationId: string,
    role: keyof typeof UserRoleEnumValue
  ) => {
    userRoleUpdateMutation.mutate(
      { organisationId, userOrganisationId, role },
      {
        onSuccess(data) {
          fetchData();
          toast.success(data.data.message);
        },
        onError(err) {
          toast.error(
            err.response?.data?.message ?? "An unexpected error occurred."
          );
        },
      }
    );
  };

  const columnDef: ColumeDef[] = [
    {
      key: "avatar",
      header: "Avatar",
      onCellRender: (item) => (
        <>
          <div className="w-1/2 h-fit items-center rounded-full p-2">
            <UserAvatar user={item.user} />
          </div>
        </>
      ),
    },
    {
      key: "user",
      header: "Full Name",
      onCellRender: (item) => (
        <div className="">
          {(item.user.firstName ? item.user.firstName : "") +
            " " +
            (item.user.lastName ? item.user.lastName : "-")}
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      onCellRender: (item) => <>{item.user.email}</>,
    },
    {
      key: "status",
      header: "Status",
      onCellRender: (item) => (
        <>
          <div
            className={`w-32 h-8 px-3 py-1.5 ${
              item.user.status === "ACTIVE"
                ? "bg-cyan-100 text-cyan-700"
                : "bg-red-500 text-white"
            } rounded justify-center items-center gap-px inline-flex`}
          >
            <div className=" text-xs font-medium leading-tight">
              {item.user.status}
            </div>
          </div>
        </>
      ),
    },
    {
      key: "role",
      header: "Role",
    },

    {
      key: "Action",
      header: "Action",
      onCellRender: (item) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
                Edit
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-11 flex flex-col gap-1">
              {item.user.status === UserStatusEnumValue.ACTIVE ? (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      setCurrentAdminId(item.userId);
                      handleBlock(
                        item.userId,
                        UserStatusEnumValue.INACTIVE,
                        item.organisationId,
                        item.role
                      );
                    }}
                  >
                    <img
                      className="mr-2 h-4 w-4 text-[#44546F]"
                      src={Blocked}
                    />
                    <span className="p-0 font-normal h-auto">Block</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-1" />
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      item.role != UserRoleEnumValue.ADMINISTRATOR
                        ? handleView(item.userId, "ACTIVE", item.organisationId)
                        : null;
                    }}
                  >
                    <img
                      className="mr-2 h-4 w-4 text-[#44546F]"
                      src={Active}
                    />
                    <span
                      className={`${
                        item.role === UserRoleEnumValue.ADMINISTRATOR
                          ? "cursor-not-allowed"
                          : ""
                      } p-0 font-normal h-auto`}
                    >
                      Retrieve
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="mx-1" />
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ),
    },
  ];
  return (
    <>
      <div style={{ backgroundImage: `url(${OperartorBackground})` }} className="w-full h-full relative bg-no-repeat bg-cover">
        {usersOrganisationsQuery.isLoading ? (
          <Loader />
        ) : (
          <>
            {usersOrganisationsQuery.data?.data?.data &&
            usersOrganisationsQuery.data?.data?.data.length > 0 ? (
              <div style={{ backgroundImage: `url(${OperartorBackground})` }} className="h-full py-5 p-4 lg:p-14 w-full flex flex-col gap-5 bg-no-repeat bg-cover">
                <div className="flex lg:flex-row flex-col gap-4 lg:gap-0 justify-between items-center">
                  <h2 className="font-medium text-3xl leading-normal text-gray-600">
                    Organisation's User
                  </h2>
                  {adminAlert && (
                    <div
                      className="flex gap-3 bg-red-200 px-5 py-1 rounded-full items-center"
                      onClick={() => handleNoAdministrator()}
                    >
                      <img
                        className="h-[20px] w-[20px] text-[#44546F]"
                        src={Alert}
                      ></img>
                      <h2 className="font-medium lg:text-lg text-md text-red-500 leading-normal ">
                        Organisation must have an Administrator
                      </h2>
                      <button>
                        <img
                          className="w-[20px] h-[20px]"
                          src={Dropdown}
                        ></img>
                      </button>
                    </div>
                  )}
                </div>

                <div className="h-[80%] overflow-auto">
                  {filterData && (
                    <Table
                      key="Project view"
                      columnDef={columnDef}
                      data={filterData}
                    />
                  )}
                  {!data && (
                    <div className="flex justify-center p-3 w-full">
                      No organisations available
                    </div>
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
            {isOpenPopUp && (
              <Dialog
                modalClass="operatorForm-background-image rounded-lg w-4/5 h-4/5 p-5"
                isOpen={isOpenPopUp}
                onClose={() => setIsOpenPopUp(isOpenPopUp)}
              >
                <div className="space-y-2">
                  <h4 className="lg:pl-5 pl-1 text-2xl lg:text-3xl font-medium leading-none text-gray-600">
                    Select an Administrator
                  </h4>
                </div>
                <div className="mt-12">
                  {userList?.map((data, index) => {
                    return (
                      <div
                        onClick={() => {
                          setIsAdminConfirmOpenPopUp(true);
                          setAdminId(data.userOrganisationId);
                        }}
                        key={index}
                        className="cursor-pointer flex justify-evenly items-center p-2 px-2 my-1 gap-4 hover:bg-slate-100 rounded-md bg-slate-100/80"
                      >
                        <UserAvatar user={data.user} className="rounded-full" />
                        <div className="flex lg:gap-5 gap-0 lg:justify-between justify-start lg:w-1/2 w-full lg:px-10 px-1">
                          <div className="text-center overflow-hidden max-w-[300px] max-h-[25px] collapse lg:visible lg:w-fit w-0 text-ellipsis">
                            {`${data.user?.firstName} ${data.user?.lastName}`}
                          </div>
                          <div className="lg:text-sm text-md text-gray-400 text-start overflow-hidden max-w-[300px] self-center lg:w-2/3 w-full text-ellipsis">
                            {data.user.email}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {isAdminConfirmOpenPopUp && (
                  <div className=" z-10 w-1/4 h-1/4">
                    <Dialog
                      modalClass=" rounded-lg w-1/2 h-1/4 px-5"
                      isOpen={isOpenPopUp}
                      onClose={() => setIsOpenPopUp(isOpenPopUp)}
                    >
                      <div className="w-full h-full flex flex-col gap-5 justify-between items-center py-8 px-5">
                        <div className="flex flex-col gap-5">
                          <div className="font-medium text-2xl leading-normal text-gray-600">
                            Assign this user as an ADMINISTRATOR?
                          </div>
                        </div>
                        <div className="flex w-full h-fit gap-5 justify-end items-center">
                          <Button
                            variant={"none"}
                            className="bg-success"
                            onClick={() => handleAdministratorReassign()}
                          >
                            Yes
                          </Button>
                          <Button
                            variant={"none"}
                            className="bg-danger text-white"
                          >
                            No
                          </Button>
                        </div>
                      </div>
                      <div className="w-full h-fit absolute flex justify-end items-start top-0 lg:right-0 -right-80 px-10 py-5">
                        <button
                          className="cursor-pointer"
                          onClick={() => {
                            setIsAdminConfirmOpenPopUp(false);
                          }}
                        >
                          <img src={CrossIcon}></img>
                        </button>
                      </div>
                    </Dialog>
                  </div>
                )}
                <div className=" w-full h-fit absolute flex justify-end items-start top-0 right-0 px-3 lg:px-10 py-5">
                  <button
                    className="cursor-pointer"
                    onClick={() => {
                      setIsOpenPopUp(false);
                    }}
                  >
                    <img src={CrossIcon}></img>
                  </button>
                </div>
              </Dialog>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default OrganisationUsers;
