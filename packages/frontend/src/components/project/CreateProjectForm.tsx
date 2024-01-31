import CrossIcon from "../../assets/svg/CrossIcon.svg";
import { Button } from "../ui/button";
import { useFormik } from "formik";
import kanaban from "../../assets/svg/KanbanView.svg";
import gantt from "../../assets/svg/Gantt.svg";
import calendar from "../../assets/svg/Calendar.svg";
import list from "../../assets/svg/List.svg";
import InfoCircle from "../../assets/svg/Info circle.svg";
import { useEffect, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  createProjectSchema,
  updateProjectSchema,
} from "@backend/src/schemas/projectSchema";
import { z } from "zod";
import useProjectMutation from "@/api/mutation/useProjectMutation";
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
import { useNavigate } from "react-router-dom";

type Options = { label: string; value: string };

type AddProjectType = {
  handleClosePopUp: () => void;
  editData?: Project;
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

function CreateUpdateProjectForm(props: AddProjectType) {
  const { handleClosePopUp, editData } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const errorStyle = "text-red-400 block text-sm h-1";
  const labelStyle = "font-medium text-base text-gray-700 ";
  const inputStyle =
    "py-1.5 px-3 rounded-md border border-gray-100 mt-2 w-full h-[46px]";
  const projectMutation = useProjectMutation();
  const projectUpdateMutation = useProjectUpdateMutation(
    editData ? editData.projectId : ""
  );
  const [currencyValue, setCurrencyValue] = useState<SingleValue<Options>>();

  const projectQuery = useProjectQuery();
  const navigate = useNavigate();
  const formik = useFormik<z.infer<typeof createProjectSchema>>({
    initialValues: {
      projectName: "",
      projectDescription: "",
      startDate: "" as unknown as Date,
      estimatedEndDate: "" as unknown as Date,
      estimatedBudget: "",
      defaultView: "KANBAN",
      currency: "USD",
    },
    validationSchema:
      editData && editData.projectId
        ? toFormikValidationSchema(updateProjectSchema)
        : toFormikValidationSchema(createProjectSchema),
    onSubmit: (values, helper) => {
      if (editData && editData.projectId) {
        projectUpdateMutation.mutate(values, {
          onSuccess(data) {
            projectQuery.refetch();
            formik.resetForm();
            handleClosePopUp();
            setIsSubmitting(false);
            toast.success(data.data.message);
            navigate("/projects/");
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
      } else {
        projectMutation.mutate(values, {
          onSuccess(data) {
            projectQuery.refetch();
            formik.resetForm();
            handleClosePopUp();
            toast.success(data.data.message);
            navigate("/projects/");
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
      });
      setCurrencyValue({ label: editData.currency, value: editData.currency });
    }
  }, []);

  const currencyFn = () => {
    const value = countries.map((item) => {
      return { label: item.currency, value: item.currency };
    });
    return value;
  };

  const reactSelectStyle = {
    control: (
      provided: Record<string, unknown>,
      state: { isFocused: boolean }
    ) => ({
      ...provided,
      border: "1px solid #E7E7E7",
      paddingTop: "0.2rem",
      paddingBottom: "0.2rem",
      zIndex: 1000,
      outline: state.isFocused ? "2px solid #943B0C" : "0px solid #E7E7E7",
      boxShadow: state.isFocused ? "0px 0px 0px #943B0C" : "none",
      "&:hover": {
        outline: state.isFocused ? "1px solid #943B0C" : "1px solid #E7E7E7",
        boxShadow: "0px 0px 0px #943B0C",
      },
    }),
  };

  const handleCurrency = (val: SingleValue<Options>) => {
    if (val) {
      setCurrencyValue(val);
      formik.setFieldValue("currency", val.value);
    }
  };
  return (
    <div className="fixed bg-[#00000066] w-full top-0 h-full items-center flex justify-center z-50">
      <div className="lg:rounded-lg border border-white bg-[#fff] md:max-w-5xl w-full flex flex-col h-full lg:max-h-[690px] max-h-screen overflow-y-auto ">
        <div className="flex justify-between py-5 lg:px-12 px-4 border-b border-gray-100 lg:border-none">
          <div className="text-2xl lg:text-3xl font-bold text-gray-500 ">
            Create New Project
          </div>
          <div
            onClick={handleClosePopUp}
            className="flex items-center justify-center cursor-pointer"
          >
            <img src={CrossIcon}></img>
          </div>
        </div>
        <div className="lg:px-16 px-4 overflow-y-auto lg:overflow-hidden max-h-screen">
          <div className="lg:flex rounded-lg border border-gray-100 lg:justfy-center mt-4">
            <div className="p-5 ">
              <form onSubmit={formik.handleSubmit}>
                <div className="w-full lg:flex lg:gap-[100px]">
                  <div className="flex gap-4 flex-col lg:w-[50%]">
                    <div className="text-left">
                      <label className={labelStyle}>
                        Name
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        placeholder="Project one"
                        className={inputStyle}
                        value={formik.values.projectName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <span className={errorStyle}>
                        {formik.touched.projectName &&
                          formik.errors.projectName}
                      </span>
                    </div>
                    <div className="text-left">
                      <label className={labelStyle}>
                        Description
                        <span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        cols={30}
                        name="projectDescription"
                        placeholder="Placeholder"
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
                          type="date"
                          name="estimatedEndDate"
                          className={inputStyle}
                          placeholder="Placeholder"
                          value={
                            (formik.values
                              .estimatedEndDate as unknown as string) ?? ""
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
                        <input
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
                            radioButton.title.toUpperCase()
                              ? " border-2 border-primary-800 "
                              : " border-gray-100"
                          }`}
                        >
                          <label className="flex lg:gap-3.5 gap-4 px-5 py-2.5 items-center h-full cursor-pointer">
                            <input
                              type="radio"
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

                <div className="flex justify-center mt-6 lg:mt-2">
                  <Button
                    type="submit"
                    variant={"primary"}
                    className="font-medium text-lg"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateUpdateProjectForm;
