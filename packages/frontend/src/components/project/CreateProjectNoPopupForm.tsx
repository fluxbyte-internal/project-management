import { Button } from "../ui/button";
import { useFormik } from "formik";
import kanaban from "../../assets/svg/KanbanView.svg";
import gantt from "../../assets/svg/Gantt.svg";
import calendar from "../../assets/svg/Calendar.svg";
import list from "../../assets/svg/List.svg";
import InfoCircle from "../../assets/svg/Info circle.svg";
import { useEffect, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { updateProjectSchema } from "@backend/src/schemas/projectSchema";
import { z } from "zod";
import { isAxiosError } from "axios";
import useProjectQuery, { Project } from "@/api/query/useProjectQuery";
import useProjectUpdateMutation from "@/api/mutation/useProjectUpdateMutation";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { toast } from "react-toastify";
import countries from "../../assets/json/countries.json";
import Select, { SingleValue } from "react-select";
import ErrorMessage from "../common/ErrorMessage";
import {
  OverAllTrackEnumValue,
  ProjectDefaultViewEnumValue,
  ProjectStatusEnumValue,
  ScheduleAndBudgetTrend,
  // UserRoleEnumValue,
} from "@backend/src/schemas/enums";
import dateFormater from "@/helperFuntions/dateFormater";
// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import UsersIcon from "@/assets/svg/Users.svg";
// import UserAvatar from "../ui/userAvatar";
// import useProjectMemberListQuery from "@/api/query/useAllUserOfOrganition";
// import { CheckIcon } from "lucide-react";
// import useProjectAddMembersMutation from "@/api/mutation/useAddMemberProject";
// import { UserOrganisationType } from "@/api/query/useOrganisationDetailsQuery";
// import { cn } from "@/lib/utils";
// import useRemoveProjectMemberMutation from "@/api/mutation/useRemoveMemberProject";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "@/hooks/useUser";

type Options = { label: string; value: string };

type AddProjectType = {
  editData?: Project;
  refetch: () => void;
  viewOnly: boolean;
  cancel?: () => void;
};

const RADIO_BUTTON_OPTIONS = [
  {
    id: 1,
    title: "Kanban",
    description: "Unlock the Power of Visual Project Management with Kanban",
    img: kanaban,
  },
  {
    id: 2,
    title: "Gantt",
    description: "Track Milestones and Deadlines with Gantt Charts",
    img: gantt,
  },
  {
    id: 3,
    title: "Calendar",
    description: "Master Your Daily, Weekly, and Monthly Planning",
    img: calendar,
  },
  {
    id: 4,
    title: "List",
    description: "Never Miss a Detail with Comprehensive List Management",
    img: list,
  },
];
const reactSelectStyle = {
  control: (
    provided: Record<string, unknown>,
    state: { isFocused: boolean }
  ) => ({
    ...provided,
    border: "1px solid #E7E7E7",
    paddingTop: "0.2rem",
    paddingBottom: "0.2rem",
    
    outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
    boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
    "&:hover": {
      outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
      boxShadow: "0px 0px 0px #943B0C",
    },
  }),
} as const;
function CreateProjectNoPopUpForm(props: AddProjectType) {
  // const projectMemberListQuery = useProjectMemberListQuery();
  const { editData, refetch, viewOnly } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const errorStyle = "text-red-400 block text-sm h-1";
  const labelStyle = "font-medium text-base text-gray-700 ";
  const inputStyle =
    "py-1.5 px-3 rounded-md border border-gray-100 mt-2 w-full h-[46px]";
  const projectUpdateMutation = useProjectUpdateMutation(
    editData ? editData.projectId : ""
  );
  const [currencyValue, setCurrencyValue] = useState<SingleValue<Options>>();

  const projectQuery = useProjectQuery();
  // const projectAddMembersMutation = useProjectAddMembersMutation(
  //   editData?.projectId,
  // );
  // const removeProjectMemberMutation = useRemoveProjectMemberMutation();
  // const user = useUser()
  const formik = useFormik<z.infer<typeof updateProjectSchema>>({
    initialValues: {
      projectName: "",
      projectDescription: "",
      startDate: "" as unknown as Date,
      estimatedEndDate: "" as unknown as Date,
      estimatedBudget: "",
      defaultView: ProjectDefaultViewEnumValue.LIST,
      currency: "USD",
      status: ProjectStatusEnumValue.NOT_STARTED,
      overallTrack: OverAllTrackEnumValue.SUNNY,
      scheduleTrend: ScheduleAndBudgetTrend.STABLE,
      budgetTrend: ScheduleAndBudgetTrend.STABLE,
      consumedBudget: "",
    },
    validationSchema: toFormikValidationSchema(updateProjectSchema),
    onSubmit: (values, helper) => {
      if (editData && editData.projectId) {
        projectUpdateMutation.mutate(values, {
          onSuccess(data) {
            projectQuery.refetch();
            refetch();
            setIsSubmitting(false);
            toast.success(data.data.message);
            if (props.cancel) {
              props.cancel();
            }
          },
          onError(error) {
            setIsSubmitting(false);
            if (isAxiosError(error)) {
              if (
                error.response?.status === 400 &&
                error.response.data?.errors &&
                Array.isArray(error.response?.data.errors)
              ) {
                error.response.data.errors.forEach((item) => {
                  helper.setFieldError(item.path[0], item.message);
                });
              }
              if (!Array.isArray(error.response?.data.errors)) {
                toast.error(
                  error.response?.data?.message ??
                    "An unexpected error occurred."
                );
              }
            }
          },
        });
      }
    },
  });

  useEffect(() => {
    if (editData) {
      const formatDate = (inputDate: string) => {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`;
      };
      formik.setValues({
        startDate: formatDate(editData.startDate) as unknown as Date,
        estimatedEndDate: formatDate(
          editData.estimatedEndDate
        ) as unknown as Date,
        estimatedBudget: editData.estimatedBudget,
        projectDescription: editData.projectDescription,
        projectName: editData.projectName,
        defaultView: editData.defaultView,
        currency: editData.currency,
        overallTrack: editData.overallTrack,
        scheduleTrend: editData.scheduleTrend,
        budgetTrend: editData.budgetTrend,
        consumedBudget: editData.consumedBudget,
        status: editData.status,
      });
      setCurrencyValue({ label: editData.currency, value: editData.currency });
    }
  }, [editData]);

  const currencyFn = () => {
    const value = countries.map((item) => {
      return { label: item.currency, value: item.currency };
    });
    return value;
  };

  const handleCurrency = (val: SingleValue<Options>) => {
    if (val) {
      setCurrencyValue(val);
      formik.setFieldValue("currency", val.value);
    }
  };
  // const navigate = useNavigate()

  // const submitMembers = (user: UserOrganisationType) => {
  //   if (user) {
  //     projectAddMembersMutation.mutate(
  //       { assginedToUserId: user.user.userId },
  //       {
  //         onSuccess(data) {
  //           refetch();
  //           toast.success(data.data.message);
  //         },
  //         onError(error) {
  //           toast.error(error.response?.data.message);
  //         },
  //       },
  //     );
  //   }
  // };

  // const removeMembers = (id: string) => {
  //   removeProjectMemberMutation.mutate(id, {
  //     onSuccess(data) {
  //       refetch();
  //       toast.success(data.data.message);
  //     },
  //     onError(error) {
  //       toast.error(error.response?.data.message);
  //     },
  //   });
  // };
  const enumToString = ( str:string) =>{
    return str.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <div className="mt-4">
      <div className="">
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full lg:flex lg:gap-16">
            <div className="flex gap-4 flex-col lg:w-[50%]">
              <div className="text-left">
                <label className={labelStyle}>
                  Name
                  <span className="ml-0.5 text-red-500">*</span>
                </label>
                <input
                  disabled={viewOnly}
                  type="text"
                  name="projectName"
                  placeholder="Project one"
                  className={inputStyle}
                  value={formik.values.projectName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span className={errorStyle}>
                  {formik.touched.projectName && formik.errors.projectName}
                </span>
              </div>
              <div className="text-left">
                <label className={labelStyle}>Description</label>
                <textarea
                  disabled={viewOnly}
                  rows={5}
                  cols={30}
                  name="projectDescription"
                  placeholder="Description"
                  className="py-1.5 px-3 rounded-md border border-gray-100 mt-2 w-full"
                  value={formik.values.projectDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span className={errorStyle}>
                  {formik.touched.projectDescription &&
                    (formik.errors.projectDescription as string)}
                </span>
              </div>

              <div className="sm:flex sm:gap-[10px] w-full">
                <div className="text-left sm:w-1/2">
                  <label className={labelStyle}>
                    Start Date
                    <span className="ml-0.5 text-red-500">*</span>
                  </label>
                  <input
                    disabled={viewOnly}
                    type="date"
                    name="startDate"
                    className={inputStyle}
                    value={formik.values.startDate as unknown as string}
                    placeholder="Placeholder"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span className={errorStyle}>
                    {formik.touched.startDate &&
                      (formik.errors.startDate as string)}
                  </span>
                </div>
                <div className="text-left sm:w-1/2">
                  <label className="font-medium text-base text-gray-700 flex gap-1 mt-4 sm:mt-0">
                    Estimated End date
                    <span className="ml-0.5 text-red-500">*</span>
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
                          <TooltipContent>
                            <p> Date will be automatically </p>
                            <p>updated after saving a baseline</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </label>
                  <input
                    disabled={viewOnly}
                    type="date"
                    name="estimatedEndDate"
                    className={inputStyle}
                    placeholder="Placeholder"
                    value={
                      (formik.values.estimatedEndDate as unknown as string) ??
                      ""
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span className={errorStyle}>
                    {formik.touched.estimatedEndDate &&
                      (formik.errors.estimatedEndDate as string)}
                  </span>
                </div>
              </div>
              <div className="text-left flex gap-2 ">
                <div className="w-36">
                  <label className={labelStyle}>Currency</label>
                  <Select
                    isDisabled={viewOnly}
                    className="mt-2"
                    onChange={handleCurrency}
                    onBlur={() => formik.setTouched({ currency: true })}
                    options={currencyFn()}
                    value={currencyValue}
                    defaultValue={{ label: "USD", value: "USD" }}
                    placeholder="Currency"
                    name="currency"
                    menuPlacement="auto"
                    styles={reactSelectStyle}
                  />
                  <ErrorMessage>
                    {formik.touched.currency && formik.errors.currency}
                  </ErrorMessage>
                </div>
                <div className=" w-full">
                  <label className={labelStyle}>Estimated Budget</label>
                  <span className="ml-0.5 text-red-500">*</span>
                  <input
                    disabled={viewOnly}
                    type="text"
                    name="estimatedBudget"
                    placeholder="Estimated budget"
                    className={inputStyle}
                    value={formik.values.estimatedBudget ?? ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span className={errorStyle}>
                    {formik.touched.estimatedBudget &&
                      formik.errors.estimatedBudget}
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:w-[50%]">
              <div className="text-xl font-medium mb-5 text-gray-700 mt-4 lg:mt-0">
                Default View
              </div>
              <div className="flex flex-col gap-5 ">
                {RADIO_BUTTON_OPTIONS.map((radioButton) => (
                  <div
                    key={radioButton.id}
                    className={`h-full w-full rounded-[5px] border ${
                      formik.values.defaultView ===
                      radioButton.title.toUpperCase() && !viewOnly
                        ?  " border-2  border-primary-800 "
                        : " border-gray-100" 
                    } ${formik.values.defaultView !== radioButton.title.toUpperCase() && viewOnly ? "border-2  border-gray-800  hidden" :  "block" }`}
                  >
                    <label className="flex lg:gap-3.5 gap-4 px-5 py-2.5 items-center h-full cursor-pointer">
                      <input
                        type="radio"
                        disabled={viewOnly}
                        name="defaultView"
                        value={radioButton.title.toUpperCase()}
                        checked={
                          formik.values.defaultView ===
                          radioButton.title.toUpperCase()
                        }
                        onChange={formik.handleChange}
                        className="hidden"
                      />
                      <div className="h-[70px] w-[70px] flex shrink-0 ">
                        <img
                          src={radioButton.img}
                          className="h-full w-full"
                          alt={`${radioButton.title} view`}
                        />
                      </div>
                      <div className="flex flex-col lg:gap-1.5 gap-0.5">
                        <div className="font-semibold text-gray-700 text-xl">
                          {radioButton.title}
                        </div>
                        <div className="font-normal text-sm text-gray-500">
                          {radioButton.description}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex items-center gap-2 justify-between my-3 text-gray-400 text-lg font-semibold">
            <hr className="w-2/5" />
            Project Management
            <hr className="w-2/5" />
          </div>
          {/* <div className="lg:flex lg:flex-row flex-col  gap-16 lg:my-3">
            <div className="lg:w-[50%] w-full my-6 lg:my-0">
              <Popover>
                <PopoverTrigger className="w-full" disabled={viewOnly}>
                  <Button
                    variant={"secondary"}
                    type="button"
                    className="py-1.5 px-3 flex w-full gap-3 justify-start"
                  >
                    <img src={UsersIcon} />
                    Assignee project manager
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 focus:outline-none">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        Project Manager
                      </h4>
                    </div>
                    <div>
                      {projectMemberListQuery.data?.data.data.map(
                        (data, index) => {
                          return (
                            data.role === "PROJECT_MANAGER" && (
                              <div
                                key={index}
                                className={`flex items-center p-1 my-1 gap-4 hover:bg-slate-100 rounded-md ${
                                  editData?.assignedUsers.some(
                                    (u) => u.user.userId == data.user.userId,
                                  )
                                    ? "bg-slate-100/80"
                                    : ""
                                }`}
                                onClick={() => {
                                  editData?.assignedUsers.some(
                                    (u) => u.user.userId == data.user.userId,
                                  )
                                    ? removeMembers(
                                      editData?.assignedUsers.find(
                                        (id) =>
                                          id.user.userId == data.user.userId,
                                      )?.projectAssignUsersId ?? "",
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
                                    editData?.assignedUsers.some(
                                      (u) => u.user.userId == data.user.userId,
                                    )
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </div>
                            )
                          );
                        },
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="lg:w-[50%] w-full">
              <Popover>
                <PopoverTrigger className="w-full" disabled={viewOnly}>
                  <Button
                    variant={"secondary"}
                    type="button"
                    className="py-1.5 px-3 flex w-full gap-3 justify-start"
                  >
                    <img src={UsersIcon} />
                    Assignee team member
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 focus:outline-none">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Team Member</h4>
                    </div>
                    <div>
                      {projectMemberListQuery.data?.data.data.map(
                        (data, index) => {
                          return (
                            data.role === "TEAM_MEMBER" && (
                              <div
                                key={index}
                                className={`flex items-center p-1 my-1 gap-4 hover:bg-slate-100 rounded-md ${
                                  editData?.assignedUsers.some(
                                    (u) => u.user.userId == data.user.userId,
                                  )
                                    ? "bg-slate-100/80"
                                    : ""
                                }`}
                                onClick={() => {
                                  editData?.assignedUsers.some(
                                    (u) => u.user.userId == data.user.userId,
                                  )
                                    ? removeMembers(
                                      editData?.assignedUsers.find(
                                        (id) =>
                                          id.user.userId == data.user.userId,
                                      )?.projectAssignUsersId ?? "",
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
                                    editData?.assignedUsers.some(
                                      (u) => u.user.userId == data.user.userId,
                                    )
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </div>
                            )
                          );
                        },
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div> */}
          <div className="sm:flex gap-16 my-3">
            <div className="sm:w-[50%] w-full">
              <div className={labelStyle}>Status</div>
              <Select
                isDisabled={viewOnly}
                menuPlacement="auto"
                value={
                  formik.values.status && {
                    label:enumToString(formik.values.status),
                    value: formik.values.status,
                  }
                }
                name="status"
                isMulti={false}
                onChange={(e: SingleValue<Options>) =>
                  formik.setFieldValue("status", e?.value)
                }
                options={Object.keys(ProjectStatusEnumValue).map((i) => {
                  return { label: enumToString(i), value: i };
                })}
                styles={reactSelectStyle}
              />
              <ErrorMessage>
                {formik.touched.status && formik.errors.status}
              </ErrorMessage>
            </div>
            <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
              <div className={labelStyle}>Overall track</div>

              <Select
                isDisabled={viewOnly}
                options={Object.keys(OverAllTrackEnumValue).map((i) => {
                  return { label: enumToString(i), value: i };
                })}
                menuPlacement="auto"
                value={
                  formik.values.overallTrack && {
                    label: enumToString(formik.values.overallTrack),
                    value: formik.values.overallTrack,
                  }
                }
                onChange={(e: SingleValue<Options>) =>
                  formik.setFieldValue("overallTrack", e?.value)
                }
                styles={reactSelectStyle}
              />
              <ErrorMessage>
                {formik.touched.overallTrack && formik.errors.overallTrack}
              </ErrorMessage>
            </div>
          </div>
          <div className="sm:flex gap-16 my-3">
            <div className="sm:w-[50%] w-full">
              <div className={labelStyle}>Schedule Trend</div>
              <Select
                isDisabled={viewOnly}
                menuPlacement="auto"
                value={
                  formik.values.scheduleTrend && {
                    label: enumToString(formik.values.scheduleTrend),
                    value: formik.values.scheduleTrend,
                  }
                }
                name="scheduleTrend"
                isMulti={false}
                onChange={(e: SingleValue<Options>) =>
                  formik.setFieldValue("scheduleTrend", e?.value)
                }
                options={Object.keys(ScheduleAndBudgetTrend).map((i) => {
                  return { label: enumToString(i), value: i };
                })}
                styles={reactSelectStyle}
              />
              <ErrorMessage>
                {formik.touched.scheduleTrend && formik.errors.scheduleTrend}
              </ErrorMessage>
            </div>
            <div className="sm:w-[50%] w-full mt-2 sm:mt-0">
              <div className={labelStyle}>Budget Trend</div>

              <Select
                isDisabled={viewOnly}
                options={Object.keys(ScheduleAndBudgetTrend).map((i) => {
                  return { label: enumToString(i), value: i };
                })}
                menuPlacement="auto"
                value={
                  formik.values.budgetTrend && {
                    label:enumToString(formik.values.budgetTrend),
                    value: formik.values.budgetTrend,
                  }
                }
                onChange={(e: SingleValue<Options>) =>
                  formik.setFieldValue("budgetTrend", e?.value)
                }
                styles={reactSelectStyle}
              />
              <ErrorMessage>
                {formik.touched.budgetTrend && formik.errors.budgetTrend}
              </ErrorMessage>
            </div>
          </div>
          <div className="sm:flex gap-16  my-3">
            <div className="sm:w-[50%] w-full">
              <div>
                <div className="flex ">
                  <label className={labelStyle}>Consumed Budget</label>
                  <span className="ml-0.5 text-red-500">*</span>
                  <div className="flex items-center justify-center ml-2 relative">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <img
                            src={InfoCircle}
                            className="h-[16px] w-[16px]"
                            alt="InfoCircle"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {" "}
                            Consumed budget will affect the SPI and CPI
                            calculation{" "}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              <input
                disabled={viewOnly}
                type="text"
                name="consumedBudget"
                placeholder="Consumed budget"
                className={inputStyle}
                value={formik.values.consumedBudget ?? ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <span className={errorStyle}>
                {formik.touched.consumedBudget && formik.errors.consumedBudget}
              </span>
            </div>
            <div className="sm:w-[50%] w-full flex items-center justify-between gap-4">
              <div className="text-sm text-gray-400 font-semibold mt-6">
                {editData && editData.actualEndDate && (
                  <div>
                    <div>Actual end date</div>
                    {editData.actualEndDate ? dateFormater(new Date(editData.actualEndDate)) : "N/A"}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-400 font-semibold  mt-6">
                {editData && (
                  <div>
                    <div>Est. duration</div>
                    {editData.estimatedDuration ? editData.estimatedDuration : "N/A"}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-400 font-semibold  mt-6">
                {editData && (
                  <div>
                    <div>Actual duration</div>
                    {editData.actualDuration ? editData.actualDuration :"N/A" }
                  </div>
                )}
              </div>
            </div>

            {/* {user.user?.userOrganisation[0].role === UserRoleEnumValue.ADMINISTRATOR && <div className="sm:w-[50%] w-full mt-8">
              <Button variant={"outline"} className="h-12 w-full" onClick={()=>navigate(`organization/${localStorage.getItem("organization-id")}`)}>
                <div className="text-left flex items-center text-gray-400" > 
                  <div className="text-2xl text-center">&#x2b;</div> 
                  <div className="mt-1">Add member to organization</div>
                </div>
              </Button>
            </div>} */}
          </div>

          {!viewOnly && (
            <div className="flex justify-end mt-6 lg:mt-2 gap-2">
              <Button
                size={"sm"}
                variant={"primary_outline"}
                className="font-medium text-lg"
                onClick={props.cancel}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant={"primary"}
                className="font-medium text-lg px-5"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                size={"sm"}
                type="submit"
              >
                Save
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateProjectNoPopUpForm;
