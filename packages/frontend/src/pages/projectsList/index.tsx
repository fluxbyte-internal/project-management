import PercentageCircle from "@/components/shared/PercentageCircle";
import Table, { ColumeDef } from "@/components/shared/Table";
import dateFormatter from "@/helperFuntions/dateFormater";
import useProjectQuery, { Project } from "../../api/query/useProjectQuery";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ProfileName from "@/components/shared/Profile";
import CreateUpdateProjectForm from "@/components/project/CreateProjectForm";
import NoProject from "../../components/project/NoProject";
import BackgroundImage from "@/components/layout/BackgroundImage";
function ProjectsList() {
  const [data, setData] = useState<Project[]>();
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [editData, setEditData] = useState<Project | undefined>();

  const projectQuery = useProjectQuery();
  useEffect(() => {
    setData(projectQuery.data?.data.data);
  }, [projectQuery.data?.data.data]);

  const close = () => {
    setIsOpenPopUp(false);
    setEditData(undefined);
  };
  const columnDef: ColumeDef[] = [
    { key: "projectName", header: "Project Name", sorting: true },
    {
      key: "projectManager",
      header: "Manager",
      onCellRender: (item: Project) => (
        <>
          <ProfileName user={item.createdByUser} />
        </>
      ),
    },
    {
      key: "status",
      header: "Status",
      onCellRender: (item: Project) => (
        <>
          <div className="w-32 h-8 px-3 py-1.5 bg-cyan-100 rounded justify-center items-center gap-px inline-flex">
            <div className="text-cyan-700 text-xs font-medium leading-tight">
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
        <>{dateFormatter(new Date(item.startDate))}</>
      ),
    },
    {
      key: "actualEndDate",
      header: "End Date",
      onCellRender: (item: Project) => (
        <>{item.estimatedEndDate && dateFormatter(new Date(item.estimatedEndDate))}</>
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
      onCellRender: (item) => (
        <>
          <button
            onClick={() => handleEdit(item)}
            className="w-32 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex"
          >
            Edit
          </button>
        </>
      ),
    },
  ];

  const handleEdit = (item: Project) => {
    setIsOpenPopUp(true);
    setEditData(item);
  };

  return (
    <>
      <BackgroundImage />
      {data && data.length > 0 ? (
        <div className="h-full py-5 p-4 lg:p-14 w-full">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-3xl leading-normal text-gray-600">
              Projects
            </h2>
            <div>
              <Button variant={"primary"} onClick={() => setIsOpenPopUp(true)}>
                Add Project
              </Button>
            </div>
          </div>
          <div className="my-8 h-full">
            {data && (
              <Table key="Project view" columnDef={columnDef} data={data} />
            )}
            {!data && (
              <div className="flex justify-center p-3 w-full">
                No projects available
              </div>
            )}
          </div>
        </div>
      ) : (
        <NoProject />
      )}
      {isOpenPopUp && (
        <CreateUpdateProjectForm handleClosePopUp={close} editData={editData} />
      )}
    </>
  );
}

export default ProjectsList;
