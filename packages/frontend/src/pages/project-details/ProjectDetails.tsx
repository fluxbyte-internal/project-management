import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import Cloudy from "../../assets/svg/cloudy.svg";
import Stormy from "../../assets/svg/stormy.svg";
import Sunny from "../../assets/svg/sunny.svg";
import Rainy from "../../assets/svg/Rainy.svg";
import useProjectDetail from "../../api/query/useProjectDetailQuery";
import { useNavigate, useParams } from "react-router-dom";
// import ClockProjectDetail from "../../assets/svg/ClockProjectDetail.svg";

// import InfoCircle from "../../assets/svg/Info circle.svg";
// import {
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Tooltip } from "@radix-ui/react-tooltip";
// import dateFormater from "@/helperFuntions/dateFormater";
import Loader from "@/components/common/Loader";
import CreateProjectNoPopUpForm from "@/components/project/CreateProjectNoPopupForm";
import { Project } from "@/api/query/useProjectQuery";
import { useUser } from "@/hooks/useUser";

function ProjectDetails() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };
  const { id } = useParams();
  const projectDetailQuery = useProjectDetail(id);
  // const labelstyle = "text-base font-medium text-gray-700";
  // const inputstyle = "mt-2.5 text-base font-normal text-[#9CA3AF]";
  const { user } = useUser();

  const HandleStatus = () => {
    switch (projectDetailQuery.data?.data.data.status) {
    case "NOT_STARTED":
      return "Not Started";
    case "ACTIVE":
      return "Active";
    case "ON_HOLD":
      return "On Hold";
    case "CLOSED":
      return "Closed";
    default:
      return "Not Started";
    }
  };


  const HandleOverallTrack = () => {
    switch (projectDetailQuery.data?.data.data.overallTrack) {
    case "STORMY":
      return <img src={Stormy} className="h-full w-full" />;
    case "CLOUDY":
      return <img src={Cloudy} className="h-full w-full" />;
    case "SUNNY":
      return <img src={Sunny} className="h-full w-full" />;
    case "RAINY":
      return <img src={Rainy} className="h-full w-full" />;

    default:
      return <img src={Sunny} className="h-full w-full" />;
    }
  };

  const handleProjectClick = () => {
    navigate("/projects");
  };
  // console.log('projectDetailQuery.data?.data.data',projectDetailQuery.data?.data.data);

  const verification = () => {
    if (user?.userOrganisation[0].role === "ADMINISTRATOR") {
      return true;
    } else {
      const projectMenager =
        projectDetailQuery.data?.data.data.assignedUsers.filter((item) => {
          if (item.user.userOrganisation[0].role === "PROJECT_MANAGER") {
            return item;
          }
        });
      const manager = projectMenager?.find(
        (manager) => manager?.user.userId === user?.userId
      );
      if (manager?.user.userId) {
        return true;
      }
    }
    return false;
  };
  const currentUserIsAdmin = verification();

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
            className={`mt-14 overflow-auto ${
              isSidebarExpanded ? "ml-64" : "ml-4"
            }`}
          >
            <div className="sm:px-10 px-3">
              <div>
                <div>
                  <div className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <div className="inline-flex items-center">
                      <div
                        onClick={handleProjectClick}
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white cursor-pointer"
                      >
                        Project
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <svg
                          className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 6 10"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="m1 9 4-4-4-4"
                          />
                        </svg>
                        <span className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">
                          {projectDetailQuery.data?.data.data.projectName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex sm:gap-5 gap-2 items-center flex-wrap justify-evenly sm:justify-normal sm:mt-5 mt-2 ">
                  <div className="sm:text-3xl text-xl  font-semibold">
                    Project Detail
                  </div>
                  <div className="h-10 w-12">
                    {HandleOverallTrack()}
                  </div>
                  <div className="bg-[#227D9B] sm:px-4  text-white text-sm font-normal rounded-md py-0.5 px-4">
                    {HandleStatus()}
                  </div>
                </div>
                <div className="my-4 border border-[#E2E8F0] rounded-lg sm:px-8 px-4 py-6">
                  <CreateProjectNoPopUpForm viewOnly={currentUserIsAdmin?false:true} refetch={projectDetailQuery.refetch} editData={projectDetailQuery.data?.data.data as unknown as Project}/>
                  <div>
                    {/* <div className="border-b-2 border-gray-100 my-3.5" />
                    <div className="sm:flex gap-8">
                      <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
                        <div className={labelstyle}>Start Date</div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 mt-2.5">
                            <img
                              src={ClockProjectDetail}
                              className="h-full w-full"
                            />
                          </div>
                          {projectDetailQuery.data?.data.data.startDate &&
                          new Date(
                            projectDetailQuery.data?.data.data.startDate
                          ) ? (
                              <div className={inputstyle}>
                                {dateFormater(
                                  new Date(
                                    projectDetailQuery.data?.data.data.startDate
                                  )
                                )}
                              </div>
                            ) : (
                              <div className={inputstyle}>DD/MM/YYYY</div>
                            )}
                        </div>
                      </div>

                      <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
                        <div className={labelstyle}>Estimated End Date</div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 mt-2.5">
                            <img
                              src={ClockProjectDetail}
                              className="h-full w-full"
                            />
                          </div>
                          {projectDetailQuery.data?.data.data
                            .estimatedEndDate &&
                          new Date(
                            projectDetailQuery.data?.data.data.estimatedEndDate
                          ) ? (
                              <div className={inputstyle}>
                                {dateFormater(
                                  new Date(
                                    projectDetailQuery.data?.data.data.estimatedEndDate
                                  )
                                )}
                              </div>
                            ) : (
                              <div className={inputstyle}>DD/MM/YYYY</div>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="sm:flex gap-8 mt-3.5">
                      <div className="sm:w-[50%] w-full mt-2 sm:mt-0 gap-2">
                        <div className="flex gap-2 items-center">
                          <div className={labelstyle}>Actual End Date</div>
                          <div className="flex items-center justify-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <img
                                    src={InfoCircle}
                                    className="h-[16px] w-[16px]"
                                    alt="InfoCircle"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Actual End Date will be calculated
                                    automatically
                                  </p>
                                  <p>
                                    based on the largest end date of its task
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 mt-2.5">
                            <img
                              src={ClockProjectDetail}
                              className="h-full w-full"
                            />
                          </div>
                          {projectDetailQuery.data?.data.data.startDate &&
                          new Date(
                            projectDetailQuery.data?.data.data.startDate
                          ) ? (
                              <div className={inputstyle}>
                                {dateFormater(
                                  new Date(
                                    projectDetailQuery.data?.data.data.startDate
                                  )
                                )}
                              </div>
                            ) : (
                              <div className={inputstyle}>DD/MM/YYYY</div>
                            )}
                        </div>
                      </div>
                      <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
                        <div className={labelstyle}>Actual Duration</div>
                        <div className="flex items-center gap-2.5">
                          <div className="w-4 h-4 mt-2.5">
                            <img
                              src={ClockProjectDetail}
                              className="h-full w-full"
                            />
                          </div>
                          {projectDetailQuery.data?.data.data.startDate &&
                          new Date(
                            projectDetailQuery.data?.data.data.startDate
                          ) ? (
                              <div className={inputstyle}>
                                {dateFormater(
                                  new Date(
                                    projectDetailQuery.data?.data.data.startDate
                                  )
                                )}
                              </div>
                            ) : (
                              <div className={inputstyle}>DD/MM/YYYY</div>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="border-b-2 border-gray-100 my-3.5" />
                    <div className="sm:flex gap-8">
                      <div className="sm:w-[50%] w-full">
                        <div className={labelstyle}>Project Budget</div>

                        <div className={inputstyle}>
                          0
                        </div>
                      </div>
                      <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
                        <div className={labelstyle}>Consumed Budget</div>

                        <div className={inputstyle}>
                          {projectDetailQuery.data?.data.data.actualCost
                            ? projectDetailQuery.data?.data.data.actualCost
                            : 0}
                        </div>
                      </div>
                    </div>
                    <div className="sm:flex gap-8 mt-3.5">
                      <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
                        <div className={labelstyle}>Schedule Trend</div>
                        <div className={inputstyle}>
                          lorem ipsum
                        </div>
                      </div>
                      <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
                        <div className={labelstyle}>Cost Trend</div>
                        <div className={inputstyle}>
                          lorem ipsum
                        </div>
                      </div>
                    </div> */}

                    {/* <div className="border-b-2 border-gray-100 my-6" />

                    <div className="sm:grid grid-cols-2 gap-3.5">
                      <div className="mt-4 sm:mt-0">
                        <div className={labelstyle}>Time Track</div>
                        <div>
                          <Progress
                            value={Number(
                              projectDetailQuery.data?.data.data.timeTrack
                            )}
                            className="w-[80%] mt-3"
                          />
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className={labelstyle}>Budget Track</div>
                        <div>
                          <Progress
                            value={Number(
                              projectDetailQuery.data?.data.data.budgetTrack
                            )}
                            className="w-[80%] mt-3"
                          />
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <div className={labelstyle}>Progress Percentage</div>
                        <div>
                          <Progress
                            value={Number(
                              projectDetailQuery.data?.data.data
                                .progressionPercentage
                            )}
                            className="w-[80%] mt-3"
                          />
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectDetails;
