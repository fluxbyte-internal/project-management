import PercentageCircle from "@/components/shared/percentageCircle";
import Table, { columeDef } from "@/components/shared/table";
import dateFormater from "@/helperFuntions/dateFormater";
import useProjectMutation, {
  Project,
} from "../../api/mutation/useProjectMutation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
function Projects() {
  const [data, setData] = useState<Project[]>();
  useEffect(() => {
    projectMutation
      .mutateAsync()
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const projectMutation = useProjectMutation();

  const columnDef: columeDef[] = [
    { key: "projectName", label: "Project Name" },
    {
      key: "pm",
      label: "PM",
      onCellRender: (item) => renderPm(item),
    },
    {
      key: "status",
      label: "Status",
      onCellRender: (item) => renderStuts(item),
    },
    {
      key: "startDate",
      label: "Start Date",
      onCellRender: (item) => startDateFormate(item),
    },
    {
      key: "actualEndDate",
      label: "End Date",
      onCellRender: (item) => endDateFormate(item),
    },
    {
      key: "prograss",
      label: "Prograss",
      onCellRender: (item) => renderProgress(item),
    },
    {
      key: "Action",
      label: "Action",
      onCellRender: (item) => renderEdit(item),
    },
  ];

  return (
    <div className=" h-full py-5 p-4 lg:p-14  w-full bg-[url(/src/assets/png/background2.png)] bg-cover bg-no-repeat">
      <div className="flex justify-between items-center">
        <h2 className="font-medium text-2xl leading-normal text-gray-600">
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

function startDateFormate(props: Project) {
  const { startDate } = props;
  return <>{dateFormater(startDate)}</>;
}
function endDateFormate(props: Project) {
  const { estimatedEndDate } = props;
  return <>{dateFormater(estimatedEndDate)}</>;
}

function renderProgress(props: Project) {
  const { progressionPercentage } = props;
  return <PercentageCircle percentage={progressionPercentage} />;
}

function renderStuts(props: Project) {
  const { status } = props;
  return (
    <div className="w-32 h-8 px-3 py-1.5 bg-cyan-100 rounded justify-center items-center gap-px inline-flex">
      <div className="text-cyan-700 text-xs font-medium  leading-tight">
        {status}
      </div>
    </div>
  );
}
function renderEdit(props: Project) {
  return (
    <button className="w-32 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
      Edit
    </button>
  );
}
function renderPm(props: Project) {
  const projectManager = "Jhon Dev";
  const name =
    projectManager.split(" ")[0].charAt(0) +
    projectManager.split(" ")[1].charAt(0);
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center w-fit gap-3">
      <div className="rounded-full font-bold text-xl bg-[#FFE388] h-11 w-11 flex justify-center items-center  text-yellow-900">
        {name}
      </div>
      <div className="text-sm font-medium w">{projectManager}</div>
    </div>
  );
}

export default Projects;
