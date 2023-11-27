import { useFormik } from "formik";
import closeImage from "../../../assets/png/close.png";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createOrganisationSchema } from "../../../../../backend/src/schemas/organisationSchema";
import useOrganisationMutation from "@/api/mutation/useOrganisationMutation";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import countries from "../../../assets/json/countries.json";
import { useState } from "react";
import {
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandDialog,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
interface Props {
  close: () => void;
}

function OrganisationForm(props: Props) {
  const { close } = props;
  const errorStyle = "text-red-400 text-sm mb-3 ml-2.5";
  const labelStyle = "block text-gray-500 text-sm font-bold mb-1";
  const inputStyle =
    "block w-full p-2.5 border-gray-300 text-gray-500 text-sm rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 placeholder:text-gray-400";
  const navigate = useNavigate();
  const organisationMutation = useOrganisationMutation();
  const { refetch, isFetched } = useCurrentUserQuery();
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState<string[]>([]);
  const nonWorkingDays = [
    { key: "SUN", value: "Sunday" },
    { key: "MON", value: "Monday" },
    { key: "TUE", value: "Tuesday" },
    { key: "WED", value: "Wednesday" },
    { key: "THU", value: "Thursday" },
    { key: "FRI", value: "Friday" },
    { key: "SAT", value: "Saturday" },
  ];
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

  const setValues = (item: string) => {
    const val = item.toUpperCase();
    const isItemInArray = value.includes(val);
    if (isItemInArray) {
      const newArray = value.filter((i) => i !== val);
      setValue(newArray);
      formik.setFieldValue("nonWorkingDays", newArray);
    } else {
      const newArray = [...value, val];
      setValue(newArray);
      formik.setFieldValue("nonWorkingDays", newArray);
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
          <div >
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
            <span className={errorStyle}>
              {formik.touched.industry && formik.errors.industry}
            </span>
          </div>
          <div>
            <label className={labelStyle}>Working Days</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-gray-400"
                  onClick={() => setOpen(true)}
                  aria-expanded={open}
                >
                  {value&&value.length ? value.map((i)=>{return(<span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{i}</span>)}) : "Select framework..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CommandDialog open={open} onOpenChange={() => setOpen(false)}>
                  <CommandInput placeholder="search..."  />
                  <CommandGroup>
                    {nonWorkingDays.map((day) => (
                      <CommandItem
                        key={day.value}
                        value={day.key}
                        onSelect={setValues}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.includes(day.key)  ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {day.value}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandDialog>
              </PopoverContent>
            </Popover>
            <span className={errorStyle}>
              {formik.touched.nonWorkingDays && formik.errors.nonWorkingDays}
            </span>
          </div>
          <div >
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
              {countries.map((country, index) => {
                return (
                  <option key={index} value={country.isoCode}>
                    {country.name}
                  </option>
                );
              })}
            </select>
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
