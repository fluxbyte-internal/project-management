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
  setData(dataSource);
  }, []);

  const columnDef: ColumeDef[] = [
    { key: "projectName", header: "Project Name", sorting: true },
    {
      key: "pm",
      header: "PM",
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
      onCellRender: (item: Project) => <>{dateFormater(`${item.startDate}`)}</>,
    },
    {
      key: "actualEndDate",
      header: "End Date",
      onCellRender: (item: Project) => (
        <>{dateFormater(`${item.actualEndDate}`)}</>
      ),
    },
    {
      key: "prograss",
      header: "Prograss",
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
      onCellRender: (item: Project) => (
        <>
          <button className="w-32 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
            Edit
          </button>
        </>
      ),
    },
  ];

const dataSource: Project[] = [
    {
      projectId: "67083a32-be83-4269-aa17-9b6ff7147bd5",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "Hello HelloHello Hel loHel loHel loHell oHello Hello Hello",
      projectDescription: "HRMS description",
      startDate: "2023-12-10T00:00:00.000Z",
      projectManager: "Jhon Dev",
      profile: "src/assets/png/profile.png",
      estimatedEndDate: "2023-11-22T00:00:00.000Z",
      actualEndDate: "2023-11-13T00:00:00.000Z",
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
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
      projectId: "bfe74e8a-e7cd-482a-afee-1de9788772b2",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "111",
      projectDescription: "HRMS description",
      startDate: "2023-12-08T00:00:00.000Z",
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
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
      projectId: "f67dbdf3-cdf1-4127-9b96-267e616f7252",
      organisationId: "61dd26ee-b064-43e9-b12f-21a7b7832737",
      projectName: "333",
      projectDescription: "HRMS description",
      startDate: "2023-12-04T00:00:00.000Z",
      estimatedEndDate: "2023-11-22T00:00:00.000Z",
      actualEndDate: "2023-11-17T00:00:00.000Z",
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
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
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
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
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
      progressionPercentage: "72",
      createdAt: "2023-11-20T11:47:48.785Z",
      updatedAt: "2023-11-20T11:47:48.785Z",
    },
    {
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
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
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
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
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
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
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
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
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
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
      profile: "src/assets/png/profile.png",
      projectManager: "Jhon Dev",
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

export default Projects;
