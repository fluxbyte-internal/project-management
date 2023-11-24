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
  const [showTooltip, setshowTooltip] = useState<boolean>(false);

  const errorStyle = "text-red-400 block  text-sm h-1";
  const labelStyle = "font-medium text-base text-gray-700 ";
  const inputStyle =
    "py-1.5 px-3 rounded-md border border-gray-100  mt-2  w-full h-[46px]";

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
      resetForm();
    },
  });

  const handleRadioChange = (value: string) => {
    formik.setFieldValue("defaultView", value);
  };

  return (
    <div className="fixed bg-[#00000066] w-full top-0 h-full items-center flex justify-center z-50">
      <div className="lg:rounded-lg  border border-white bg-[#fff] md:max-w-5xl  w-full  flex flex-col h-full  lg:max-h-[690px] max-h-screen lg:overflow-y-auto ">
        <div className="flex justify-between py-5 lg:px-12 px-4 border-b border-gray-100 lg:border-none">
          <div className="font-semibold text-2xl ">Create New Project</div>
          <div
            onClick={handleClosePopUp}
            className="flex items-center justify-center "
          >
            <img src={CrossIcon}></img>
          </div>
        </div>
        <div className="lg:px-16 px-4 overflow-y-auto max-h-screen">
          <div className="lg:flex rounded-lg  border border-gray-100  lg:justfy-center lg:mb-5 mt-4">
            <div className="p-5 ">
              <form onSubmit={formik.handleSubmit}>
                <div className="w-full lg:flex  lg:gap-[100px]">
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
                    <div className=" text-left">
                      <label className={labelStyle}>Descrption</label>

                      <textarea
                        rows={5}
                        cols={30}
                        name="projectDescription"
                        placeholder="Placeholder"
                        className="py-1.5 px-3 rounded-md border border-gray-100  mt-2  w-full"
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
                        <span className="text-sm text-gray-500  font-normal block text-right ">
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
                        <label className="font-medium text-base text-gray-700  flex gap-3 mt-4 sm:mt-0">
                          Estimated End date
                          <div
                            className="flex items-center justify-center relative"
                            onMouseEnter={() => setshowTooltip(true)}
                            onMouseLeave={() => setshowTooltip(false)}
                          >
                            {showTooltip ? (
                              <div className="absolute bottom-4 left-3 bg-white p-1 border-gray-100 border rounded-md text-xs hauto w-auto ">
                                Hi
                              </div>
                            ) : null}
                            <img
                              src={InfoCircle}
                              className="h-[16px] w-[16px]"
                              alt="InfoCircle"
                            />
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
                    <div className="text-xl font-medium  mb-5 text-gray-700 mt-4 lg:mt-0">
                      Default View
                    </div>
                    <div className="flex flex-col gap-5 ">
                      {RadioButtonData.map((radioButton) => (
                        <div
                          key={radioButton.id}
                          className={`h-full w-full rounded-[5px] border ${
                            formik.values.defaultView ===
                            radioButton.title.toUpperCase()
                              ? " border-primary-200 "
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
                    variant={"none"}
                    className="bg-primary-400 text-primary-800 font-medium text-lg"
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
