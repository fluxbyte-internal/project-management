import z from "zod";
import { cn } from "@/lib/utils";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { CheckIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { Button } from "../ui/button";
import TaskComment from "./taskComment";
import UserAvatar from "../ui/userAvatar";
import InputText from "../common/InputText";
import TaskAttachment from "./taskAttachment";
import TaskDependencies from "./taskDependencies";
import ErrorMessage from "../common/ErrorMessage";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  createTaskSchema,
  milestoneTaskSchema,
} from "../../../../backend/src/schemas/taskSchema";
import { Calendar } from "@/components/ui/calendar";

import { useUser } from "@/hooks/useUser";
import useTaskQuery from "@/api/query/useTaskQuery";
import dateFormater from "@/helperFuntions/dateFormater";
import useTaskAddMembersMutation from "@/api/mutation/useTaskAddMember";
import useTaskMemberListQuery from "@/api/query/useTaskMemberListQuary";
import useCreateTaskMutation from "@/api/mutation/useTaskCreateMutation";
import useUpdateTaskMutation from "@/api/mutation/useTaskUpdateMutation";
import useRemoveTaskMemberMutation from "@/api/mutation/useTaskRemoveMember";
import { UserOrganisationType } from "@/api/query/useOrganisationDetailsQuery";
import useTaskAttechmentAddMutation from "@/api/mutation/useTaskAttechmentAddMutation";
import useTaskAddUpdateMilestoneMutation from "@/api/mutation/useTaskAddUpdateMilestone";

import Tag from "../../assets/svg/Tag.svg";
import Users from "../../assets/svg/Users.svg";
import Route from "../../assets/svg/Route.svg";
import TaskSvg from "../../assets/svg/Task.svg";
import PlusSvg from "../../assets/svg/Plus.svg";
import Edit from "../../assets/svg/EditPen.svg";
// import Clock from "../../assets/svg/Clock.svg";
import Folder from "../../assets/svg/Folders.svg";
import Close from "../../assets/svg/CrossIcon.svg";
import SubTask from "../../assets/svg/SubTask.svg";
import MultiLine from "../../assets/svg/MultiLine.svg";
import PapperClip from "../../assets/svg/Paperclip.svg";
import InfoCircle from "../../assets/svg/Info circle.svg";
import TopRightArrow from "../../assets/svg/TopRightArrow.svg";
import BackIcon from "../../assets/svg/BackIcon.svg";
import CalendarIcon from "../../assets/svg/Calendar.svg";
import InputNumber from "@/components/common/InputNumber";
import TaskHistory from "./taskHistory";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  TaskStatusEnumValue,
  UserRoleEnumValue,
} from "@backend/src/schemas/enums";
import useTaskStatusUpdateMutation from "@/api/mutation/useTaskStatusUpdateMutation";
import useProjectQuery from "@/api/query/useProjectQuery";
import { Slider } from "../ui/slider";
import Loader from "../common/Loader";

type Props = {
  projectId: string | undefined;
  taskId?: string | undefined;
  close: () => void;
  initialValues?: { startDate: Date | undefined; taskId?: string };
  createSubtask?: string;
};

function TaskSubTaskForm(props: Props) {
  const currantUser = useUser();
  const [subTask, setSubtask] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [taskNameField, setTaskNameField] = useState(false);
  const [taskDurationField, setTaskDurationField] = useState(false);
  const [taskId, setTaskId] = useState<string>(props.taskId ?? "");
  const [subTaskFieldShow, setSubTaskFieldShow] = useState<boolean>(false);
  const [member, setMambers] = useState<UserOrganisationType["user"][]>([]);
  const [attachmentUploading, setAttachmentUploading] =
    useState<boolean>(false);
  const taskQuery = useTaskQuery(taskId);
  const taskMemberList = useTaskMemberListQuery(props.projectId ?? "");
  const taskUpdateMutation = useUpdateTaskMutation(taskId);
  const taskRemoveMembersMutation = useRemoveTaskMemberMutation();
  const taskAddMembersMutation = useTaskAddMembersMutation(taskId);
  let tasks =
    taskQuery.data?.data.data && taskId ? taskQuery.data?.data.data : undefined;
  // const [tasks, setTasks] = useState<Task>();
  const [slider, setSlider] = useState(Number(tasks?.completionPecentage));
  const taskAttachmentAddMutation = useTaskAttechmentAddMutation(taskId);
  const taskCreateMutation = useCreateTaskMutation(
    props.projectId,
    props.createSubtask ? props.createSubtask : taskId ? taskId : ""
  );
  const taskAddUpdateMilestoneMutation =
    useTaskAddUpdateMilestoneMutation(taskId);
  useEffect(() => {
    if (taskQuery.status == "success") {
      setSlider(Number(taskQuery.data?.data.data?.completionPecentage));
    }
  }, [taskQuery.data?.data.data]);

  useEffect(() => {
    refetch();
  }, [taskId]);
  const [submitbyButton, setSubmitbyButton] = useState(false);
  const projects = useProjectQuery();
  const user = useUser();
  const [startDate, setStartDate] = useState<Date>(new Date());
  useEffect(() => {
    if (taskId && tasks) {
      taskFormik.setValues({
        taskName: tasks.taskName,
        taskDescription: tasks.taskDescription,
        startDate: tasks.startDate,
        duration: tasks.duration,
      });
      milestoneFormik.setValues({
        milestoneIndicator: tasks.milestoneIndicator,
      });
      setMambers(
        tasks.assignedUsers.map((u) => {
          return u.user;
        })
      );
    }

    if (projects.data?.data.data) {
      setStartDate(
        new Date(
          projects.data?.data.data.find((p) => p.projectId == props.projectId)
            ?.startDate ?? new Date()
        )
      );
    }
  }, [taskId, taskQuery.data, projects.data?.data.data]);

  const allowed = () => {
    if (
      user.user?.userOrganisation[0].role == UserRoleEnumValue.TEAM_MEMBER &&
      tasks?.createdByUserId == user.user?.userId
    ) {
      return true;
    } else if (
      user.user?.userOrganisation[0].role ==
        UserRoleEnumValue.PROJECT_MANAGER ||
      user.user?.userOrganisation[0].role == UserRoleEnumValue.ADMINISTRATOR
    ) {
      return true;
    } else if (!taskId) {
      return true;
    } else {
      return false;
    }
  };

  const taskFormik = useFormik<z.infer<typeof createTaskSchema>>({
    initialValues: {
      taskName: "",
      taskDescription: "",
      startDate: props.initialValues?.startDate
        ? new Date(props.initialValues?.startDate)
        : new Date(
            projects.data?.data.data.find((p) => p.projectId == props.projectId)
              ?.startDate ?? new Date()
          ),
      duration: 1.0,
    },
    validationSchema: toFormikValidationSchema(createTaskSchema),
    onSubmit: (values) => {
      if (taskId) {
        if (
          values.duration !== tasks?.duration ||
          values.startDate !== tasks?.startDate ||
          values.taskDescription !== tasks.taskDescription ||
          values.taskName !== tasks.taskName
        ) {
          let data;
          if (values.duration === tasks?.duration) {
            data = {
              taskName: values.taskName,
              startDate: values.startDate,
              taskDescription: values.taskDescription,
            };
          } else {
            data = values;
          }
          taskUpdateMutation.mutate(data, {
            onSuccess(data) {
              toast.success(data.data.message);
              if (submitbyButton) {
                props.close();
              }
              taskQuery.refetch();
            },
            onError(error) {
              taskQuery.refetch();
              toast.error(
                error.response?.data.message == "Unauthorized"
                  ? "You are not authorized to edit tasks which are not assigned to you"
                  : error.response?.data.message
              );
            },
          });
        } else {
          props.close();
        }
      } else {
        taskCreateMutation.mutate(values, {
          onSuccess(data) {
            setTaskId(data.data.data.taskId);
            toast.success(data.data.message);
            taskQuery.refetch();
          },
          onError(error) {
            taskQuery.refetch();
            toast.error(error.response?.data.message);
          },
        });
      }
    },
  });

  const milestoneFormik = useFormik<z.infer<typeof milestoneTaskSchema>>({
    initialValues: {
      milestoneIndicator: false,
    },
    validationSchema: toFormikValidationSchema(milestoneTaskSchema),
    onSubmit: (values) => {
      milestoneSubmit(values);
    },
  });
  const milestoneSubmit = (values: z.infer<typeof milestoneTaskSchema>) => {
    taskAddUpdateMilestoneMutation.mutate(values, {
      onSuccess(data) {
        toast.success(data.data.message);
        refetch();
      },
      onError(error) {
        toast.error(error.response?.data.message);
      },
    });
  };
  const milestoneHandlechange = (e: boolean) => {
    milestoneFormik.setFieldValue("milestoneIndicator", e);
    if (!e) {
      milestoneSubmit({ milestoneIndicator: false });
    }
  };

  const createSubTask = () => {
    const value = {
      taskName: subTask,
      taskDescription: "",
      startDate: new Date(tasks?.startDate ?? ""),
      duration: 1,
      assginedToUserId: [currantUser.user?.userId ?? ""],
      milestoneIndicator: false,
    };
    taskCreateMutation.mutate(value, {
      onSuccess(data) {
        refetch();
        setSubtask("");
        toast.success(data.data.message);
      },
      onError(error) {
        toast.error(error.response?.data.message);
      },
    });
  };

  const refetch = () => {
    taskQuery.refetch();
  };

  const submitMembers = (user: UserOrganisationType) => {
    if (user) {
      taskAddMembersMutation.mutate(
        { assginedToUserId: user.user.userId },
        {
          onSuccess(data) {
            refetch();
            toast.success(data.data.message);
            setMambers((prev) => [...prev, user.user]);
          },
          onError(error) {
            toast.error(error.response?.data.message);
          },
        }
      );
    }
  };

  const removeMembers = (id: string) => {
    taskRemoveMembersMutation.mutate(id, {
      onSuccess(data) {
        refetch();
        toast.success(data.data.message);
      },
      onError(error) {
        toast.error(error.response?.data.message);
      },
    });
  };

  const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taskId && e.target.files?.length) {
      setAttachmentUploading(true);
      const formData = new FormData();
      for (let i = 0; i < e.target.files.length; ++i) {
        formData.append("taskAttachment", e.target.files[i]);
      }
      taskAttachmentAddMutation.mutate(formData, {
        onSuccess(data) {
          refetch();
          toast.success(data.data.message);
          setAttachmentUploading(false);
        },
        onError(error) {
          toast.error(error.response?.data.message);
          setAttachmentUploading(false);
        },
      });
    }
  };

  const [progressError, setProgressError] = useState("");
  const onProgressUpdate = (e: number[]) => {
    const val = e[0];
    if (Number(val) !== Number(tasks?.completionPecentage)) {
      if (Number(val) > 100 || Number(val) < 0) {
        setProgressError("Progress must be within the range of 0 to 100.");
      } else {
        setProgressError("");
        taskUpdateMutation.mutate(
          { completionPecentage: Number(val) ?? 0 },
          {
            onSuccess() {
              refetch();
            },
            onError(error) {
              toast.error(
                error.response?.data.message == "Unauthorized"
                  ? "You are not authorized to edit tasks which are not assigned to you"
                  : error.response?.data.message
              );
            },
          }
        );
      }
    }
  };
  const taskStatusUpdateMutation = useTaskStatusUpdateMutation(taskId);
  const updateStatus = (status: string) => {
    taskStatusUpdateMutation.mutate(
      { status },
      {
        onSuccess() {
          taskQuery.refetch();
        },
        onError(error) {
          toast.error(
            error.response?.data.message == "Unauthorized"
              ? "You are not authorized to edit tasks which are not assigned to you"
              : error.response?.data.message
          );
        },
      }
    );
  };
  const taskStatus = () => {
    const removeStatus = [TaskStatusEnumValue.IN_PROGRESS];
    if (tasks?.milestoneIndicator) {
      return Object.keys(TaskStatusEnumValue).filter(
        (e) => !removeStatus.some((r) => e === r)
      );
    } else {
      return Object.keys(TaskStatusEnumValue);
    }
  };
  const close = () => {
    tasks = undefined;
    props.close();
  };

  return (
    <div className="absolute w-full h-full z-50 top-full left-full -translate-x-full -translate-y-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg text-gray-700 p-6 lg:p-10 w-full md:max-w-[95%] lg:max-w-[80%] h-full md:max-h-[80%] overflow-auto ">
        {taskQuery.isFetching ? (
          <Loader className="absolute top-0 left-0 bg-opacity-40" />
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`${tasks?.parentTaskId ? "block" : "hidden"}`}>
                  <Button
                    variant={"link"}
                    className="flex justify-start p-0"
                    onClick={() => setTaskId(tasks?.parentTaskId ?? "")}
                  >
                    <img src={BackIcon} width={24} height={24} />
                  </Button>
                </div>
                <div className=" w-80">
                  <div
                    className={`py-1.5 px-3 flex w-full gap-3 rounded-md justify-start font-semibold ${
                      tasks?.flag == "Green"
                        ? "bg-green-500/60"
                        : tasks?.flag == "Red"
                        ? "bg-red-500/60"
                        : tasks?.flag == "Orange"
                        ? "bg-primary-500/60"
                        : ""
                    }`}
                  >
                    <img src={Tag} className="w-3.5" />
                    {tasks?.flag == "Green"
                      ? "On track"
                      : tasks?.flag == "Red"
                      ? "Significant delay"
                      : tasks?.flag == "Orange"
                      ? "Moderate delay"
                      : ""}
                    
                      <div className="ml-auto">
                        {tasks?.delay && tasks?.delay * 100 >100 ? 100 +"%" : tasks?.delay && (tasks?.delay * 100).toFixed(0  ) +"%" }
                        
            </div>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    close();
                  }}
                >
                  <img src={Close} width={24} height={24} />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <img src={TaskSvg} width={24} height={24} />
                  <div>
                    {taskNameField || !taskId ? (
                      <div>
                        <InputText
                          onBlur={() => {
                            setTaskNameField(false), taskFormik.submitForm();
                          }}
                          name="taskName"
                          onChange={taskFormik.handleChange}
                          onClick={taskFormik.handleBlur}
                          placeholder="Create new task *"
                          value={taskFormik.values.taskName}
                        ></InputText>
                      </div>
                    ) : (
                      <div className="text-2xl font-semibold">
                        {taskFormik.values.taskName}
                      </div>
                    )}
                  </div>
                  {allowed() && (
                    <Button
                      variant={"ghost"}
                      onClick={() => setTaskNameField((prev) => !prev)}
                    >
                      <img src={Edit} width={10} height={10} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3 md:gap-8 justify-between md:flex-row flex-col-reverse mt-4 md:mt-0">
              <div className="w-full md:w-3/4">
                {/* Sub Tasks */}
                <div>
                  <div className="flex items-center gap-2.5 mt-4">
                    <img src={SubTask} width={20} height={20} />
                    <div>
                      <div className="text-xl font-medium">Sub-tasks</div>
                    </div>
                    {!subTaskFieldShow && allowed() && (
                      <Button variant={"ghost"}>
                        <img
                          src={PlusSvg}
                          width={20}
                          height={20}
                          onClick={() =>
                            setSubTaskFieldShow((prev) => (prev = !prev))
                          }
                        />
                      </Button>
                    )}
                  </div>
                  {tasks &&
                    tasks.subtasks.map((task, index) => {
                      return (
                        <div className="mt-3" key={index}>
                          <Button
                            variant={"secondary"}
                            className="flex justify-between items-center w-full"
                            onClick={() => setTaskId(task.taskId)}
                          >
                            <div className="flex gap-2">
                              <img src={Folder} />
                              <p className="text-sm font-normal underline">
                                {task.taskName}
                              </p>
                            </div>
                            <div>
                              <img src={TopRightArrow} />
                            </div>
                          </Button>
                        </div>
                      );
                    })}
                  {subTaskFieldShow && (
                    <>
                      <div>
                        <InputText
                          name="taskName"
                          placeholder="What needs to be done?"
                          onChange={(e) => setSubtask(e.target.value)}
                          value={subTask}
                        ></InputText>
                      </div>
                      <div className="flex gap-3 justify-end mt-3">
                        <Button
                          variant={"secondary"}
                          onClick={() => setSubTaskFieldShow(false)}
                          className="py-2 px-4"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant={"primary_outline"}
                          onClick={createSubTask}
                          className="py-2 px-4"
                        >
                          Create
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Dependencies */}

                {tasks && (
                  <TaskDependencies
                    task={tasks}
                    refetch={refetch}
                    allowed={allowed()}
                  />
                )}
                {/* Attachments */}
                {tasks?.documentAttachments &&
                tasks?.documentAttachments.length > 0 ? (
                  <TaskAttachment
                    refetch={refetch}
                    task={tasks}
                  ></TaskAttachment>
                ) : (
                  ""
                )}

                <div className="flex items-center gap-2.5 mt-4">
                  <img src={MultiLine} width={20} height={20} />
                  <div>
                    <div className="text-xl font-medium">Description</div>
                  </div>
                </div>
                <div className="w-full mt-2">
                  <textarea
                    disabled={!allowed()}
                    name="taskDescription"
                    className="w-full border rounded px-2"
                    onBlur={taskFormik.handleBlur}
                    onChange={taskFormik.handleChange}
                    value={taskFormik.values.taskDescription}
                    cols={30}
                    rows={3}
                  ></textarea>
                </div>
                {/* Comment  */}
                <TaskComment
                  task={tasks}
                  refetch={refetch}
                  allowed={allowed()}
                ></TaskComment>

                {tasks?.histories && tasks.histories.length > 0 && (
                  <TaskHistory task={tasks} />
                )}
              </div>
              <div className="w-full md:w-1/4">
                <div>
                  <div className="text-xs font-medium mb-4">Add to card</div>
                  <div className="mt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        disabled={!allowed() || Boolean(tasks?.subtasks.length)}
                      >
                        <div className="text-sm font-normal cursor-pointer">
                          <Button
                            disabled={
                              !allowed() || Boolean(tasks?.subtasks.length)
                            }
                            variant={"secondary"}
                            className="py-1.5 px-3 flex w-full gap-3 justify-start"
                          >
                            {tasks?.status
                              ? `Status: ${tasks?.status
                                  .toLowerCase()
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                  )}`
                              : "Select Status"}
                          </Button>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-auto">
                        {taskStatus().map((status) => {
                          return (
                            <div
                              onClick={() => {
                                updateStatus(status);
                              }}
                              className="cursor-pointer flex px-3 w-44 rounded-md hover:bg-slate-50/80 py-2 justify-between items-center"
                            >
                              {status
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  status === tasks?.status
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2">
                    <Popover>
                      <PopoverTrigger className="w-full">
                        <Button
                          variant={"secondary"}
                          className="py-1.5 px-3 flex w-full gap-3 justify-start"
                          disabled={!allowed()}
                        >
                          <img src={Users} />
                          Assignees
                          <div className="flex gap-4 justify-between items-center">
                            <div className="w-24 grid grid-cols-[repeat(auto-fit,minmax(10px,max-content))]">
                              {member.slice(0, 4).map((item, index) => {
                                const zIndex = Math.abs(index - 3);
                                return (
                                  <div key={index} style={{ zIndex: zIndex }}>
                                    <UserAvatar
                                      className="shadow-sm shadow-gray-300"
                                      user={item}
                                    ></UserAvatar>
                                  </div>
                                );
                              })}
                            </div>
                            <div>
                              {tasks?.assignedUsers &&
                              tasks?.assignedUsers?.length > 4
                                ? `${tasks?.assignedUsers.length - 4} +`
                                : ""}
                            </div>
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 focus:outline-none">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Members
                            </h4>
                          </div>
                          <div>
                            {taskMemberList.data?.data.data
                              .filter(
                                (d) =>
                                  d.user?.userOrganisation![0].role !==
                                  UserRoleEnumValue.ADMINISTRATOR
                              )
                              .map((data, index) => {
                                return (
                                  <div
                                    key={index}
                                    className={`flex items-center p-1 my-1 gap-4 hover:bg-slate-100 rounded-md ${
                                      tasks?.assignedUsers.some(
                                        (u) => u.user.userId == data.user.userId
                                      )
                                        ? "bg-slate-100/80"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      tasks?.assignedUsers.some(
                                        (u) => u.user.userId == data.user.userId
                                      )
                                        ? removeMembers(
                                            tasks?.assignedUsers.find(
                                              (id) =>
                                                id.user.userId ==
                                                data.user.userId
                                            )?.taskAssignUsersId ?? ""
                                          )
                                        : submitMembers(data);
                                    }}
                                  >
                                    <UserAvatar
                                      user={data.user}
                                      className="rounded-full"
                                    />
                                    <div>
                                      <div className="">
                                        {data.user.firstName}{" "}
                                        {data.user.lastName}
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        {data.user.email}
                                      </div>
                                    </div>
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        member.some(
                                          (u) => u.userId == data.user.userId
                                        )
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="mt-2">
                    <input
                      type="file"
                      ref={fileInput}
                      onChange={(e) => fileUpload(e)}
                      className="hidden"
                      multiple
                    />
                    <Button
                      variant={"secondary"}
                      className="py-1.5 px-3 w-full"
                      onClick={() => fileInput.current?.click()}
                      isLoading={attachmentUploading}
                      disabled={attachmentUploading || !allowed()}
                    >
                      <div className="flex w-full gap-3 justify-start">
                        <img src={PapperClip} className="w-3.5" />
                        Attachment
                      </div>
                    </Button>
                  </div>
                  {startDate && (
                    <div className="mt-2">
                      <Popover>
                        <PopoverTrigger
                          className="w-full"
                          disabled={
                            !allowed() || (tasks && tasks?.subtasks.length > 0)
                          }
                        >
                          <Button
                            variant={"secondary"}
                            className="py-1.5 px-3 w-full"
                            disabled={
                              !allowed() ||
                              (tasks && tasks?.subtasks.length > 0)
                            }
                          >
                            <div className="flex w-full gap-3 justify-start">
                              <img src={CalendarIcon} className="w-3.5" />
                              <div>
                                Start date{" "}
                                <span className="text-red-500 text-sm">*</span>
                              </div>
                              <div className="text-gray-400 text-sm">
                                {dateFormater(
                                  new Date(
                                    taskFormik.values.startDate ?? startDate
                                  )
                                )}
                              </div>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0"
                          onCloseAutoFocus={taskFormik.submitForm}
                        >
                          <Calendar
                            mode="single"
                            selected={
                              new Date(taskFormik.values.startDate ?? startDate)
                            }
                            onSelect={(e) => {
                              {
                                const endDate = new Date(e ?? "");
                                endDate.setUTCHours(0, 0, 0, 0);
                                endDate.setDate(endDate.getDate() + 1);
                                taskFormik.setFieldValue(
                                  "startDate",
                                  e ? new Date(endDate) : undefined
                                );
                              }
                            }}
                            className="rounded-md border"
                            disabled={{ before: startDate }}
                          />
                          {taskFormik.errors.startDate &&
                            taskFormik.values.startDate && (
                              <ErrorMessage className="ml-0 p-0">
                                {/* {taskFormik.errors.startDate} */}
                              </ErrorMessage>
                            )}
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  <div className="mt-2" key={taskId}>
                    <div className="flex flex-col">
                      {!taskDurationField && (
                        <div className="flex gap-5">
                          <Button
                            variant={"secondary"}
                            onClick={() =>
                              tasks?.subtasks?.length == 0
                                ? setTaskDurationField((prev) => !prev)
                                : ""
                            }
                            disabled={
                              tasks?.milestoneIndicator ||
                              Boolean(!taskId) ||
                              Boolean(tasks?.subtasks.length) ||
                              !allowed()
                            }
                            className="w-full flex justify-between "
                          >
                            <div className="text-xs font-medium text-gray-400 flex gap-2 ">
                              <div>
                                Duration:{" "}
                                <span className="text-red-500 text-sm">*</span>
                              </div>
                              <div className="text-sm  text-gray-300">
                                {taskFormik.values.duration ?? 0.0} Day
                              </div>
                            </div>

                            <div className="flex items-center justify-end relative">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <img
                                      src={InfoCircle}
                                      className="h-[16px] w-[16px]"
                                      alt="InfoCircle"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent className="z-50 bg-white p-2 rounded-md shadow-md">
                                    <div>
                                      <p>
                                        Enter the duration in days, using
                                        decimals if <br />
                                        needed. For example, you can input 0.5
                                        for half
                                        <br />a day or 1.0 for a full day.
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </Button>
                        </div>
                      )}
                      {taskDurationField && (
                        <div className="flex items-center gap-2.5 w-dull">
                          <div>
                            <InputNumber
                              onBlur={() => {
                                setTaskDurationField(false),
                                  taskFormik.submitForm();
                              }}
                              autoFocus
                              name="duration"
                              onChange={taskFormik.handleChange}
                              onClick={taskFormik.handleBlur}
                              value={taskFormik.values.duration}
                            ></InputNumber>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant={"secondary"}
                      className="py-1.5 px-3 w-full mt-2 cursor-default"
                      disabled={!allowed()}
                    >
                      <div className="flex w-full gap-3 justify-start">
                        <img src={CalendarIcon} className="w-3.5" />
                        <div>
                          End date
                          <span className="text-red-500 text-sm">*</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {tasks?.endDate
                            ? dateFormater(new Date(tasks.endDate))
                            : ""}
                        </div>
                      </div>
                    </Button>
                  </div>

                  <div className="mt-2">
                    <Button
                      variant={"secondary"}
                      className="py-1.5 px-3 flex w-full gap-3 justify-between"
                      disabled={!allowed()}
                      onClick={() => {
                        {
                          milestoneHandlechange(
                            !milestoneFormik.values.milestoneIndicator
                          );
                          milestoneFormik.submitForm();
                        }
                      }}
                    >
                      <div className="flex gap-2.5 items-center">
                        <img src={Route} />
                        Milestone
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          className="accent-primary-300"
                          checked={milestoneFormik.values.milestoneIndicator}
                        />
                      </div>
                    </Button>

                    <ErrorMessage className="ml-0 p-0">
                      {milestoneFormik.errors.milestoneIndicator}
                    </ErrorMessage>
                  </div>
                </div>
                <div className="mt-3 w-full">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-2 items-center">
                        <div
                          key={tasks?.completionPecentage}
                          className="text-xs font-medium text-gray-400 flex items-center gap-2"
                        >
                          Progress: {Number(slider).toFixed() + "%"}
                        </div>
                      </div>

                      <div className="w-full mt-2">
                        {tasks && taskId && (
                          <Slider
                            key={taskQuery.isFetching + ""}
                            defaultValue={[
                              !tasks ? 0 : Number(tasks.completionPecentage),
                            ]}
                            aria-labelledby="discrete-slider"
                            max={100}
                            disabled={
                              Boolean(tasks?.subtasks.length) ||
                              tasks?.milestoneIndicator ||
                              !allowed()
                            }
                            min={0}
                            title={tasks?.completionPecentage}
                            onValueChange={(e) => setSlider(e[0])}
                            onValueCommit={(e) => {
                              onProgressUpdate(e);
                            }}
                          />
                        )}
                        <ErrorMessage className="w-1/2">
                          {progressError}
                        </ErrorMessage>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {taskId && allowed() && (
              <div className="flex justify-end gap-2">
                <Button
                  variant={"destructive"}
                  onClick={() => {
                    props.close();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant={"primary"}
                  onClick={() => {
                    setSubmitbyButton(true), taskFormik.submitForm();
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TaskSubTaskForm;
