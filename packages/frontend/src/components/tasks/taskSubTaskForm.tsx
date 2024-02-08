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
import { TaskStatusEnumValue } from "@backend/src/schemas/enums";
import useTaskStatusUpdateMutation from "@/api/mutation/useTaskStatusUpdateMutation";

type Props = {
  projectId: string | undefined;
  taskId: string | undefined;
  close: () => void;
  initialValues?: { startDate: Date | undefined };
};

function TaskSubTaskForm(props: Props) {
  const currantUser = useUser();
  const [subTask, setSubtask] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [taskNameField, setTaskNameField] = useState(false);
  const [taskDurationField, setTaskDurationField] = useState(false);
  const [taskProgressField, setTaskProgressField] = useState(false);
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

  let tasks = taskQuery.data && taskId ? taskQuery.data.data.data : undefined;
  const taskAttachmentAddMutation = useTaskAttechmentAddMutation(taskId);
  const taskCreateMutation = useCreateTaskMutation(props.projectId, taskId);
  const taskAddUpdateMilestoneMutation =
    useTaskAddUpdateMilestoneMutation(taskId);
  useEffect(() => {
    refetch();
  }, [taskId]);

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
        dueDate: tasks.dueDate ?? undefined,
      });
      setMambers(
        tasks.assignedUsers.map((u) => {
          return u.user;
        })
      );
    }
  }, [taskId, taskQuery.data]);

  const taskFormik = useFormik<z.infer<typeof createTaskSchema>>({
    initialValues: {
      taskName: "",
      taskDescription: "",
      startDate: props.initialValues?.startDate
        ? new Date(props.initialValues?.startDate)
        : new Date(),
      duration: 1.0,
    },
    validationSchema: toFormikValidationSchema(createTaskSchema),
    onSubmit: (values) => {
      if (taskId) {
        taskUpdateMutation.mutate(values, {
          onSuccess(data) {
            toast.success(data.data.message);
          },
          onError(error) {
            toast.error(error.response?.data.message);
          },
        });
      } else {
        taskCreateMutation.mutate(values, {
          onSuccess(data) {
            setTaskId(data.data.data.taskId);
            toast.success(data.data.message);
          },
          onError(error) {
            toast.error(error.response?.data.message);
          },
        });
      }
    },
  });

  const milestoneFormik = useFormik<z.infer<typeof milestoneTaskSchema>>({
    initialValues: {
      milestoneIndicator: false,
      dueDate: undefined,
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
      milestoneFormik.setFieldValue("dueDate", null);
      milestoneSubmit({ milestoneIndicator: false, dueDate: undefined });
    }
  };

  const createSubTask = () => {
    const value = {
      taskName: subTask,
      taskDescription: "",
      startDate: new Date(),
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
  const onProgressUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
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
          onError(err) {
            toast.error(err.message);
          },
        }
      );
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
          toast.error(error.message);
        },
      }
    );
  };
  return (
    <div className="absolute w-full h-full z-50 top-full left-full -translate-x-full -translate-y-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg text-gray-700 p-6 lg:p-10 w-full md:max-w-[95%] lg:max-w-[80%] h-full md:max-h-[80%] overflow-auto ">
        <div className="flex justify-between items-center">
          <div>
            <div className={`${tasks?.parentTaskId ? "block" : "hidden"}`}>
              <Button
                variant={"link"}
                className="flex justify-start p-0"
                onClick={() => setTaskId(tasks?.parentTaskId ?? "")}
              >
                <img src={BackIcon} width={24} height={24} />
              </Button>
            </div>
          </div>
          <div>
            <Button
              variant={"ghost"}
              onClick={() => {
                props.close(), (tasks = undefined);
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
                      placeholder={
                        "Task Name" +
                        <span className="text-red-500 text-sm">*</span>
                      }
                      value={taskFormik.values.taskName}
                    ></InputText>
                  </div>
                ) : (
                  <div className="text-2xl font-semibold">
                    {taskFormik.values.taskName}
                  </div>
                )}
              </div>
              <Button
                variant={"ghost"}
                onClick={() => setTaskNameField((prev) => !prev)}
              >
                <img src={Edit} width={10} height={10} />
              </Button>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="text-sm font-normal cursor-pointer">
                    {tasks?.status
                      ? `in list ${tasks?.status
                          .toLowerCase()
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}`
                      : "Select Status"}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-auto">
                  {Object.keys(TaskStatusEnumValue).map((status) => {
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
          </div>
        </div>
        <div className="flex gap-3 md:gap-8 justify-between md:flex-row flex-col-reverse mt-4 md:mt-0">
          <div className="w-full md:w-3/4">
            <div className="mt-4 flex gap-4">
              <div>
                <p className="text-sm font-semibold">Assignees</p>
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
                    {tasks?.assignedUsers && tasks?.assignedUsers?.length > 4
                      ? `${tasks?.assignedUsers.length - 4} +`
                      : ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub Tasks */}
            <div>
              <div className="flex items-center gap-2.5 mt-4">
                <img src={SubTask} width={20} height={20} />
                <div>
                  <div className="text-xl font-medium">Sub-tasks</div>
                </div>
                {!subTaskFieldShow && (
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
                      variant={"primary_outline"}
                      onClick={createSubTask}
                      className="py-2 px-4"
                    >
                      Create
                    </Button>
                    <Button
                      variant={"secondary"}
                      onClick={() => setSubTaskFieldShow(false)}
                      className="py-2 px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Dependencies */}

            {tasks && <TaskDependencies task={tasks} refetch={refetch} />}
            {/* Attachments */}
            {tasks?.documentAttachments &&
            tasks?.documentAttachments.length > 0 ? (
              <TaskAttachment refetch={refetch} task={tasks}></TaskAttachment>
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
            <TaskComment task={tasks} refetch={refetch}></TaskComment>

            {tasks?.histories && tasks.histories.length > 0 && (
              <TaskHistory task={tasks} />
            )}
          </div>
          <div className="w-full md:w-1/4">
            <div>
              <div className="text-xs font-medium mb-4">Add to card</div>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger className="w-full">
                    <Button
                      variant={"secondary"}
                      className="py-1.5 px-3 flex w-full gap-3 justify-start"
                    >
                      <img src={Users} />
                      Members
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 focus:outline-none">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Members</h4>
                      </div>
                      <div>
                        {taskMemberList.data?.data.data.map((data, index) => {
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
                                          id.user.userId == data.user.userId
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
                                  {data.user.firstName} {data.user.lastName}
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
                  disabled={attachmentUploading}
                >
                  <div className="flex w-full gap-3 justify-start">
                    <img src={PapperClip} className="w-3.5" />
                    Attachment
                  </div>
                </Button>
              </div>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger className="w-full">
                    <Button
                      variant={"secondary"}
                      className="py-1.5 px-3 w-full"
                      isLoading={attachmentUploading}
                      disabled={attachmentUploading}
                    >
                      <div className="flex w-full gap-3 justify-start">
                        <img src={CalendarIcon} className="w-3.5" />
                        <div>
                          Start date{" "}
                          <span className="text-red-500 text-sm">*</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                          {dateFormater(new Date(taskFormik.values.startDate))}
                        </div>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(taskFormik.values.startDate ?? "")}
                      onSelect={(e) => {
                        {
                          taskFormik.setFieldValue(
                            "startDate",
                            e ? e : undefined
                          );
                        }
                      }}
                      className="rounded-md border"
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
              <div className="mt-2">
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
                  Flags
                </div>
              </div>
              <div className="mt-2">
                <Button
                  variant={"secondary"}
                  className="py-1.5 px-3 flex w-full gap-3 justify-between"
                  onClick={() => {
                    milestoneHandlechange(
                      !milestoneFormik.values.milestoneIndicator
                    );
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
            <div className="mt-3">
              <div className="flex justify-between my-2">
                {milestoneFormik.values.milestoneIndicator && (
                  <div className="flex flex-col gap-2">
                    <div className="text-xs font-medium text-gray-400">
                      Due Date:
                    </div>
                    <Popover>
                      <PopoverTrigger className="w-full">
                        <div className="text-sm  text-gray-300">
                          {milestoneFormik.values.dueDate
                            ? dateFormater(
                                new Date(milestoneFormik.values.dueDate)
                              )
                            : "Select date"}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Calendar
                          mode="single"
                          selected={
                            new Date(milestoneFormik.values.dueDate ?? "")
                          }
                          onDayBlur={milestoneFormik.submitForm}
                          onSelect={(e) => {
                            milestoneFormik.setFieldValue(
                              "dueDate",
                              e ? new Date(e) : undefined
                            );
                          }}
                          className="rounded-md border"
                        />
                        {milestoneFormik.errors.dueDate &&
                          milestoneFormik.values.dueDate && (
                            <ErrorMessage className="ml-0 p-0">
                              {milestoneFormik.errors.dueDate}
                            </ErrorMessage>
                          )}
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                {(!tasks?.dueDate || !tasks.milestoneIndicator) &&
                  tasks?.endDate && (
                    <div className="flex flex-col gap-2">
                      <div className="text-xs font-medium text-gray-400">
                        End Date
                      </div>
                      {/* <div className="text-sm  text-gray-300">
                    {tasks?.milestoneIndicator
                      ? dateFormater(tasks.dueDate ?? new Date())
                      : dateFormater(new Date())}
                  </div> */}
                      <div className="text-sm  text-gray-300">
                        {dateFormater(new Date(tasks.endDate))}
                      </div>
                    </div>
                  )}
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="flex flex-col">
                    <div className="flex gap-5">
                      <div className="text-xs font-medium text-gray-400">
                        Duration:{" "}
                        <span className="text-red-500 text-sm">*</span>
                      </div>
                      <div className="flex items-center justify-center relative">
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
                                  Enter the duration in days, using decimals if{" "}
                                  <br />
                                  needed. For example, you can input 0.5 for
                                  half
                                  <br />a day or 1.0 for a full day.
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div>
                        {!taskDurationField ? (
                          <div className="text-sm  text-gray-300">
                            {taskFormik.values.duration ?? 0.0} Day
                          </div>
                        ) : (
                          <div>
                            <InputNumber
                              onBlur={() => {
                                setTaskDurationField(false),
                                  taskFormik.submitForm();
                              }}
                              name="duration"
                              onChange={taskFormik.handleChange}
                              onClick={taskFormik.handleBlur}
                              value={taskFormik.values.duration}
                            ></InputNumber>
                          </div>
                        )}
                      </div>
                      <Button
                        variant={"ghost"}
                        onClick={() => setTaskDurationField((prev) => !prev)}
                      >
                        <img src={Edit} className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-2 items-center">
                    <div className="text-xs font-medium text-gray-400">
                      Progress:
                    </div>
                  </div>
                  {taskProgressField ? (
                    <div className="w-full">
                      <InputNumber
                        className="py-1 px-1.5 text-sm h-9 w-full "
                        min={0}
                        max={100}
                        placeholder="0 - 100 % "
                        onBlur={() => setTaskProgressField(false)}
                        onChange={(e) => onProgressUpdate(e)}
                      />
                      <ErrorMessage className="w-1/2">
                        {progressError}
                      </ErrorMessage>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="text-sm  text-gray-300">
                        {tasks?.completionPecentage ?? 0}%
                      </div>{" "}
                      {tasks && tasks.subtasks?.length === 0 && (
                        <div>
                          <Button
                            variant={"none"}
                            onClick={() =>
                              setTaskProgressField((prev) => !prev)
                            }
                          >
                            <img src={Edit} />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {taskId && (
            <div>
              <Button
                variant={"destructive"}
                onClick={() => {
                  props.close();
                }}
              >
                Cancel
              </Button>
            </div>
          )}
          <div>
            <Button
              variant={"primary"}
              onClick={() => {
                props.close();
                taskFormik.submitForm();
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskSubTaskForm;
