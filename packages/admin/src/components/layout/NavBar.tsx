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
import { Link, useNavigate } from "react-router-dom";
import UserAvatar from "../ui/userAvatar";
import { useAuth } from "../../hooks/useAuth";
import { useUser } from "../../hooks/useUser";

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
    name: "Organisations",
    link: "/",
  },
  {
    id: 2,
    name: "Operators",
    link: "/operators",
  },
] as NavItemType[];

function NavBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useUser();
  const openAccountSettings = () => {
    navigate("/account-settings");
  };
  return (
    <div className="w-full h-14 z-10 fixed border-b-2 border-[#E2E8F0] flex items-center flex-col bg-white">
      <div className="flex items-center w-full h-full justify-between sm:px-3 px-2">
        <div className="flex gap-5 items-center ">
          {user && (
            <div className="flex gap-5 justify-between overflow-hidden items-center">
              <div className="flex gap-5">
                {navbarData.map((item, index) => {
                  return (
                    <div key={index} className="">
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
            </div>
          )}
        </div>
        <div className="flex md:gap-5 gap-2 items-center relative">
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
    </div>
  );
}

export default NavBar;
