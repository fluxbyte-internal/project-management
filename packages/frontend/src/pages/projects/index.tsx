import PercentageCircle from "@/components/shared/percentageCircle";
import Table, { ColumeDef } from "@/components/shared/table";
import dateFormater from "@/helperFuntions/dateFormater";
import useProjectQuary, { Project } from "../../api/query/useProjectQuery";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileName from "@/components/shared/profile";
function Projects() {
  const [data, setData] = useState<Project[]>();
  const projectQuary = useProjectQuary();
  useEffect(() => {
    setData(projectQuary.data?.data.data);
  }, [projectQuary.data?.data.data]);

  const columnDef: ColumeDef[] = [
    { key: "projectName", header: "Project Name", sorting: true },
    {
      key: "projectManager",
      header: "Manager",
      onCellRender: (item: Project) => (
        <>
          <ProfileName lable={item.projectManager} url={item.profile} />
        </>
      ),
    },
    {
      key: "status",
      header: "Status",
      onCellRender: (item: Project) => (
        <>
          <div className="w-32 h-8 px-3 py-1.5 bg-cyan-100 rounded justify-center items-center gap-px inline-flex">
            <div className="text-cyan-700 text-xs font-medium  leading-tight">
              {item.status}
            </div>
          </div>
        </>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      sorting: true,
      onCellRender: (item: Project) => (
        <>{dateFormater(new Date(item.startDate))}</>
      ),
    },
    {
      key: "actualEndDate",
      header: "End Date",
      onCellRender: (item: Project) => (
        <>
          {item.actualEndDate && dateFormater(new Date(item.actualEndDate))}
        </>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      onCellRender: (item: Project) => (
        <PercentageCircle percentage={item.progressionPercentage} />
      ),
    },
    {
      key: "estimatedBudget",
      header: "Budget",
      sorting: true,
    },
    {
      key: "Action",
      header: "Action",
      onCellRender: () => (
        <>
          <button className="w-32 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
            Edit
          </button>
        </>
      ),
    },
  ];

  
  return (
    <div className=" h-full py-5 p-4 lg:p-14  w-full bg-[url(/src/assets/png/background2.png)] bg-cover bg-no-repeat">
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-3xl leading-normal text-gray-600">
          Projects
        </h2>
        <div>
          <Button className="font-medium text-sm leading-normal rounded py-2 px-4 text-[#943B0C] bg-[#FFB819]">
            Add Project
          </Button>
        </div>
      </div>
      <div className="my-8 h-full">
        {data && <Table key="Project view" columnDef={columnDef} data={data} />}
      </div>
    </div>
  );
}

export default Projects;
