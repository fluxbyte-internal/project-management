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
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-full h-14 bg-primary-50 shadow-side z-10  fixed border-b-2 border-primary-200 flex items-center flex-col ">
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
                        <div className="text-sm font-medium text-primary-900 relative cursor-pointer">
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
                    className="text-sm font-medium text-primary-900 relative cursor-pointer"
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
                  <div className="text-sm font-medium text-primary-900 cursor-pointer">
                    More
                  </div>
                  <div className=" w-full h-full flex  aspect-square">
                    <img src={DownArrow} className=" w-full h-full  "></img>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36">
                <DropdownMenuItem className="flex-col justify-between ">
                  {navbarData.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`flex justify-between text-sm font-medium text-primary-900 relative cursor-pointer p-1 ${
                          item.id === 2 && "lg:hidden"
                        } ${item.id === 1 && "md:hidden"}`}
                      >
                        {item.dropDown ? (
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-primary-900 relative cursor-pointer">
                              {item.name}
                            </div>
                            <div className="w-full h-full flex items-center aspect-square">
                              <img src={DownArrow} alt="Dropdown Arrow" />
                            </div>
                          </div>
                        ) : (
                          <Link
                            to={item.link}
                            className="text-sm font-medium text-primary-900 relative cursor-pointer"
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
            <Button className="bg-gradient-to-t from-[#227D9B]  to-[#0C66E4] rounded-md px-3 py-2 text-white text-sm font-medium">
              Create
            </Button>
          </div>
          <div className="block lg:hidden">
            <button className="bg-gradient-to-t from-[#227D9B] to-[#0C66E4] rounded-md  text-white text-lg font-medium h-12 w-12">
              <span className="flex justify-center items-center">+</span>
            </button>
          </div>
        </div>
        <div className="flex md:gap-5 gap-2 items-center relative cursor-pointer">
          <div className="w-8 h-8 aspect-square  rounded-full bg-primary-400 ">
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
              <div className="w-8 h-8 aspect-square rounded-full bg-primary-100 outline-none cursor-pointer">
                <span className="text-blue-500 text-sm font-bold flex justify-center items-center w-full h-full">
                  SA
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <button className="button">Log out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
