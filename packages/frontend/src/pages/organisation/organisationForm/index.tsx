import {  useFormik } from "formik";
import closeImage from "../../../assets/png/close.png";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createOrganisationSchema } from "../../../../../backend/src/schemas/organisationSchema";
import useOrganisationMutation from "@/api/mutation/useOrganisationMutation";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import { useState } from "react";
import Select, { SingleValue, MultiValue } from "react-select";
import countries from "../../../assets/json/countries.json";
import ErrorMessage from "@/components/common/ErrorMessage";
interface Props {
  close: () => void;
}
type Options = { label: string; value: string };

function OrganisationForm(props: Props) {
  const { close } = props;
  const labelStyle = "block text-gray-500 text-sm font-bold mb-1";
  const inputStyle =
    "block w-full p-2.5 border border-gray-100 text-gray-500 text-sm rounded-md shadow-sm placeholder:text-gray-400";
  const navigate = useNavigate();
  const organisationMutation = useOrganisationMutation();
  const { refetch, isFetched } = useCurrentUserQuery();
  
  const [countryValue, setContryValue] = useState<SingleValue<Options>>();
  const [nonWorkingDaysValue, setNonWorkingDaysValue] =
    useState<MultiValue<Options>>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formik = useFormik<z.infer<typeof createOrganisationSchema>>({
    initialValues: {
      organisationName: "",
      industry: "",
      status: "ACTIVE",
      nonWorkingDays: [],
      country: "",
    },
    validationSchema: toFormikValidationSchema(createOrganisationSchema),
    onSubmit: (values, helper) => {
      setIsSubmitting(true);
      organisationMutation.mutate(values, {
        onSuccess(data) {
          localStorage.setItem(
            "organisation-id",
            data.data.data.organisationId
          );
          close();
          refetch();
          if (isFetched) {
            navigate("/projects");
          }
          setIsSubmitting(false);
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
          setIsSubmitting(false);
        },
      });
    },
  });
  const reactSelectStyle={
    control: (provided: Record<string, unknown>, state: { isFocused: boolean; }) => ({
      ...provided,
      border: state.isFocused ? "2px solid #943B0C" : "0px solid #943B0C",
      boxShadow: state.isFocused ? "2px #943B0C" : "none",
      "&:hover": {
        border: state.isFocused ? "2px solid #943B0C" : "0px solid #943B0C",
        boxShadow: "1px 0px 0px #943B0C",
      },
    }),
  };
  const nonWorkingDays: Options[] = [
    { label: "Sunday", value: "SUN" },
    { label: "Monday", value: "MON" },
    { label: "Tuesday", value: "TUE" },
    { label: "Wednesday", value: "WED" },
    { label: "Thursday", value: "THU" },
    { label: "Friday", value: "FRI" },
    { label: "Saturday", value: "SAT" },
  ];

  const contrysFn = () => {
    const value = countries.map((item) => {
      return { label: item.name, value: item.isoCode };
    });
    return value;
  };
  const handleCountry = (val: SingleValue<Options>) => {
    if (val) {
      setContryValue(val);
      formik.setFieldValue("country", val.value);
    }
  };
  const handleNonWorkingDays = (val: MultiValue<Options>) => {
    if (val) {
      setNonWorkingDaysValue(val);
      formik.setFieldValue(
        "nonWorkingDays",
        val.map((item) => {
          return item.value;
        })
      );
    }
  };
  return (
    <div className="absolute w-full h-full z-50 top-full left-full -translate-x-full -translate-y-full flex justify-center items-center bg-gray-900 bg-opacity-50 ">
      <div className="bg-white rounded-lg shadow-md px-2.5 md:px-6 lg:px-8 pt-6 pb-8 mb-4 md:w-3/4 w-11/12 lg:w-[40rem]">
        <div className="flex justify-between my-1 mb-5">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-500">
            Create Organisation
          </h1>
          <button onClick={close} className="cursor-pointer">
            <img src={closeImage} alt="close" className="w-5" />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div>
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
            <ErrorMessage>
              {formik.touched.organisationName &&
                formik.errors.organisationName}
            </ErrorMessage>
          </div>
          <div >
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
            <ErrorMessage>
              {formik.touched.industry && formik.errors.industry}
            </ErrorMessage>
          </div>
          <div>
            <label className={labelStyle}>Working Days</label>
            <Select
              className={`${inputStyle} select !p-0`}
              onChange={handleNonWorkingDays}
              onBlur={()=>formik.setTouched({nonWorkingDays:true})}
              options={nonWorkingDays}
              value={nonWorkingDaysValue}
              name="nonWorkingDays"
              placeholder="Select nonworkingdays"
              isMulti
              styles={reactSelectStyle}
            />
            <ErrorMessage>
              {formik.touched.nonWorkingDays && formik.errors.nonWorkingDays}
            </ErrorMessage>
          </div>
          <div>
            <label className={labelStyle}>Country</label>
            <Select
              className={`${inputStyle} select !p-0`}
              onChange={handleCountry}
              onBlur={()=>formik.setTouched({country:true})}
              options={contrysFn()}
              value={countryValue}
              placeholder="Select country"
              name="country"
              styles={reactSelectStyle}
             
            />
            <ErrorMessage>
              {formik.touched.country && formik.errors.country}
            </ErrorMessage>
          </div>
          <div>
            <Button
              type="submit"
              variant={"primary"}
              className="w-full py-2.5 mt-5 rounded-md hover:bg-opacity-80 disabled:bg-opacity-50"
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
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default OrganisationForm;
