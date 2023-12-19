import z from "zod";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "../../assets/svg/Link.svg";
import PlusSvg from "../../assets/svg/Plus.svg";
import ErrorMessage from "../common/ErrorMessage";
import Select, { SingleValue } from "react-select";
import DownArrow from "../../assets/svg/DownArrow.svg";
import useAllTaskQuery from "@/api/query/useAllTaskQuery";
import { Task } from "@/api/mutation/useTaskCreateMutation";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TaskDependenciesEnumValue } from "@backend/src/schemas/enums";
import { dependenciesTaskSchema } from "@backend/src/schemas/taskSchema";
import useTaskDependenciesMutation from "@/api/mutation/useTaskDependenciesmutaion";

type Props = {
  task: Task;
  refetch: () => void;
};

type Options = { value: string | null; label: string };

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
  const [defaultValue, setdefaultValue] = useState<Options|undefined>();
  const [dependenciesShow, setDependenciesShow] = useState<boolean>(false);
  const taskDependenciesMutation = useTaskDependenciesMutation(props.task.taskId);

  const dependenciesOptions: typeof TaskDependenciesEnumValue = {
    BLOCKING: "BLOCKING",
    WAITING_ON: "WAITING_ON",
    NO_DEPENDENCIES: "NO_DEPENDENCIES",
  };

  useEffect(() => {
    dependenciesFormik.setValues({
      dependantTaskId: props.task.dependantTaskId,
      dependencies: props.task.dependencies,
    });
    setdefaultValue(
      dependencies()?.find((t) => t.value === props.task?.dependantTaskId)
    );
  }, [allTask.data]);

  const dependencies = (): Options[] => {
    const dependenciesArr: Options[] = [];
    allTask.data?.data.data.forEach((task) => {
      if (task.taskId !== props.task.taskId) {
        dependenciesArr.push({ label: task.taskName, value: task.taskId });
      }
    });
    return dependenciesArr;
  };

  const handleDependencies = (val: SingleValue<Options>) => {
    if (val) {
      dependenciesFormik.setFieldValue("dependantTaskId", val.value ?? null);
      if (!val.value) {
        dependenciesFormik.setFieldValue("dependencies", "NO_DEPENDENCIES");
      }
    }
  };

  const dependenciesFormik = useFormik<z.infer<typeof dependenciesTaskSchema>>({
    initialValues: {
      dependencies: "NO_DEPENDENCIES",
      dependantTaskId: "",
    },
    validationSchema: toFormikValidationSchema(dependenciesTaskSchema),
    onSubmit: (values) => {
      taskDependenciesMutation.mutate(values, {
        onSuccess(data) {
          props.refetch();
          toast.success(data.data.message);
        },
        onError(error) {
          toast.error(error.response?.data.message);
        },
      });
    },
  });

  return (
    <div>
      <div className="flex items-center gap-2.5 mt-4">
        <img src={Link} width={20} height={20} />
        <div>
          <div className="text-xl font-medium">Dependencies</div>
        </div>
        <Button variant={"ghost"} onClick={() => setDependenciesShow(true)}>
          <img src={PlusSvg} width={20} height={20} />
        </Button>
      </div>
      {(dependenciesShow || Boolean(props.task?.dependantTaskId)) && (
        <div className="flex gap-2 items-start mt-3 ">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="py-2 px-4 rounded-md text-sm font-medium bg-slate-100 hover:bg-slate-100/80 w-44 h-10">
                  <div className="flex items-center justify-between gap-4 w-full">
                    <div>{dependenciesFormik.values.dependencies}</div>
                    <div className="w-8 flex justify-end">
                      <img src={DownArrow}></img>
                    </div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44 bg-white shadow-md rounded-md">
                {Object.keys(dependenciesOptions).map((item: string, index) => {
                  return (
                    <DropdownMenuItem
                      className={`p-2 ${
                        dependenciesFormik.values.dependencies == item
                          ? "bg-gray-100"
                          : ""
                      }`}
                      key={index}
                      onClick={() => {
                        dependenciesFormik.setFieldValue(
                          "dependencies",
                          dependenciesOptions[
                            item as keyof typeof dependenciesOptions
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
                              item === dependenciesFormik.values.dependencies
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </div>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="w-full">
            {defaultValue && (
              <Select
                placeholder="Select tasks"
                styles={reactSelectStyle}
                defaultValue={defaultValue}
                options={dependencies()}
                onChange={handleDependencies}
              />
            )}
          </div>
        </div>
      )}
      <ErrorMessage>
        {dependenciesFormik.errors.dependencies &&
          dependenciesFormik.errors.dependencies}
      </ErrorMessage>
      <ErrorMessage>{dependenciesFormik.errors.dependantTaskId}</ErrorMessage>
      {(props.task.dependantTaskId !== dependenciesFormik.values.dependantTaskId ||
        props.task.dependencies !== dependenciesFormik.values.dependencies) && (
        <div className="flex justify-end">
          <div>
            <Button variant={"primary"} onClick={dependenciesFormik.submitForm}>
              submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDependencies;
