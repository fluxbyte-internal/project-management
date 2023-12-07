import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import cloudProjectDeatil from "../../assets/svg/CloudProjectDetail.svg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import useProjectDetail from "../../api/query/useProjectDetailQuery";
import { useParams } from "react-router-dom";
import ClockProjectDetail from "../../assets/svg/ClockProjectDetail.svg";

import InfoCircle from "../../assets/svg/Info circle.svg";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tooltip } from "@radix-ui/react-tooltip";
import dateFormater from "@/helperFuntions/dateFormater";

function ProjectDetails() {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };
  const { id } = useParams();
  const projectDetailQuery = useProjectDetail(id);

  const labelstyle ="text-base font-medium text-gray-700";
  const inputstyle ="mt-2.5 text-base font-normal text-[#9CA3AF]";

  const HandleStatus = () => {
    switch (projectDetailQuery.data?.data.data.status) {
    case "NOT_STARTED":
      return "Not Started";
    case "IN_REVIEW":
      return "In Review";
    default:
      return "Not Started";
    }
  };
  const HandleOverallTrack = (value: string) => {
    switch (value) {
    case "STORMY":
      return <img src={cloudProjectDeatil} className="h-full w-full" />;
    case "CLOUDY":
      return <img src={cloudProjectDeatil} className="h-full w-full" />;
    case "SUNNY":
      return <img src={cloudProjectDeatil} className="h-full w-full" />;

    default:
      return <img src={cloudProjectDeatil} className="h-full w-full" />;
    }
  };

  return (
    <div className="w-full">
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
            <div className="flex sm:gap-9 gap-2 items-center flex-wrap justify-evenly sm:justify-normal">
              <div className="sm:text-3xl text-xl  font-semibold">
                Project Detail
              </div>
              <div className="h-10 w-12">{HandleOverallTrack("STORMY")}</div>
              <div className="bg-[#227D9B] sm:px-4  text-white text-sm font-normal rounded-md py-0.5 px-4">
                {HandleStatus()}
              </div>
            </div>
            <div className="my-4 border border-[#E2E8F0] rounded-lg sm:px-8 px-4 py-6">
              <div>
                <div className="text-base font-medium text-[#44546F]">
                  Description
                </div>
                <p className="text-base font-normal text-[#9CA3AF] mt-2.5 mb-[20px] line-clamp-4">
                  {projectDetailQuery.data?.data.data.projectDescription}
                </p>
              </div>
              <div>
                <form>
                  <div className="sm:flex gap-8">
                    <div className="sm:w-[50%] w-full">
                      <div className={labelstyle}>Status</div>
                      <Select disabled>
                        <SelectTrigger className="w-full mt-2.5">
                          <SelectValue
                            className="text-gray-300 text-base font-normal"
                            placeholder={
                              projectDetailQuery.data?.data.data.status ===
                              "NOT_STARTED"
                                ? "Not Started"
                                : projectDetailQuery.data?.data.data.status ===
                                  "IN_REVIEW"
                                  ? "In Review"
                                  : projectDetailQuery.data?.data.data.status ===
                                  "IN_PROGRESS"
                                    ? "In Progress"
                                    : projectDetailQuery.data?.data.data.status ===
                                  "COMPLETED"
                                      ? "Completed"
                                      : ""
                            }
                          ></SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="NOT_STARTED">
                              Not started
                            </SelectItem>
                            <SelectItem value="IN_REVIEW">In Review</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
                      <div className={labelstyle}>Overall track</div>
                      <Select disabled>
                        <SelectTrigger className="w-full mt-2.5">
                          <SelectValue
                            placeholder="Stormy"
                            className="text-gray-300 text-base font-normal"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="Test 1">Test 1</SelectItem>
                            <SelectItem value="Test 2">Test 2</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </form>

                <div className="border-b-2 border-gray-100 my-3.5"/>

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
                      new Date(projectDetailQuery.data?.data.data.startDate) ? (
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
                      {projectDetailQuery.data?.data.data.estimatedEndDate &&
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
                                Actual End Date will be calculated automatically
                              </p>
                              <p>based on the largest end date of its task</p>
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
                      new Date(projectDetailQuery.data?.data.data.startDate) ? (
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
                      new Date(projectDetailQuery.data?.data.data.startDate) ? (
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
                <div className="border-b-2 border-gray-100 my-3.5"/>

                <div className="sm:flex gap-8">
                  <div className="sm:w-[50%] w-full">
                    <div className={labelstyle}>Project Budget</div>

                    <div className={inputstyle}>
                      {/* {projectDetailQuery.data?.data.data.projectBudget
                        ? projectDetailQuery.data?.data.data.projectBudget
                        : 0} */}
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
                      {/* {projectDetailQuery.data?.data.data.ScheduleTrend
                        ? projectDetailQuery.data?.data.data.ScheduleTrend
                        : "lorem ipsum"} */}
                      lorem ipsum
                    </div>
                  </div>
                  <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
                    <div className={labelstyle}>Cost Trend</div>

                    <div className={inputstyle}>
                      {/* {projectDetailQuery.data?.data.data.CostTrend
                        ? projectDetailQuery.data?.data.data.CostTrend
                        : "lorem ipsum"} */}
                      lorem ipsum
                    </div>
                  </div>
                </div>

                <div className="border-b-2 border-gray-100 my-6"/>

                <div className="sm:grid grid-cols-2 gap-3.5">
                  <div className="mt-4 sm:mt-0">
                    <div className={labelstyle}>Time Track</div>
                    <div>
                      <Progress
                        value={Number(projectDetailQuery.data?.data.data.timeTrack)}
                        className="w-[80%] mt-3"
                      />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className={labelstyle}>Budget Track</div>
                    <div>
                      <Progress
                        value={Number(projectDetailQuery.data?.data.data.budgetTrack)}
                        className="w-[80%] mt-3"
                      />
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className={labelstyle}>Progress Percentage</div>
                    <div>
                      <Progress
                        value={
                          Number(projectDetailQuery.data?.data.data
                            .progressionPercentage)
                        }
                        className="w-[80%] mt-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;