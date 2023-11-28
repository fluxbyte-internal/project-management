import CrossIcon from "../../assets/svg/CrossIcon.svg";
import { Button } from "../ui/button";
import { useFormik } from "formik";
import kanaban from "../../assets/svg/KanbanView.svg";
import gantt from "../../assets/svg/Gantt.svg";
import calendar from "../../assets/svg/Calendar.svg";
import list from "../../assets/svg/List.svg";
import InfoCircle from "../../assets/svg/Info circle.svg";
import { useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createProjectSchema } from "@backend/src/schemas/projectSchema";
import { z } from "zod";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";

type addProjectType = {
  handleClosePopUp: () => void;
};

const RadioButtonData = [
  {
    id: 1,
    title: "Kanban",
    description: "Unlock the Power of Visual Project Management with Kanban",
    img: kanaban,
  },
  {
    id: 2,
    title: " Gantt",
    description: "Track Milestones and Deadlines with Gantt Charts",
    img: gantt,
  },
  {
    id: 3,
    title: " Calendar",
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

function CreateUpdateProjectForm(props: addProjectType) {
  const { handleClosePopUp } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const errorStyle = "text-red-400 block text-sm h-1";
  const labelStyle = "font-medium text-base text-gray-700 ";
  const inputStyle =
    "py-1.5 px-3 rounded-md border border-gray-100 mt-2 w-full h-[46px]";

  const formik = useFormik<z.infer<typeof createProjectSchema>>({
    initialValues: {
      projectName: "",
      projectDescription: "",
      startDate: new Date(),
      estimatedEndDate: new Date(),
      estimatedBudget: "",
      defaultView: "KANBAN",
    },
    validationSchema: toFormikValidationSchema(createProjectSchema),
    onSubmit: (_, { resetForm }) => {
      setIsSubmitting(true);
      resetForm();
        setIsSubmitting(false);
    },
  });

  const handleRadioChange = (value: string) => {
    formik.setFieldValue("defaultView", value);
  };

  return (
    <div className="fixed bg-[#00000066] w-full top-0 h-full items-center flex justify-center z-50">
      <div className="lg:rounded-lg border border-white bg-[#fff] md:max-w-5xl w-full flex flex-col h-full lg:max-h-[690px] max-h-screen lg:overflow-y-auto ">
        <div className="flex justify-between py-5 lg:px-12 px-4 border-b border-gray-100 lg:border-none">
          <div className="text-2xl lg:text-3xl font-bold text-gray-500 ">Create New Project</div>
          <div
            onClick={handleClosePopUp}
            className="flex items-center justify-center cursor-pointer"
          >
            <img src={CrossIcon}></img>
          </div>
        </div>
        <div className="lg:px-16 px-4 overflow-y-auto max-h-screen">
          <div className="lg:flex rounded-lg border border-gray-100 lg:justfy-center mt-4">
            <div className="p-5 ">
              <form onSubmit={formik.handleSubmit}>
                <div className="w-full lg:flex lg:gap-[100px]">
                  <div className="flex gap-4 flex-col lg:w-[50%]">
                    <div className="text-left">
                      <label className={labelStyle}>Name</label>

                      <input
                        type="text"
                        name="projectName"
                        placeholder="Project One"
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
                      <label className={labelStyle}>Descrption</label>

                      <textarea
                        rows={5}
                        cols={30}
                        name="projectDescription"
                        placeholder="Placeholder"
                        className="py-1.5 px-3 rounded-md border border-gray-100 mt-2 w-full"
                        value={formik.values.projectDescription}
                        onChange={(e) => {
                          if (e.target.value.length <= 50) {
                            formik.handleChange(e);
                          }
                        }}
                        onBlur={formik.handleBlur}
                      />
                      <span className="flex justify-between">
                        <span className={errorStyle}>
                          {formik.touched.projectDescription &&
                            formik.errors.projectDescription}
                        </span>
                        <span className="text-sm text-gray-500 font-normal block text-right ">
                          {formik.values.projectDescription.length}/50
                        </span>
                      </span>
                    </div>

                    <div className="sm:flex sm:gap-[10px] w-full">
                      <div className="text-left sm:w-1/2">
                        <label className={labelStyle}>Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          className={inputStyle}
                          value={formik.values.startDate as unknown as string }
                          placeholder="Placeholder"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span className={errorStyle}>
                          {formik.touched.startDate && formik.errors.startDate as string}
                        </span>
                      </div>
                      <div className="text-left sm:w-1/2">
                        <label className="font-medium text-base text-gray-700 flex gap-3 mt-4 sm:mt-0">
                          Estimated End date
                          <div
                            className="flex items-center justify-center relative"
                          >
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
                                  <p> Estimated End date</p>
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
                          value={formik.values.estimatedEndDate as unknown as string ?? ""}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        <span className={errorStyle}>
                          {formik.touched.estimatedEndDate &&
                            formik.errors.estimatedEndDate as string}
                        </span>
                      </div>
                    </div>

                    <div className="text-left">
                      <label className={labelStyle}>Estimated Budget</label>
                      <input
                        type="text"
                        name="estimatedBudget"
                        placeholder="2,00,000 USD"
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
                  <div className="lg:w-[50%]">
                    <div className="text-xl font-medium mb-5 text-gray-700 mt-4 lg:mt-0">
                      Default View
                    </div>
                    <div className="flex flex-col gap-5 ">
                      {RadioButtonData.map((radioButton) => (
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
                              onChange={() =>
                                handleRadioChange(
                                  radioButton.title.toUpperCase()
                                )
                              }
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <svg
                        aria-hidden="true"
                        className="inline w-4 h-4 mx-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-800"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    )}
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
