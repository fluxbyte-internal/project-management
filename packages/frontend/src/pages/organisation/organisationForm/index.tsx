import { useFormik } from "formik";
import closeImage from "../../../assets/png/close.png";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  createOrganisationSchema,
  updateOrganisationSchema,
} from "../../../../../backend/src/schemas/organisationSchema";
import useOrganisationMutation, {
  OrganisationType,
} from "@/api/mutation/useOrganisationMutation";
import { isAxiosError } from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import { useEffect, useState } from "react";
import Select, { SingleValue, MultiValue } from "react-select";
import { useNavigate } from "react-router-dom";
import countries from "../../../assets/json/countries.json";
import ErrorMessage from "@/components/common/ErrorMessage";
import useOrganisationUpdateMutation from "@/api/mutation/useOrganisationUpdateMutation";
import { toast } from "react-toastify";
import { OrgStatusEnumValue } from "@backend/src/schemas/enums";

interface Props {
  close: () => void;
  editData?: OrganisationType;
}
type Options = { label: string; value: string };

function OrganisationForm(props: Props) {
  const { close, editData } = props;
  const labelStyle = "block text-gray-500 text-sm font-bold mb-1";
  const inputStyle =
    "block w-full p-2.5 border border-gray-100 text-gray-500 text-sm rounded-md shadow-sm placeholder:text-gray-400";
  const organisationMutation = useOrganisationMutation();

  const organisationUpdateMutation = useOrganisationUpdateMutation(
    editData && editData.organisationId ? editData.organisationId : ""
  );
  const { refetch } = useCurrentUserQuery();
  const navigate = useNavigate();

  const [countryValue, setContryValue] = useState<SingleValue<Options>>();
  const [industryValue, setIndustryValue] = useState<SingleValue<Options>>();
  const [nonWorkingDaysValue, setNonWorkingDaysValue] =
    useState<MultiValue<Options>>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formik = useFormik<z.infer<typeof createOrganisationSchema>>({
    initialValues: {
      organisationName: "",
      industry: "",
      status:  OrgStatusEnumValue.ACTIVE,
      nonWorkingDays: [],
      country: "",
    },
    validationSchema: editData
      ? toFormikValidationSchema(updateOrganisationSchema)
      : toFormikValidationSchema(createOrganisationSchema),
    onSubmit: (values, helper) => {
      setIsSubmitting(true);
      if (editData && editData.organisationId) {
        organisationUpdateMutation.mutate(values, {
          onSuccess(data) {
            toast.success(data.data.message);
            close();
            refetch();
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
              if (!Array.isArray(error.response?.data.errors)) {
                toast.error(
                  error.response?.data?.message ??
                    "An unexpected error occurred."
                );
              }
              setIsSubmitting(false);
            }
          },
        });
      } else {
        organisationMutation.mutate(values, {
          onSuccess(data) {
            toast.success(data.data.message);
            localStorage.setItem(
              "organisation-id",
              data.data.data.organisationId
            );
            close();
            refetch().then(() => {
              navigate("/projects");
            });
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
              if (!Array.isArray(error.response?.data.errors)) {
                toast.error(
                  error.response?.data?.message ??
                    "An unexpected error occurred."
                );
              }
            }
            setIsSubmitting(false);
          },
        });
      }
    },
  });
  useEffect(() => {
    setNonWorkingDaysValue([nonWorkingDays[0],nonWorkingDays[6]])
    formik.setFieldValue(
      "nonWorkingDays",
      [nonWorkingDays[0],nonWorkingDays[6]].map((item) => {
        return item.value;
      })
    );
    if (editData) {
      formik.setValues({
        country: editData.country,
        industry: editData.industry,
        nonWorkingDays: editData.nonWorkingDays,
        organisationName: editData.organisationName,
        status: editData?.status,
      });
      if (editData.industry) {
        setIndustryValue({
          value: editData.industry,
          label: editData.industry,
        });
      }
      const country = countries.find((item) => {
        if (editData.country === item.isoCode) {
          return { label: item.name, value: item.isoCode };
        }
      });
      const setNonWorkingDays = editData.nonWorkingDays.map((item) => {
        return nonWorkingDays.find((i) => item == i.value);
      });
      if (country && setNonWorkingDays) {
        setContryValue({ label: country?.name, value: country?.isoCode });
        setNonWorkingDaysValue(setNonWorkingDays as MultiValue<Options>);
      }
    }
  }, []);

  const reactSelectStyle = {
    control: (
      provided: Record<string, unknown>,
      state: { isFocused: boolean }
    ) => ({
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
  const industriesData: Options[] = [
    { label: "IT", value: "IT" },
    { label: "Banking", value: "Banking" },
    { label: "Insurance", value: "Insurance" },
    { label: "Education", value: "Education" },
    { label: "Chemicals", value: "Chemicals" },
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
    }if(val.find(d=> d.label == "None")
    ){
      formik.setFieldValue(
        "nonWorkingDays",[]
      );
      setNonWorkingDaysValue([])
    }
  };
  const handleIndustries = (val: SingleValue<Options>) => {
    if (val) {
      setIndustryValue(val);
      formik.setFieldValue("industry", val.value);
    }
  };
  return (
    <div className="absolute w-full h-full z-50 top-full left-full -translate-x-full -translate-y-full flex justify-center items-center bg-gray-900 bg-opacity-50 ">
      <div className="bg-white rounded-lg shadow-md px-2.5 md:px-6 lg:px-8 pt-6 pb-8 mb-4 md:w-3/4 w-11/12 lg:w-[40rem]">
        <div className="flex justify-between my-1 mb-5">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-500">
            {editData && editData.organisationId
              ? "Update Organisation"
              : "Create Organisation"}
          </h1>
          <button onClick={close} className="cursor-pointer">
            <img src={closeImage} alt="close" className="w-5" />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label className={labelStyle}>
              Organisation Name
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <input
              className={inputStyle}
              name="organisationName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.organisationName}
              type="text"
              placeholder="Organisation name"
            />
            <ErrorMessage>
              {formik.touched.organisationName &&
                formik.errors.organisationName}
            </ErrorMessage>
          </div>
          <div>
            <label className={labelStyle}>
              Industry
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Select
              className={`${inputStyle} select !p-0`}
              onChange={handleIndustries}
              onBlur={() => formik.setTouched({ industry: true })}
              options={industriesData}
              value={industryValue}
              name="industry"
              placeholder="Industry"
              styles={reactSelectStyle}
            />
            <ErrorMessage>
              {formik.touched.industry && formik.errors.industry}
            </ErrorMessage>
          </div>
          <div>
            <label className={labelStyle}>
              Non Working Days
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Select
              className={`${inputStyle} select !p-0`}
              onChange={handleNonWorkingDays}
              onBlur={() => formik.setTouched({ nonWorkingDays: true })}
              options={nonWorkingDays}
              value={nonWorkingDaysValue}
              defaultValue={nonWorkingDaysValue}
              name="nonWorkingDays"
              placeholder="Select non-working days"
              isMulti
              styles={reactSelectStyle}
            />
            <ErrorMessage>
              {formik.touched.nonWorkingDays && formik.errors.nonWorkingDays}
            </ErrorMessage>
          </div>
          <div>
            <label className={labelStyle}>
              Country
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Select
              className={`${inputStyle} select !p-0`}
              onChange={handleCountry}
              onBlur={() => formik.setTouched({ country: true })}
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
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full py-2.5 mt-5 rounded-md hover:bg-opacity-80 disabled:bg-opacity-50"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default OrganisationForm;
