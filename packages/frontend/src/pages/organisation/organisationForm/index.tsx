import { useFormik } from "formik";
import closeImage from "../../../assets/png/close.png";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createOrganisationSchema } from "../../../../../backend/src/schemas/organisationSchema";
import useOrganisationMutation from "@/api/mutation/useOrganisationMutation";
import { isAxiosError } from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import Select, { SingleValue, MultiValue } from "react-select";
import { useNavigate } from "react-router-dom";
interface Props {
  close: () => void;
}
type Options = { label: string; value: string };

function OrganisationForm(props: Props) {
  const { close } = props;
  const errorStyle = "text-red-400 text-sm mb-3 ml-2.5";
  const labelStyle = "block text-gray-500 text-sm font-bold mb-1";
  const inputStyle =
    "block w-full p-2.5 border-gray-300 text-gray-500 text-sm rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 placeholder:text-gray-400";

  const organisationMutation = useOrganisationMutation();
  const { refetch } = useCurrentUserQuery();
  const navigate = useNavigate();

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
      organisationMutation.mutate(values, {
        onSuccess(organisationData) {
          localStorage.setItem(
            "organisation-id",
            organisationData.data.data.organisationId
          );
          refetch().then((res) => {
            if (res.data?.data.data.userOrganisation.length) {
              navigate("/projects");
            }
            close();
          });
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

  const nonWorkingDays: Options[] = [
    { label: "Sunday", value: "SUN" },
    { label: "Monday", value: "MON" },
    { label: "Tuesday", value: "TUE" },
    { label: "Wednesday", value: "WED" },
    { label: "Thursday", value: "THU" },
    { label: "Friday", value: "FRI" },
    { label: "Saturday", value: "SAT" },
  ];
  const [countryValue, setContryValue] = useState<SingleValue<Options>>();
  const [nonWorkingDaysValue, setNonWorkingDaysValue] =
    useState<MultiValue<Options>>();
  const contrysFn = () => {
    const value = countries.map((item) => {
      return { label: item.name, value: item.isoCode };
    });
    return value;
  };
  const handleCountry = (val: SingleValue<Options>) => {
    if (val) {
      setContryValue(val);
      formik.setFieldValue("country", val?.value);
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
          <button onClick={close}>
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
            <span className={errorStyle}>
              {formik.touched.organisationName &&
                formik.errors.organisationName}
            </span>
          </div>
          <div>
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
          <div>
            <label className={labelStyle}>Working Days</label>
            <Select
              className={`${inputStyle} select !p-0`}
              onChange={handleNonWorkingDays}
              onBlur={formik.handleBlur}
              options={nonWorkingDays}
              value={nonWorkingDaysValue}
              name="nonWorkingDays"
              placeholder="Select nonworkingdays"
              isMulti
            />
            <span className={errorStyle}>
              {formik.touched.nonWorkingDays && formik.errors.nonWorkingDays}
            </span>
          </div>
          <div>
            <label className={labelStyle}>Country</label>
            <Select
              className={`${inputStyle} select !p-0`}
              onChange={handleCountry}
              onBlur={formik.handleBlur}
              options={contrysFn()}
              value={countryValue}
              placeholder="Select country"
              name="country"
            />

            <span className={errorStyle}>
              {formik.touched.country && formik.errors.country}
            </span>
          </div>
          <div>
            <Button
              type="submit"
              variant={"primary"}
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
