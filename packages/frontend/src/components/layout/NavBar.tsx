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

const navbarData = [
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
];

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
                      <Link
                        to={item.link}
                        className="text-sm font-medium text-gray-500 relative cursor-pointer"
                      >
                        {item.name}
                      </Link>
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
                            <Link
                              to={item.link}
                              className="text-sm font-medium text-gray-500 relative cursor-pointer"
                            >
                              {item.name}
                            </Link>
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
        <div className="flex md:gap-5 gap-2 items-center relative cursor-pointer">
          <div className="w-8 h-8 aspect-square rounded-full bg-primary-100 md:block hidden">
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
              <DropdownMenuItem className="flex md:hidden">
                <div className="mr-2 h-5 w-5">
                  <img src={Notification} className="mr-2 h-full w-full" />
                </div>
                <button className="button">Notification</button>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex md:hidden">
                <div className="mr-2 h-5 w-5">
                  <img src={Information} className="mr-2 h-full w-full" />
                </div>
                <button className="button">Information</button>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openAccountSettings}>
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
    </div>
  );
}

export default NavBar;
