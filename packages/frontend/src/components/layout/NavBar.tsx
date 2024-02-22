import DownArrow from "../../assets/svg/DownArrow.svg";
import Notification from "../../assets/svg/Notification.svg";
import Information from "../../assets/svg/Information.svg";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { CheckCheck, LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateProjectForm from "../project/CreateProjectForm";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import UserAvatar from "../ui/userAvatar";
import io from "socket.io-client";
import timeAgo from "@/helperFuntions/notificationFormatter";
import useAllNotificationQuery, {
  NotificationType,
} from "@/api/query/useAllNotificationQuery";
import useReadAllNotificationMutation from "@/api/mutation/useReadAllNotificationMutation";
import { toast } from "react-toastify";
import useSingleReadNotificationMutation from "@/api/mutation/useSingleReadNotificationMutation";
import Dialog from "../common/Dialog";
import { baseURL } from "@/Environment";
import { UserRoleEnumValue } from "@backend/src/schemas/enums";

type NavItemType =
  | {
      id: number;
      name: string;
      link: string;
    }
  | {
      id: number;
      name: string;
      dropDown: Array<{
        id: number;
        contentName: string;
        contentLink: string;
      }>;
    };

function hasSubItem(item: NavItemType): item is {
  id: number;
  name: string;
  dropDown: Array<{
    id: number;
    contentName: string;
    contentLink: string;
  }>;
} {
  return !!(item as { dropDown: unknown }).dropDown;
}

const navbarData: NavItemType[] = [
  {
    id: 1,
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    id: 2,
    name: "Project",
    link: "/projects",
  },
] as NavItemType[];

function NavBar() {
  const navigate = useNavigate();
  const [isOpenPopUp, setisOpenPopUp] = useState(false);
  const { logout } = useAuth();
  const { user } = useUser();
  const [notifications, setNotifications] = useState<NotificationType[]>();
  const useAllNotification = useAllNotificationQuery();

  const useReadAllNotification = useReadAllNotificationMutation();

  const [isOpenPopUpRead, setisOpenPopUpRead] = useState(false);
  const handleOpenPopUp = () => {
    setisOpenPopUp(!isOpenPopUp);
  };
  const openAccountSettings = () => {
    navigate("/account-settings");
  };
  const openOrganisationSettings = () => {
    navigate("/organisation/" + user?.userOrganisation[0]?.organisationId);
  };

  useEffect(() => {
    setNotifications(useAllNotification.data?.data.data ?? []);
    const socket = io(baseURL, {
      path: "/socket.io",
      forceNew: true,
      reconnectionAttempts: 3,
      timeout: 2000,
      query: {
        roomName: user?.userId,
      },
    });
    socket.emit("join", user?.userId);
    socket.on("notification", (notificationObject) => {
      if (notificationObject) {
        setNotifications((prevNotifications) => [
          ...(prevNotifications ? prevNotifications : []),
          {
            notificationId: notificationObject.notificationId,
            type: notificationObject.type,
            referenceId: notificationObject.referenceId,
            sentBy: notificationObject.sentBy,
            sentTo: notificationObject.sentTo,
            details: notificationObject.details,
            isRead: notificationObject.isRead,
            createdAt: notificationObject.createdAt,
            ReadAt: notificationObject.ReadAt,
            sentNotificationBy: notificationObject.sentNotificationBy,
            sentNotificationTo: notificationObject.sentNotificationTo,
            task: notificationObject.task,
          },
        ]);
      }
    });
    return () => {
      socket.off("notification");
    };
  }, [useAllNotification.data?.data.data]);

  const handleReadAll = () => {
    const updatedNotifications = notifications?.map((notification) => ({
      ...notification,
      isRead: true,
    }));

    if (updatedNotifications) {
      useReadAllNotification.mutate(
        updatedNotifications as unknown as NotificationType,
        {
          onSuccess(data) {
            toast.success(data.data.message);
            setNotifications([]);
          },
          onError(error) {
            toast.error(error.response?.data.message);
          },
        }
      );
    }
  };

  const singleReadNotificationMutation = useSingleReadNotificationMutation();

  const handleSingleReadNotification = (notificationData: NotificationType) => {
    singleReadNotificationMutation.mutate(
      { ...notificationData, isRead: true },
      {
        onSuccess: (data) => {
          toast.success(data.data.message);
          setNotifications((prevNotifications) => {
            if (prevNotifications) {
              return prevNotifications.filter(
                (n) => n.notificationId !== notificationData.notificationId
              );
            }
            return prevNotifications;
          });
        },
        onError: (error) => {
          toast.error(error.response?.data.message);
        },
      }
    );
  };
  return (
    <div className="w-full h-14 z-10 fixed border-b-2 border-[#E2E8F0] flex items-center flex-col bg-white">
      <div className="flex items-center w-full h-full justify-between sm:px-3 px-2">
        <div className="flex gap-5 items-center">
          <div className="text-primary-800 text-sm font-bold flex justify-center items-center w-auto h-auto">
            {user?.userOrganisation[0]?.organisation?.organisationName}
          </div>
          {user?.userOrganisation[0]?.organisation && (
            <div className="flex gap-5 justify-between overflow-hidden items-center">
              <div className="flex gap-5">
                {navbarData.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`hidden gap-2 items-center ${
                        item.id === 2 && "lg:flex"
                      } ${item.id === 1 && "md:flex"} ${
                        user?.userOrganisation[0].role ==
                          UserRoleEnumValue.TEAM_MEMBER &&
                        item.id === 1 &&
                        "!hidden"
                      }`}
                    >
                      {hasSubItem(item) ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-500 relative cursor-pointer">
                                {item.name}
                              </div>
                              <div className="w-full h-full flex items-center aspect-square">
                                <img src={DownArrow} alt="Dropdown Arrow" />
                              </div>
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-auto">
                            {item.dropDown.map(
                              ({ contentName, contentLink }, contentIndex) => (
                                <DropdownMenuItem key={contentIndex}>
                                  <div className="flex justify-between items-center">
                                    <div className="flex break-all">
                                      {contentLink ? (
                                        <Link to={contentLink}>
                                          {contentName}
                                        </Link>
                                      ) : (
                                        contentName
                                      )}
                                    </div>
                                  </div>
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link
                          to={item.link}
                          className="text-sm font-medium text-gray-500 relative cursor-pointer"
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2 items-center lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center justify-center gap-2">
                      <div className="text-sm font-medium text-gray-500 cursor-pointer">
                        More
                      </div>
                      <div className="w-full h-full flex aspect-square">
                        <img src={DownArrow} className="w-full h-full"></img>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-36">
                    {navbarData.map((item, index) => {
                      return (
                        <DropdownMenuItem className="p-0" key={index}>
                          <div
                            className={`flex justify-between text-sm font-medium text-gray-500 relative cursor-pointer p-1 w-full ${
                              item.id === 2 ? "lg:hidden" : ""
                            } ${item.id === 1 ? "md:hidden" : ""}`}
                          >
                            {hasSubItem(item) ? (
                              <div className="flex items-center justify-between w-full gap-2">
                                <div className="text-sm font-medium text-gray-500 relative cursor-pointer">
                                  {item.name}
                                </div>
                                <div className="h-full flex items-center aspect-square">
                                  <img src={DownArrow} alt="Dropdown Arrow" />
                                </div>
                              </div>
                            ) : (
                              <Link
                                to={item.link}
                                className="text-sm font-medium text-gray-500 relative cursor-pointer"
                              >
                                {item.name}
                              </Link>
                            )}
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {user?.userOrganisation[0]?.role !== UserRoleEnumValue.TEAM_MEMBER && (
                <>
                  <Button
                    className="hidden lg:block"
                    variant={"primary"}
                    onClick={handleOpenPopUp}
                  >
                    Create
                  </Button>
                  <Button
                    className="block lg:hidden p-2"
                    variant={"primary"}
                    onClick={handleOpenPopUp}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
                      />
                    </svg>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-5  items-center relative">
          {!isOpenPopUpRead && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="relative w-8 h-8 aspect-square rounded-full bg-transparent active:bg-primary-100 hover:bg-primary-100  cursor-pointer">
                  <img src={Notification} className="absolute top-1 left-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="!overflow-y-auto !max-h-[600px] !w-64">
                <div className="flex justify-between">
                  <div>
                    <DropdownMenuLabel className="!font-bold">
                      Notifications
                    </DropdownMenuLabel>
                  </div>

                  {notifications && notifications.length > 0 && (
                    <CheckCheck
                      onClick={() => setisOpenPopUpRead(true)}
                      className="flex justify-center items-center"
                    />
                  )}
                </div>
                <DropdownMenuSeparator />
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <>
                      <DropdownMenuItem key={notification.notificationId}>
                        <div
                          className="w-full"
                          onClick={() =>
                            handleSingleReadNotification(notification)
                          }
                        >
                          <div className="flex justify-between w-full">
                            <div className="text-md font-semibold break-all">
                              {notification.details}
                            </div>
                          </div>
                          <div className="text-gray-300 ">
                            {timeAgo(new Date(notification.createdAt))}
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ))
                ) : (
                  <div className="p-2">No notification Found</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {isOpenPopUpRead && (
            <Dialog
              isOpen={isOpenPopUpRead}
              onClose={() => {}}
              modalClass="rounded-lg"
            >
              <div className="flex flex-col gap-2 p-6 ">
                Are you sure you want to Read All Notifications ?
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant={"outline"}
                    isLoading={useReadAllNotification.isPending}
                    disabled={useReadAllNotification.isPending}
                    onClick={() => setisOpenPopUpRead(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"primary"}
                    onClick={() => {
                      handleReadAll();
                      setisOpenPopUpRead(false);
                    }}
                    isLoading={useReadAllNotification.isPending}
                    disabled={useReadAllNotification.isPending}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </Dialog>
          )}
          {notifications && notifications.length > 0 && (
            <div
              className=" w-6 h-6 rounded-full bg-red-700 
            absolute bottom-5 left-5 text-xs p-2 flex justify-center items-center text-white"
            >
              {notifications.length <= 99 ? notifications.length : "99+"}
            </div>
          )}
          <Button className="relative w-8 h-8 aspect-square rounded-full bg-transparent active:bg-primary-100 hover:bg-primary-100 md:block hidden cursor-pointer">
            <img src={Information} className="absolute top-0 left-0" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="rounded-full cursor-pointer">
                <UserAvatar user={user} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 flex flex-col gap-1">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem className="flex md:hidden">
                <div className="mr-2 h-5 w-5">
                  <img src={Information} className="mr-2 h-full w-full" />
                </div>
                <Button className="p-0 font-normal h-auto" variant={"ghost"}>
                  Information
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openAccountSettings}>
                <Settings className="mr-2 h-4 w-4 text-[#44546F]" />
                <Button className="p-0 font-normal h-auto" variant={"ghost"}>
                  Account Settings
                </Button>
              </DropdownMenuItem>
              {user?.userOrganisation[0] &&
                user?.userOrganisation[0].organisationId && (
                <DropdownMenuItem onClick={openOrganisationSettings}>
                  <Settings className="mr-2 h-4 w-4 text-[#44546F]" />
                  <Button
                    className="p-0 font-normal h-auto"
                    variant={"ghost"}
                  >
                      Organisations Settings
                  </Button>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4 text-[#44546F]" />
                <Button className="p-0 font-normal h-auto" variant={"ghost"}>
                  Log out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isOpenPopUp && <CreateProjectForm handleClosePopUp={handleOpenPopUp} />}
    </div>
  );
}

export default NavBar;
