import PercentageCircle from "@/components/shared/PercentageCircle";
import Table, { ColumeDef } from "@/components/shared/Table";
import dateFormatter from "@/helperFuntions/dateFormater";
import useProjectQuery, { Project } from "../../api/query/useProjectQuery";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CreateUpdateProjectForm from "@/components/project/CreateProjectForm";
import NoProject from "../../components/project/NoProject";
import UserAvatar from "@/components/ui/userAvatar";
import BackgroundImage from "@/components/layout/BackgroundImage";
import Spinner from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, ScrollText, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProjectsList() {
  const [data, setData] = useState<Project[]>();
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [editData, setEditData] = useState<Project | undefined>();
  const navigate = useNavigate();

  const projectQuery = useProjectQuery();
  useEffect(() => {
    setData(projectQuery.data?.data.data);
  }, [projectQuery.data?.data.data]);

  const close = () => {
    setIsOpenPopUp(false);
    setEditData(undefined);
  };

  const handleView = (id:string) => {
    navigate("/project-details/" + id);
  };

  const columnDef: ColumeDef[] = [
    { key: "projectName", header: "Project Name", sorting: true },
    {
      key: "projectManager",
      header: "Manager",
      onCellRender: (item: Project) => (
        <>
          <UserAvatar user={item.createdByUser}/>
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
      onCellRender: (item:Project) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className=" cursor-pointer w-24 h-8 px-3 py-1.5 bg-white border rounded justify-center items-center gap-px inline-flex">
                <Settings className="mr-2 h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-11 flex flex-col gap-1">
              <DropdownMenuItem onClick={() => handleEdit(item)}>
                <Edit className="mr-2 h-4 w-4 text-[#44546F]" />
                <span className="p-0 font-normal h-auto" >
                  Edit
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-1"/>
              <DropdownMenuItem onClick={() => handleView(item.projectId)}>
                <ScrollText className="mr-2 h-4 w-4 text-[#44546F]" />
                <span className="p-0 font-normal h-auto" >
                   View Detail
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      {projectQuery.isLoading && (
        <div className="absolute w-full h-[calc(100vh-3.5rem)] grid z-20 place-content-center backdrop-blur-[0.5px] bg-[#7b797936]">
          <Spinner color="#F99807" className="h-20 w-20" />
        </div>
      )}
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
