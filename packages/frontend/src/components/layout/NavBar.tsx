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
} from "../ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateProjectForm from "../project/CreateProjectForm";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import UserAvatar from "../ui/userAvatar";

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
  const handleOpenPopUp = () => {
    setisOpenPopUp(!isOpenPopUp);
  };
  const openAccountSettings = () => {
    navigate("/account-settings");
  };

  return (
    <div className="w-full h-14 z-10 fixed border-b-2 border-[#E2E8F0] flex items-center flex-col ">
      <div className="flex items-center w-full h-full justify-between sm:px-3 px-2">
        <div className="flex gap-5 items-center ">
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
                      } ${item.id === 1 && "md:flex"}`}
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
            </div>
          )}
        </div>
        <div className="flex md:gap-5 gap-2 items-center relative">
          <Button className="relative w-8 h-8 aspect-square rounded-full bg-transparent active:bg-primary-100 hover:bg-primary-100 md:block hidden cursor-pointer">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-1 left-1"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.58597 17.829C6.7717 18.0148 6.99221 18.1622 7.23492 18.2628C7.47762 18.3633 7.73776 18.4151 8.00047 18.4151C8.26318 18.4151 8.52332 18.3633 8.76602 18.2628C9.00873 18.1622 9.22924 18.0148 9.41497 17.829L6.58497 15C6.39917 15.1857 6.25178 15.4062 6.15122 15.6489C6.05065 15.8917 5.9989 16.1518 5.9989 16.4145C5.9989 16.6772 6.05065 16.9374 6.15122 17.1801C6.25178 17.4228 6.40017 17.6433 6.58597 17.829ZM11.384 5.478C11.8524 5.00875 12.4089 4.63663 13.0216 4.383C13.6342 4.12937 14.2909 3.99921 14.954 4C15.926 4 16.899 4.28 17.742 4.839C17.762 4.813 17.785 4.789 17.808 4.765C17.9043 4.66644 18.0197 4.58862 18.1472 4.53633C18.2747 4.48405 18.4116 4.45841 18.5493 4.46099C18.6871 4.46357 18.8229 4.49432 18.9484 4.55134C19.0738 4.60837 19.1863 4.69046 19.2788 4.79256C19.3713 4.89467 19.442 5.01463 19.4864 5.14507C19.5309 5.27551 19.5482 5.41366 19.5372 5.55103C19.5263 5.68839 19.4873 5.82206 19.4228 5.94382C19.3583 6.06558 19.2695 6.17284 19.162 6.259C19.8046 7.22976 20.0919 8.3928 19.9752 9.55112C19.8586 10.7094 19.3452 11.7918 18.522 12.615L17.797 13.34C17.015 14.123 15.984 15.55 15.485 16.547L13.976 19.563C13.727 20.063 13.203 20.147 12.805 19.75L4.24897 11.195C3.85197 10.798 3.94097 10.271 4.43597 10.023L7.45297 8.515C8.44197 8.021 9.87297 6.989 10.659 6.203L11.384 5.478ZM14.123 15.108C14.64 14.133 15.691 12.712 16.477 11.926L17.202 11.2C17.6984 10.7032 18.0081 10.0502 18.0786 9.35144C18.1491 8.65266 17.9762 7.95096 17.589 7.365C17.399 7.079 16.871 6.599 16.73 6.505C16.2308 6.17484 15.6454 5.99918 15.047 6C14.6466 5.99937 14.25 6.07785 13.88 6.23093C13.51 6.384 13.1739 6.60866 12.891 6.892L11.941 7.843C11.157 8.628 9.72197 9.663 8.73997 10.154L6.99997 11.024L13.07 17.093L14.123 15.108Z"
                fill="#44546F"
              />
            </svg>
          </Button>
          <Button className="relative w-8 h-8 aspect-square rounded-full bg-transparent active:bg-primary-100 hover:bg-primary-100 md:block hidden cursor-pointer">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 left-0"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 16C6 10.4767 10.4767 6 16 6C21.5233 6 26 10.4767 26 16C26 21.5233 21.5233 26 16 26C10.4767 26 6 21.5233 6 16ZM8 16C8 20.4188 11.5812 24 16 24C20.4188 24 24 20.4188 24 16C24 11.5812 20.4188 8 16 8C11.5812 8 8 11.5812 8 16ZM12 14C12 11.4838 14.3214 9.51108 16.9389 10.1071C18.3829 10.4351 19.5569 11.6051 19.8899 13.0481C20.3809 15.1771 19.1719 17.0911 17.3589 17.7471C17.1549 17.8201 17.0099 18.0021 17.0099 18.2191V18.0001C17.0099 18.5521 16.5629 19.0001 16.0099 19.0001C15.4579 19.0001 15.0099 18.5521 15.0099 18.0001V16.9871C15.0179 16.4411 15.4599 16.0001 15.9999 16.0001C17.1029 16.0001 17.9999 15.1021 17.9999 14.0001C17.9999 12.8971 17.1029 12.0001 15.9999 12.0001C14.8959 12.0001 13.9993 12.9231 14.0004 14.0271C13.9852 14.5666 13.5429 15 13 15C12.4777 15 12.0486 14.599 12.0038 14.0882C12.0038 14.0882 12 14.0297 12 14ZM16 22C15.448 22 15 21.552 15 21C15 20.448 15.448 20 16 20C16.552 20 17 20.448 17 21C17 21.552 16.552 22 16 22Z"
                fill="#44546F"
              />
            </svg>
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
                  <img src={Notification} className="mr-2 h-full w-full" />
                </div>
                <Button className="p-0 font-normal h-auto" variant={"ghost"}>
                  Notification
                </Button>
              </DropdownMenuItem>
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
