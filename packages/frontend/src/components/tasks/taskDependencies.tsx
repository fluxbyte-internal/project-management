import z from "zod";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { Button } from "../ui/button";
import Dialog from "../common/Dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import Link from "../../assets/svg/Link.svg";
import PlusSvg from "../../assets/svg/Plus.svg";
import ErrorMessage from "../common/ErrorMessage";
import Select, { SingleValue } from "react-select";
import TrashCan from "../../assets/svg/TrashCan.svg";
import DownArrow from "../../assets/svg/DownArrow.svg";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import { Task } from "@/api/mutation/useTaskCreateMutation";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TaskDependenciesEnumValue } from "@backend/src/schemas/enums";
import { dependenciesTaskSchema } from "@backend/src/schemas/taskSchema";
import useTaskDependenciesMutation from "@/api/mutation/useTaskDependenciesmutaion";
import useRemoveTaskDependenciesMutation from "@/api/mutation/useTaskRemoveDependencies";
import InputText from "../common/InputText";

type Props = {
  task: Task;
  endTask?: string;
  refetch: () => void;
  allowed?:boolean
};

type Options = { value: string; label: string };

const reactSelectStyle = {
  control: (
    provided: Record<string, unknown>,
    state: { isFocused: boolean }
  ) => ({
    ...provided,
    border: "1px solid #E7E7E7",
    outline: state.isFocused ? "2px solid #943B0C" : "1px solid #E7E7E7",
    boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
    "&:hover": {
      outline: state.isFocused ? "2px solid #943B0C" : "1px solid #E7E7E7",
      boxShadow: "0px 0px 0px #943B0C",
    },
  }),
};

function TaskDependencies(props: Props) {
  const allTask = useAllTaskQuery(props.task.projectId);
  const [dependenciesShow, setDependenciesShow] = useState<boolean>(
    Boolean(props.endTask) ?? false
  );
  const [showConfirmDelete, setShowConfirmDelete] = useState("");
  const taskDependenciesMutation = useTaskDependenciesMutation(
    props.task.taskId
  );
  const removeTaskDependenciesMutation = useRemoveTaskDependenciesMutation();
  const val = allTask.data?.data.data.find((d) => d.taskId == props.endTask);

  const [defaultsValue, setDefaultsValue] = useState<Options>(
    val ? { label: val?.taskName, value: val?.taskId } : ({} as Options)
  );
  const dependencies = (): Options[] => {
    const dependenciesArr: Options[] = [{ label: "select", value: "" }];
    allTask.data?.data.data.forEach((task) => {
      if (
        task.taskId !== props.task.taskId &&
        task.parentTaskId !== props.task.taskId
      ) {
        if (
          !props.task.dependencies.some(
            (e) => e.dependendentOnTaskId === task.taskId
          )
        ) {
          dependenciesArr.push({ label: task.taskName, value: task.taskId });
        }
      }
    });
    return dependenciesArr;
  };

  const handleDependencies = (val: SingleValue<Options>) => {
    if (val) {
      setDefaultsValue({ label: val.label, value: val.value });
      dependenciesFormik.setFieldValue(
        "dependendentOnTaskId",
        val.value ?? null
      );
      if (!val.value) {
        dependenciesFormik.setFieldValue(
          "dependentType",
          TaskDependenciesEnumValue.BLOCKING
        );
      }
    }
  };

  const dependenciesFormik = useFormik<z.infer<typeof dependenciesTaskSchema>>({
    initialValues: {
      dependentType: TaskDependenciesEnumValue.BLOCKING,
      dependendentOnTaskId: props.endTask ? defaultsValue.value : "",
    },
    validationSchema: toFormikValidationSchema(dependenciesTaskSchema),
    onSubmit: (values) => {
      taskDependenciesMutation.mutate(values, {
        onSuccess(data) {
          props.refetch();
          setDefaultsValue({ label: "select", value: "" });
          setDependenciesShow(false);
          toast.success(data.data.message);
          dependenciesFormik.resetForm();
        },
        onError(error) {
          toast.error(error.response?.data.message == "Unauthorized" ? "You are not authorized to edit tasks which are not assigned to you":error.response?.data.message);
        },
      });
    },
  });

  const removeDependency = () => {
    removeTaskDependenciesMutation.mutate(showConfirmDelete, {
      onSuccess(data) {
        props.refetch();
        toast.success(data.data.message);
        setShowConfirmDelete("");
      },
      onError(error) {
        toast.error(error.response?.data.message == "Unauthorized" ? "You are not authorized to edit tasks which are not assigned to you":error.response?.data.message);
        setShowConfirmDelete("");
      },
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 mt-4">
        <img src={Link} width={20} height={20} />
        <div>
          <div className="text-xl font-medium">Dependencies</div>
        </div>
        {(!dependenciesShow && props.allowed) && (
          <Button variant={"ghost"} onClick={() => setDependenciesShow(true)}>
            <img src={PlusSvg} width={20} height={20} />
          </Button>
        )}
      </div>
      {Boolean(
        props.task?.dependencies && props.task?.dependencies.length > 0
      ) &&
        props.task?.dependencies.map((dependency) => {
          return (
            <div className="flex gap-2 items-center mt-3 ">
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild disabled>
                    <div className="py-2 px-4 rounded-md text-sm font-medium bg-slate-100 hover:bg-slate-100/80 w-44 h-10">
                      <div className="flex items-center justify-between gap-4 w-full">
                        <div>{dependency.dependentType}</div>
                        <div className="w-8 flex justify-end">
                          <img src={DownArrow}></img>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-44 bg-white shadow-md rounded-md">
                    {Object.keys(TaskDependenciesEnumValue).map(
                      (item: string, index) => {
                        return (
                          <DropdownMenuItem
                            className={`p-2 ${
                              dependency.dependentType == item
                                ? "bg-gray-100"
                                : ""
                            }`}
                            key={index}
                          >
                            <div
                              className={`flex justify-between text-sm font-medium text-gray-500 relative cursor-pointer p-1 w-full`}
                            >
                              <div className="flex items-center justify-between w-full gap-2">
                                <div className="text-sm font-medium text-gray-500 relative cursor-pointer">
                                  {item}
                                </div>
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    item === dependency.dependentType
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </div>
                            </div>
                          </DropdownMenuItem>
                        );
                      }
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="w-full">
                {dependency.dependentOnTask?.taskId && (
                  <InputText className="py-0 h-10 mt-0" value={dependency.dependentOnTask?.taskName} disabled/>
                )}
              </div>
              <div>
                <Button
                  variant={"none"}
                  className="p-0 h-6 w-6"
                  onClick={() =>
                    setShowConfirmDelete(dependency.taskDependenciesId)
                  }
                >
                  <img src={TrashCan} />
                </Button>
              </div>
            </div>
          );
        })}
      {dependenciesShow && (
        <>
          <div className="flex gap-2 items-start mt-3 ">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="py-2 px-4 rounded-md text-sm font-medium bg-slate-100 hover:bg-slate-100/80 w-44 h-10">
                    <div className="flex items-center justify-between gap-4 w-full">
                      <div>{dependenciesFormik.values.dependentType}</div>
                      <div className="w-8 flex justify-end">
                        <img src={DownArrow}></img>
                      </div>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44 bg-white shadow-md rounded-md">
                  {Object.keys(TaskDependenciesEnumValue).map(
                    (item: string, index) => {
                      return (
                        <DropdownMenuItem
                          className={`p-2 ${
                            dependenciesFormik.values.dependentType == item
                              ? "bg-gray-100"
                              : ""
                          }`}
                          key={index}
                          onClick={() => {
                            dependenciesFormik.setFieldValue(
                              "dependentType",
                              TaskDependenciesEnumValue[
                                item as keyof typeof TaskDependenciesEnumValue
                              ]
                            );
                          }}
                        >
                          <div
                            className={`flex justify-between text-sm font-medium text-gray-500 relative cursor-pointer p-1 w-full`}
                          >
                            <div className="flex items-center justify-between w-full gap-2">
                              <div className="text-sm font-medium text-gray-500 relative cursor-pointer">
                                {item}
                              </div>
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  item ===
                                    dependenciesFormik.values.dependentType
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          </div>
                        </DropdownMenuItem>
                      );
                    }
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-full">
              <Select
                placeholder="Select tasks"
                styles={reactSelectStyle}
                defaultValue={defaultsValue}
                options={dependencies()}
                onChange={handleDependencies}
                isDisabled={Boolean(props.endTask)}
              />
            </div>
          </div>
          <ErrorMessage>
            {dependenciesFormik.errors.dependentType &&
              dependenciesFormik.errors.dependentType}
          </ErrorMessage>
          <ErrorMessage>
            {dependenciesFormik.errors.dependendentOnTaskId}
          </ErrorMessage>
          <div className="flex justify-end gap-2">
            <div>
              <Button
                variant={"secondary"}
                onClick={() => {
                  dependenciesFormik.resetForm(), setDependenciesShow(false);
                }}
              >
                Cancel
              </Button>
            </div>
            <div>
              <Button
                variant={"primary_outline"}
                onClick={dependenciesFormik.submitForm}
              >
                Create
              </Button>
            </div>
          </div>
        </>
      )}
      <Dialog
        isOpen={showConfirmDelete ? true : false}
        onClose={() => {}}
        modalClass="rounded-lg"
      >
        <div className="flex flex-col gap-2 p-6 ">
          <img src={TrashCan} className="w-12 m-auto" /> Are you sure you want
          to delete ?
          <div className="flex gap-2 ml-auto">
            <Button
              variant={"outline"}
              isLoading={removeTaskDependenciesMutation.isPending}
              disabled={removeTaskDependenciesMutation.isPending}
              onClick={() => setShowConfirmDelete("")}
            >
              Cancel
            </Button>
            <Button variant={"primary"} onClick={removeDependency}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default TaskDependencies;
