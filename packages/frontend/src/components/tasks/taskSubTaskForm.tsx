import Task from "../../assets/svg/Task.svg";
import Edit from "../../assets/svg/EditPen.svg";
import Close from "../../assets/svg/CrossIcon.svg";
import SubTask from "../../assets/svg/SubTask.svg";
import PlusSvg from "../../assets/svg/Plus.svg";
import PapperClip from "../../assets/svg/Paperclip.svg";
import TopRightArrow from "../../assets/svg/TopRightArrow.svg";
import MultiLine from "../../assets/svg/MultiLine.svg";
import ScaleSvg from "../../assets/svg/ScaleSvg.svg";
import Clock from "../../assets/svg/Clock.svg";
import Link from "../../assets/svg/Link.svg";
import Users from "../../assets/svg/Users.svg";
import Tag from "../../assets/svg/Tag.svg";
import Route from "../../assets/svg/Route.svg";
import Folder from "../../assets/svg/Folders.svg";
import DownArrow from "../../assets/svg/DownArrow.svg";

import { Button } from "../ui/button";
import UserAvatar from "../ui/userAvatar";
import { useEffect, useState } from "react";
import InputText from "../common/InputText";
import { createTaskSchema } from "../../../../backend/src/schemas/taskSchema";
import { useFormik } from "formik";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { TaskDependenciesEnumValue } from "@backend/src/schemas/enums";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Select, {
  ControlProps,
  StylesConfig,
  CSSObjectWithLabel,
} from "react-select";
type Props = {
  close: () => void;
};

function TaskSubTaskForm(props: Props) {
  const [taskNameField, setTaskNameField] = useState(false);
  const [subTaskFieldShow, setSubTaskFieldShow] = useState<boolean>(false);
  const [dependenciesShow, setDependenciesShow] = useState<boolean>(false);
  const dependencies: typeof TaskDependenciesEnumValue = {
    BLOCKING: "BLOCKING",
    WAITING_ON: "WAITING_ON",
  };
  const formik = useFormik<z.infer<typeof createTaskSchema>>({
    initialValues: {
      taskName: "",
      taskDescription: "",
      startDate: new Date(),
      duration: 0,
      assginedToUserId: "",
      documentAttachments: [],
      dependencies: "BLOCKING",
      milestoneIndicator: false,
      flag: "",
    },
    validationSchema: toFormikValidationSchema(createTaskSchema),
    onSubmit: (values) => {
      console.log(values);
    },
  });
  useEffect(() => {
    formik.setValues({
      taskName: "sumit perent task",
      taskDescription: "Task's Description",
      startDate: new Date(),
      duration: 90,
      assginedToUserId: "0a01704a-4786-46b0-af38-5191ef9dd73b",
      dependencies: "BLOCKING",
      milestoneIndicator: true,
      flag: "flag",
      documentAttachments: [],
    });
  }, []);

  const task = {
    taskId: "9c268287-5adc-4d59-97f2-2b9dcf622958",
    projectId: "b7019fbd-ccee-45bb-bcc7-63682cd59bb0",
    taskName: "sumit perent task",
    taskDescription: "Task's Description",
    startDate: "2023-12-09T00:00:00.000Z",
    duration: 90,
    completionPecentage: null,
    status: "NOT_STARTED",
    assginedToUserId: "0a01704a-4786-46b0-af38-5191ef9dd73b",
    dependencies: "BLOCKING",
    milestoneIndicator: true,
    flag: "flag",
    createdByUserId: "0a01704a-4786-46b0-af38-5191ef9dd73b",
    updatedByUserId: "0a01704a-4786-46b0-af38-5191ef9dd73b",
    createdAt: "2023-12-06T06:16:02.504Z",
    updatedAt: "2023-12-06T06:16:02.504Z",
    parentTaskId: null,
    assginedUser: {
      userId: "0a01704a-4786-46b0-af38-5191ef9dd73b",
      firstName: "test",
      lastName: "yopmail",
      email: "test@yopmail.com",
      avatarImg: null,
    },
    mamberUsers: [
      {
        userId: "0a01704a-4786-46b0-af38-5191ef9dd731",
        firstName: null,
        lastName: null,
        email: "spst@yopmail.com",
        avatarImg: null,
      },
      {
        userId: "0a01704a-4786-46b0-af38-5191ef9dd732",
        firstName: null,
        lastName: null,
        email: "hzst@yopmail.com",
        avatarImg: null,
      },
    ],
  };

  const reactSelectStyle: StylesConfig = {
    control: (provided: CSSObjectWithLabel, state: ControlProps) => ({
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

  return (
    <div className="absolute w-full h-full z-50 top-full left-full -translate-x-full -translate-y-full flex justify-center items-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg text-gray-700 p-6 lg:p-12 w-full md:max-w-[95%] lg:max-w-[80%] max-h-[80%] overflow-auto h-full lg:h-fit">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <img src={Task} width={24} height={24} />
              <div>
                {!taskNameField ? (
                  <div className="text-2xl font-semibold">{task.taskName}</div>
                ) : (
                  <div>
                    <InputText
                      onBlur={() => {
                        console.log("call api"), setTaskNameField(false);
                      }}
                      name="taskName"
                      onClick={formik.handleBlur}
                      value={formik.values.taskName}
                    ></InputText>
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
            <div className="text-sm font-normal">in list {task.status}</div>
          </div>
          <div>
            <Button variant={"ghost"} onClick={() => props.close}>
              <img src={Close} width={24} height={24} />
            </Button>
          </div>
        </div>

        <div className="flex gap-8 justify-between flex-col md:flex-row">
          <div className="w-full md:w-3/4">
            <div className="mt-4 flex gap-4">
              <div>
                <p className="text-sm font-semibold">Assignee</p>
                <div>
                  <UserAvatar user={task.assginedUser}></UserAvatar>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Members</p>
                <div className="flex gap-1">
                  {task.mamberUsers.map((item) => {
                    return <UserAvatar user={item}></UserAvatar>;
                  })}
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
              <div className="mt-3">
                <Button
                  variant={"secondary"}
                  className="flex justify-between items-center w-full"
                >
                  <div className="flex gap-2">
                    <img src={Folder} />
                    <p className="text-sm font-normal underline">
                      This is a child issue
                    </p>
                  </div>
                  <div>
                    <img src={TopRightArrow} />
                  </div>
                </Button>
              </div>
              {subTaskFieldShow && (
                <>
                  <div>
                    <InputText
                      name="subtask"
                      placeholder="What needs to be done?"
                    ></InputText>
                  </div>
                  <div className="flex gap-3 justify-end mt-3">
                    <Button variant={"primary_outline"} className="py-2 px-4">
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
            <div>
              <div className="flex items-center gap-2.5 mt-4">
                <img src={Link} width={20} height={20} />
                <div>
                  <div className="text-xl font-medium">Dependencies</div>
                </div>
                <Button
                  variant={"ghost"}
                  onClick={() => setDependenciesShow(true)}
                >
                  <img src={PlusSvg} width={20} height={20} />
                </Button>
              </div>

              {dependenciesShow && (
                <div className="flex gap-2 items-center my-3 ">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="py-2 px-4 rounded-md text-sm font-medium bg-slate-100 hover:bg-slate-100/80 w-44 h-10">
                        <div className="flex items-center justify-between gap-4 w-full">
                          <div>{formik.values.dependencies}</div>
                          <div className="w-full  flex justify-end">
                            <img src={DownArrow} className="w-5 h-5"></img>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-44 bg-white shadow-md rounded-md">
                      {Object.keys(dependencies).map((item, index) => {
                        return (
                          <DropdownMenuItem
                            className={`p-2 ${
                              formik.values.dependencies == item
                                ? "bg-gray-100"
                                : ""
                            }`}
                            key={index}
                            onClick={() =>
                              formik.setFieldValue("dependencies", item)
                            }
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
                                    item === formik.values.dependencies
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

                  <div className="w-full">
                    <Select
                      placeholder="Select nonworkingdays"
                      isMulti
                      styles={reactSelectStyle}
                      // onChange={}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Attachments */}

            <div className="flex items-center gap-2.5 mt-4">
              <img src={PapperClip} width={20} height={20} />
              <div>
                <div className="text-xl font-medium">Attachments</div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <div className="w-12 h-12">
                <img
                  className="rounded"
                  src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                />
              </div>
              <div className="text-sm font-semibold ">
                <div className="flex items-center gap-3">
                  Attachments-1
                  <div>
                    <img src={TopRightArrow} className="h-2 w-2" />
                  </div>
                </div>
                <div className="text-gray-400">added 35 minutes ago</div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <div className="w-12 h-12">
                <img
                  className="rounded"
                  src="https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                />
              </div>
              <div className="text-sm font-semibold ">
                <div className="flex items-center gap-3">
                  Attachments-1
                  <div>
                    <img src={TopRightArrow} className="h-2 w-2" />
                  </div>
                </div>
                <div className="text-gray-400">added 35 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 mt-4">
              <img src={MultiLine} width={20} height={20} />
              <div>
                <div className="text-xl font-medium">Description</div>
              </div>
            </div>
            <div className="w-full mt-2">
              <textarea
                name="description"
                className="w-full border rounded"
                cols={30}
                rows={3}
              ></textarea>
            </div>
            <div className="flex items-center gap-2.5 mt-4">
              <img src={ScaleSvg} width={20} height={20} />
              <div>
                <div className="text-xl font-medium">Activity</div>
              </div>
            </div>
            <div className="w-full mt-2">
              <div className="flex gap-x-2 items-center">
                <UserAvatar user={task.assginedUser}></UserAvatar>
                <InputText
                  placeholder="Write a comment"
                  className="mt-0 w-full"
                ></InputText>
              </div>
              {/* <div className="flex gap-2 mt-2">
                <div>
                  <UserAvatar user={task.assginedUser}></UserAvatar>
                </div>
                <div className="">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold">
                      {task.assginedUser.firstName} {task.assginedUser.lastName}
                    </div>
                    <div className="text-xs text-gray-400">2 days ago</div>
                  </div>
                  <div className="text-xs text-gray-400 font-normal">
                    I have started working on issue #123.
                  </div>
                </div>
              </div> */}
              <div className="mt-2">
                <div className="flex gap-2 items-start">
                  <div>
                    <UserAvatar user={task.assginedUser}></UserAvatar>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">
                        {task.assginedUser.firstName}{" "}
                        {task.assginedUser.lastName}
                      </div>
                      <div className="text-xs text-gray-400">2 days ago</div>
                    </div>
                    <div className="text-xs text-gray-400 font-normal">
                      I have started working on issue #123.
                    </div>
                    <div className="text-xs text-gray-400 font-normal">
                      edit
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 mt-4">
              <img src={Clock} width={20} height={20} />
              <div>
                <div className="text-xl font-medium">History</div>
              </div>
            </div>
            <div className="flex items-center gap-2 my-3">
              <div>
                <UserAvatar user={task.assginedUser}></UserAvatar>
              </div>
              <div className="text-sm font-semibold">
                {task.assginedUser.firstName} {task.assginedUser.lastName}
              </div>
              <div className="text-xs text-gray-400 font-normal">
                added one new member to card.
              </div>
            </div>
            <div className="flex items-center gap-2 my-3">
              <div>
                <UserAvatar user={task.assginedUser}></UserAvatar>
              </div>
              <div className="text-sm font-semibold">
                {task.assginedUser.firstName} {task.assginedUser.lastName}
              </div>
              <div className="text-xs text-gray-400 font-normal">
                remove one new member to card.
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/4">
            <div>
              <div className="text-xs font-medium mb-4">Add to card</div>
              <div className="mt-2">
                <Button
                  variant={"secondary"}
                  className="py-1.5 px-3 flex w-full gap-3 justify-start"
                >
                  <img src={Users} />
                  Members
                </Button>
              </div>
              <div className="mt-2">
                <Button
                  variant={"secondary"}
                  className="py-1.5 px-3 flex w-full gap-3 justify-start"
                >
                  <img src={PapperClip} className="w-3.5" />
                  Attachment
                </Button>
              </div>
              <div className="mt-2">
                <Button
                  variant={"secondary"}
                  className="py-1.5 px-3 flex w-full gap-3 justify-start"
                >
                  <img src={Tag} />
                  Labels
                </Button>
              </div>
              <div className="mt-2">
                <Button
                  variant={"secondary"}
                  className="py-1.5 px-3 flex w-full gap-3 justify-start"
                >
                  <img src={Route} />
                  Milestone
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-gray-400">
                    Your milestone:
                  </div>
                  <div className="text-sm  text-gray-300">30/12/2023</div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-medium text-gray-400">
                    Your milestone:
                  </div>
                  <div className="text-sm  text-gray-300">30/12/2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskSubTaskForm;
