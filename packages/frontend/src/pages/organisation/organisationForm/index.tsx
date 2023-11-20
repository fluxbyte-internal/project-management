import { useFormik } from "formik";
import closeImage from "../../../assets/png/close.png";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createOrganisationSchema } from "../../../../../backend/src/schemas/organisationSchema";
import useOrganisationMutation from "@/api/mutation/useOrganisationMutation";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  close: () => void;
}

function OrganisationForm(props: Props) {
  const { close } = props;
  const errorStyle = "text-red-400 mt text-sm mb-3 ml-2.5";
  const labelStyle = "block text-gray-500 text-sm font-bold mb-1";
  const inputStyle =
    "block w-full p-2.5 border-gray-300 text-gray-500 text-sm rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50  placeholder:text-gray-400";
  const navigate = useNavigate();
  const organisationMutation = useOrganisationMutation();

  type FormValues = {
    organisationName: string;
    industry: string;
    status: string;
    listOfNonWorkingDays: number;
    country: string;
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      organisationName: "",
      industry: "",
      status: "ACTIVE",
      listOfNonWorkingDays: 1,
      country: "",
    },
    validationSchema: toFormikValidationSchema(createOrganisationSchema),
    onSubmit: (values, helper) => {
      organisationMutation.mutate(values, {
        onSuccess(data) {
          localStorage.setItem(
            "organisation-id",
            data.data.data.organisationId
          );
          navigate("/");
        },
        onError(error) {
          if (isAxiosError(error)) {
            if (
              error.response?.status === 400 &&
              error.response.data?.errors &&
              Array.isArray(error.response?.data.errors)
            ) {
              error.response.data.errors.map(
                (item: { message: string; path: [string] }) => {
                  helper.setFieldError(item.path[0], item.message);
                }
              );
            }
          }
        },
      });
    },
  });

  return (
    <div className="absolute w-full h-full top-full left-full -translate-x-full -translate-y-full flex justify-center items-center bg-primary-900 bg-opacity-50 ">
      <div className="bg-white rounded-lg shadow-md px-2.5 md:px-6 lg:px-8 pt-6 pb-8 mb-4 md:w-3/4 w-11/12 lg:w-[40rem]">
        <div className="flex justify-between my-1 mb-5">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-500">
            Create new organisation
          </h1>
          <button onClick={close}>
            <img src={closeImage} alt="close" className="w-5" />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="">
            <label className={labelStyle}>Organisation Name</label>
            <input
              className={inputStyle}
              name="organisationName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.organisationName}
              type="text"
              placeholder="Organisation Name"
            />
            <span className={errorStyle}>
              {formik.touched.organisationName &&
                formik.errors.organisationName}
            </span>
          </div>
          <div className="">
            <label className={labelStyle}>Industry</label>
            <input
              className={inputStyle}
              name="industry"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.industry}
              type="text"
              placeholder="Industry"
            />
            <span className={errorStyle}>
              {formik.touched.industry && formik.errors.industry}
            </span>
          </div>
          <div className="">
            <label className={labelStyle}>Working Days</label>
            <input
              className={inputStyle}
              name="listOfNonWorkingDays"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.listOfNonWorkingDays}
              type="number"
              min={0}
              max={7}
              placeholder="Working Days"
            />
            <span className={errorStyle}>
              {formik.touched.listOfNonWorkingDays &&
                formik.errors.listOfNonWorkingDays}
            </span>
          </div>
          <div className="">
            <label className={labelStyle}>Country</label>
            <select
              className={inputStyle}
              name="country"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.country}
              placeholder="Country"
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Khalistan">Khalistan</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="China">China</option>
            </select>
            <span className={errorStyle}>
              {formik.touched.country && formik.errors.country}
            </span>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-warning py-2.5 mt-5 rounded-md hover:bg-opacity-80 disabled:bg-opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default OrganisationForm;
