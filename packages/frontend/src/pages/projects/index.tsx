import PercentageCircle from "@/components/shared/percentageCircle";
import Table, { columeDef } from "@/components/shared/table";
import dateFormater from "@/helperFuntions/dateFormater";
import useProjectMutation, {
  Project,
} from "../../api/mutation/useProjectMutation";
import { useEffect, useState } from "react";
function Projects() {
  const [data, setData] = useState<Project[]>();
  useEffect(() => {
    // getProjects();
    setData(dataSource);
  }, []);
  const projectMutation = useProjectMutation();
  const getProjects = () => {
    projectMutation
      .mutateAsync()
      .then((res) => {
        console.log(typeof res.data.data);
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const columnDef: columeDef[] = [
    { key: "projectName", label: "Project Name" },
    {
      key: "status",
      label: "Status",
      onCellRender: (item) => renderStuts(item),
    },
    {
      key: "startDate",
      label: "Start Date",
      onCellRender: (item) => dateFormater(item.startDate),
    },
    {
      key: "actualEndDate",
      label: "End Date",
      onCellRender: (item) => dateFormater(item.actualEndDate),
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

  const dataSource: Project[] = [
    {
      projectId: "67083a32-be83-4269-aa17-9b6ff7147bd5",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "Hello",
      projectDescription: "HRMS description",
      startDate: "2023-12-09T00:00:00.000Z",
      estimatedEndDate: "2023-11-22T00:00:00.000Z",
      actualEndDate: "2023-11-21T00:00:00.000Z",
      status: "NOT_STARTED",
      defaultView: "KANBAN",
      timeTrack: "0",
      budgetTrack: "1",
      estimatedBudget: "50000",
      actualCost: "48000",
      progressionPercentage: " 30",
      createdAt: "2023-11-20T12:08:09.122Z",
      updatedAt: "2023-11-20T12:09:56.432Z",
    },
    {
      projectId: "bfe74e8a-e7cd-482a-afee-1de9788772b2",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "111",
      projectDescription: "HRMS description",
      startDate: "2023-12-09T00:00:00.000Z",
      estimatedEndDate: "2023-11-22T00:00:00.000Z",
      actualEndDate: null,
      status: "NOT_STARTED",
      defaultView: "KANBAN",
      timeTrack: null,
      budgetTrack: null,
      estimatedBudget: "50000",
      actualCost: null,
      progressionPercentage: "20",
      createdAt: "2023-11-20T11:47:48.785Z",
      updatedAt: "2023-11-20T11:47:48.785Z",
    },
    {
      projectId: "f67dbdf3-cdf1-4127-9b96-267e616f7252",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "333",
      projectDescription: "HRMS description",
      startDate: "2023-12-09T00:00:00.000Z",
      estimatedEndDate: "2023-11-22T00:00:00.000Z",
      actualEndDate: "2023-11-21T00:00:00.000Z",
      status: "NOT_STARTED",
      defaultView: "KANBAN",
      timeTrack: "0",
      budgetTrack: "1",
      estimatedBudget: "50000",
      actualCost: "48000",
      progressionPercentage: " 90",
      createdAt: "2023-11-20T12:06:49.895Z",
      updatedAt: "2023-11-21T03:49:32.238Z",
    },
    {
      projectId: "67083a32-be83-4269-aa17-9b6ff7147bd5",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "Hello",
      projectDescription: "HRMS description",
      startDate: "2023-12-09T00:00:00.000Z",
      estimatedEndDate: "2023-11-22T00:00:00.000Z",
      actualEndDate: "2023-11-21T00:00:00.000Z",
      status: "NOT_STARTED",
      defaultView: "KANBAN",
      timeTrack: "0",
      budgetTrack: "1",
      estimatedBudget: "50000",
      actualCost: "48000",
      progressionPercentage: " 30",
      createdAt: "2023-11-20T12:08:09.122Z",
      updatedAt: "2023-11-20T12:09:56.432Z",
    },
    {
      projectId: "bfe74e8a-e7cd-482a-afee-1de9788772b2",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "111",
      projectDescription: "HRMS description",
      startDate: "2023-12-09T00:00:00.000Z",
      estimatedEndDate: "2023-11-22T00:00:00.000Z",
      actualEndDate: null,
      status: "NOT_STARTED",
      defaultView: "KANBAN",
      timeTrack: null,
      budgetTrack: null,
      estimatedBudget: "50000",
      actualCost: null,
      progressionPercentage: "20",
      createdAt: "2023-11-20T11:47:48.785Z",
      updatedAt: "2023-11-20T11:47:48.785Z",
    },
    {
      projectId: "f67dbdf3-cdf1-4127-9b96-267e616f7252",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "333",
      projectDescription: "HRMS description",
      startDate: "2023-12-09T00:00:00.000Z",
      estimatedEndDate: "2023-11-22T00:00:00.000Z",
      actualEndDate: "2023-11-21T00:00:00.000Z",
      status: "NOT_STARTED",
      defaultView: "KANBAN",
      timeTrack: "0",
      budgetTrack: "1",
      estimatedBudget: "50000",
      actualCost: "48000",
      progressionPercentage: " 90",
      createdAt: "2023-11-20T12:06:49.895Z",
      updatedAt: "2023-11-21T03:49:32.238Z",
    },
    {
      projectId: "67083a32-be83-4269-aa17-9b6ff7147bd5",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "Hello",
      projectDescription: "HRMS description",
      startDate: "2023-12-09T00:00:00.000Z",
      estimatedEndDate: "2023-11-22T00:00:00.000Z",
      actualEndDate: "2023-11-21T00:00:00.000Z",
      status: "NOT_STARTED",
      defaultView: "KANBAN",
      timeTrack: "0",
      budgetTrack: "1",
      estimatedBudget: "50000",
      actualCost: "48000",
      progressionPercentage: " 30",
      createdAt: "2023-11-20T12:08:09.122Z",
      updatedAt: "2023-11-20T12:09:56.432Z",
    },
    
  ];
  return (
    <div className=" h-full w-full bg-[url(/src/assets/png/background2.png)] bg-cover bg-no-repeat">
      <div className="mt-14 mx-14">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl leading-normal text-gray-600">
            Projects
          </h2>
          <div>
            <button className="font-medium text-sm leading-normal rounded py-2 px-4 text-[#943B0C] bg-[#FFB819]">
              Add Project
            </button>
          </div>
        </div>
        <div className="mt-8">
          {data && (
            <Table key="Project view" columnDef={columnDef} data={data} />
          )}
        </div>
      </div>
    </div>
  );
}

function renderProgress(props: Project) {
  const { progressionPercentage } = props;
  return (
    <div>
      <PercentageCircle percentage={progressionPercentage} />
    </div>
  );
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

export default Projects;
