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
import { LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
    dropDown: [
      {
        id: 1,
        contentName: "Current Project",
        contentLink: "/project",
      },
      {
        id: 2,
        contentName: "Favourite Project",
        contentLink: "/project",
      },
      {
        id: 3,
        contentName: "Recents Project",
        contentLink: "/project",
      },
    ],
  },
];

function NavBar() {
  const [isOpenPopUp, setisOpenPopUp] = useState(false);
  const { logout } = useAuth();
  const {user} = useUser();
  const handleOpenPopUp = () => {
    setisOpenPopUp(!isOpenPopUp);
  };
  return (
    <div className="w-full h-14 z-10 fixed border-b-2 border-#E2E8F0 flex items-center flex-col ">
      <div className="flex items-center w-full h-full justify-between px-3 md:px-28">
        <div className="flex gap-10 justify-between overflow-hidden items-center">
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
                    <DropdownMenuContent className="w-40">
                      {item.dropDown.map(
                        ({ contentName, contentLink }, contentIndex) => (
                          <DropdownMenuItem key={contentIndex}>
                            <div className="flex justify-between items-center">
                              <div className="flex break-all">
                                {contentLink ? (
                                  <Link to={contentLink}>{contentName}</Link>
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
                <DropdownMenuItem className="flex-col justify-between ">
                  {navbarData.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`flex justify-between text-sm font-medium text-gray-500 relative cursor-pointer p-1 ${
                          item.id === 2 && "lg:hidden"
                        } ${item.id === 1 && "md:hidden"}`}
                      >
                        {item.dropDown ? (
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-500 relative cursor-pointer">
                              {item.name}
                            </div>
                            <div className="w-full h-full flex items-center aspect-square">
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
                    );
                  })}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="lg:block hidden">
            <Button
              variant={"none"}
              className="bg-primary-400 rounded-md px-3 py-2 text-primary-800 text-sm font-medium"
              onClick={handleOpenPopUp}
            >
              Create
            </Button>
          </div>
          <div className="block lg:hidden">
            <button
              className="bg-primary-400 rounded-md px-3 py-2 text-primary-800 text-lg font-medium h-12 w-12 hover:bg-primary-400"
              onClick={handleOpenPopUp}
            >
              <span className="flex justify-center items-center">+</span>
            </button>
          </div>
        </div>
        <div className="flex md:gap-5 gap-2 items-center relative cursor-pointer">
          <div className="w-8 h-8 aspect-square rounded-full bg-primary-100 ">
            <img
              src={Notification}
              className="w-full h-full justify-center flex p-1"
            ></img>
          </div>
          <div className="w-8 h-8 aspect-square cursor-pointer">
            <img src={Information} className="w-full h-full"></img>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-8 h-8 aspect-square rounded-full bg-primary-200 outline-none cursor-pointer">
                <span className="text-primary-800 text-sm font-bold flex justify-center items-center w-full h-full">
                  {user?.firstName ? user.firstName.charAt(0) : "A"}{user?.lastName ? user?.lastName.charAt(0) : user?.firstName ? user.firstName.charAt(1) : "B"}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
