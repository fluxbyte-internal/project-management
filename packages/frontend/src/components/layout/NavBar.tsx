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
import { Link } from "react-router-dom";
import CreateProjectForm from "../project/CreateProjectForm";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import AccountSettings from "../Account/AccountSettings";

const navbarData = [
  {
    id: 1,
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    id: 2,
    name: "Project",
    dropDown: [
      {
        id: 1,
        contentName: " Project 1",
        contentLink: "/projects",
      },
      {
        id: 2,
        contentName: " Project 2",
        contentLink: "/projects",
      },
      {
        id: 3,
        contentName: " Project 3",
        contentLink: "/projects",
      },
    ],
  },
];

function NavBar() {
  const [isOpenPopUp, setisOpenPopUp] = useState(false);
  const [isOpenAccountPopUp, setisOpenAccountPopUp] = useState(false);
  const { logout } = useAuth();
  const { user } = useUser();
  const handleOpenPopUp = () => {
    setisOpenPopUp(!isOpenPopUp);
  };
  const handleOpenAccountPopUp = () => {
    setisOpenAccountPopUp(!isOpenAccountPopUp);
  };

  return (
    <div className="w-full h-14   z-10  fixed border-b-2 border-[#E2E8F0] flex items-center flex-col ">
      <div className="flex items-center w-full h-full justify-between sm:px-3 px-2">
        <div className="flex gap-5  items-center ">
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
                      {item.dropDown ? (
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
                      <div className=" w-full h-full flex  aspect-square">
                        <img src={DownArrow} className=" w-full h-full  "></img>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-36">
                    {navbarData.map((item, index) => {
                      return (
                        <DropdownMenuItem className="p-0">
                          <div
                            key={index}
                            className={`flex justify-between text-sm font-medium text-gray-500 relative cursor-pointer p-1 w-full ${
                              item.id === 2 ? "lg:hidden" : ""
                            } ${item.id === 1 ? "md:hidden" : ""}`}
                          >
                            {item.dropDown ? (
                              <div className="flex items-center  justify-between  w-full gap-2">
                                <div className="text-sm font-medium text-gray-500 relative cursor-pointer">
                                  {item.name}
                                </div>
                                <div className=" h-full flex items-center aspect-square">
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

              <div className="lg:block hidden">
                <Button variant={"primary"} onClick={handleOpenPopUp}>
                  Create
                </Button>
              </div>
              <div className="block lg:hidden">
                <Button
                  variant={"primary"}
                  className="lg:px-1 md:py-1text-lg font-medium lg:h-12 lg:w-12 h-[30px] w-[30px]"
                  onClick={handleOpenPopUp}
                >
                  <span className="text-lg">+</span>
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex md:gap-5 gap-2 items-center relative cursor-pointer">
          <div className="w-8 h-8 aspect-square  rounded-full bg-primary-100 md:block hidden">
            <img
              src={Notification}
              className="w-full h-full justify-center flex p-1"
            ></img>
          </div>
          <div className="w-8 h-8 aspect-square cursor-pointer md:block hidden">
            <img src={Information} className="w-full h-full"></img>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 aspect-square rounded-full bg-primary-200 outline-none cursor-pointer">
                <span className="text-primary-800 text-sm font-bold flex justify-center items-center w-full h-full">
                  {user?.firstName ? user.firstName.charAt(0) : "A"}
                  {user?.lastName
                    ? user?.lastName.charAt(0)
                    : user?.firstName
                      ? user.firstName.charAt(1)
                      : "B"}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 flex flex-col gap-1">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleOpenAccountPopUp}
                className="flex md:hidden"
              >
                <div className="mr-2 h-5 w-5">
                  <img src={Notification} className="mr-2 h-full w-full" />
                </div>
                <button className="button">Notification</button>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleOpenAccountPopUp}
                className="flex md:hidden"
              >
                <div className="mr-2 h-5 w-5">
                  <img src={Information} className="mr-2 h-full w-full" />
                </div>
                <button className="button">Information</button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleOpenAccountPopUp}>
                <Settings className="mr-2 h-4 w-4" />
                <button className="button">Account Settings</button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <button className="button">Log out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isOpenPopUp && <CreateProjectForm handleClosePopUp={handleOpenPopUp} />}
      {isOpenAccountPopUp && (
        <AccountSettings handleCloseAccountPopUp={handleOpenAccountPopUp} />
      )}
    </div>
  );
}

export default NavBar;
