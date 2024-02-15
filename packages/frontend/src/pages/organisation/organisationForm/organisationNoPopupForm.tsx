import { useFormik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';
import { toast } from 'react-toastify';
import {
  TaskColorPaletteEnum,
  userOrgSettingsUpdateSchema,
} from '@backend/src/schemas/userSchema';
import {
  createOrganisationSchema,
  updateOrganisationSchema,
} from '../../../../../backend/src/schemas/organisationSchema';
import countries from '../../../assets/json/countries.json';
import { OrganisationType } from '@/api/mutation/useOrganisationMutation';
import { Button } from '@/components/ui/button';
import useCurrentUserQuery from '@/api/query/useCurrentUserQuery';
import ErrorMessage from '@/components/common/ErrorMessage';
import useOrganisationUpdateMutation from '@/api/mutation/useOrganisationUpdateMutation';
import { useUser } from '@/hooks/useUser';
import useOrgSettingsUpdateMutation from '@/api/mutation/useOrgSettingsUpdateMutation';

interface Props {
  editData?: OrganisationType;
  viewOnly: boolean;
  refetch: () => void;
}
type Options = { label: string; value: string };

function OrganisationNoPopUpForm(props: Props) {
  const { editData, viewOnly } = props;
  const labelStyle = 'block text-gray-500 text-sm font-bold mb-1';
  const inputStyle = `block w-full p-2.5 border border-gray-100 text-gray-500 text-sm rounded-md shadow-sm placeholder:text-gray-400 `;

  const organisationUpdateMutation = useOrganisationUpdateMutation(
    editData && editData.organisationId ? editData.organisationId : '',
  );
  const { refetch } = useCurrentUserQuery();
  const { user } = useUser();

  const orgSettingsUpdateMutation = useOrgSettingsUpdateMutation(
    user?.userOrganisation[0].userOrganisationId ?? '',
  );
  const [countryValue, setContryValue] = useState<SingleValue<Options>>();
  const [industryValue, setIndustryValue] = useState<SingleValue<Options>>();
  const [nonWorkingDaysValue, setNonWorkingDaysValue] =
    useState<MultiValue<Options>>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [IsTaskColourSubmitting, setIsTaskColourSubmitting] = useState(false);
  const formik = useFormik<z.infer<typeof createOrganisationSchema>>({
    initialValues: {
      country: '',
      industry: '',
      nonWorkingDays: [],
      organisationName: '',
      status: 'ACTIVE',
    },
    onSubmit: (values, helper) => {
      setIsSubmitting(true);
      organisationUpdateMutation.mutate(values, {
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
                },
              );
            }
            if (!Array.isArray(error.response?.data.errors)) {
              toast.error(
                error.response?.data?.message ??
                  'An unexpected error occurred.',
              );
            }
            setIsSubmitting(false);
          }
        },
        onSuccess(data) {
          toast.success(data.data.message);
          close();
          refetch();
          props.refetch();
          setIsSubmitting(false);
        },
      });
    },
    validationSchema: toFormikValidationSchema(updateOrganisationSchema),
  });
  const userOrgSettingForm = useFormik<
    z.infer<typeof userOrgSettingsUpdateSchema>
  >({
    initialValues: {
      jobTitle: user?.userOrganisation[0].jobTitle ?? '',
      taskColour:
        user?.userOrganisation[0].taskColour ?? TaskColorPaletteEnum.BLACK,
    },
    onSubmit: (values, helper) => {
      setIsTaskColourSubmitting(true);
      orgSettingsUpdateMutation.mutate(values, {
        onError(error) {
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
                  'An unexpected error occurred.',
              );
            }
          }
          setIsTaskColourSubmitting(false);
        },
        onSuccess(data) {
          toast.success(data.data.message);
          setIsTaskColourSubmitting(false);
          refetch();
        },
      });
    },
    validationSchema: toFormikValidationSchema(userOrgSettingsUpdateSchema),
  });
  // const taskColors = Object.keys(TaskColorPaletteEnum).map((colorPalette) => {
  //   const color =
  //     TaskColorPaletteEnum[colorPalette as keyof typeof TaskColorPaletteEnum];
  //   const colors = color.split(" ");
  //   return {
  //     colorPalette,
  //     color,
  //     textColor: colors[0],
  //     bgColor: colors[1],
  //   };
  // });

  useEffect(() => {
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
          label: editData.industry,
          value: editData.industry,
        });
      }
      const country = countries.find((item) => {
        if (editData.country === item.isoCode) {
          return { label: item.name, value: item.isoCode };
        }
      });
      const setNonWorkingDays = editData.nonWorkingDays.map((item) => {
        return nonWorkingDays.find((i) => item === i.value);
      });
      if (country && setNonWorkingDays) {
        setContryValue({ label: country?.name, value: country?.isoCode });
        setNonWorkingDaysValue(setNonWorkingDays as MultiValue<Options>);
      }
    }
  }, [editData]);

  const reactSelectStyle = {
    control: (
      provided: Record<string, unknown>,
      state: { isFocused: boolean },
    ) => ({
      ...provided,
      '&:hover': {
        boxShadow: '0px 0px 0px #943B0C',
        outline: state.isFocused ? '2px solid #943B0C' : '1px solid #E7E7E7',
      },
      border: '1px solid #E7E7E7',
      boxShadow: state.isFocused ? '0px 0px 0px #943B0C' : 'none',
      outline: state.isFocused ? '2px solid #943B0C' : '1px solid #E7E7E7',
    }),
  };
  const nonWorkingDays: Options[] = [
    { label: 'Sunday', value: 'SUN' },
    { label: 'Monday', value: 'MON' },
    { label: 'Tuesday', value: 'TUE' },
    { label: 'Wednesday', value: 'WED' },
    { label: 'Thursday', value: 'THU' },
    { label: 'Friday', value: 'FRI' },
    { label: 'Saturday', value: 'SAT' },
  ];
  const industriesData: Options[] = [
    { label: 'IT', value: 'IT' },
    { label: 'Banking', value: 'Banking' },
    { label: 'Insurance', value: 'Insurance' },
    { label: 'Education', value: 'Education' },
    { label: 'Chemicals', value: 'Chemicals' },
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
      formik.setFieldValue('country', val.value);
    }
  };
  const handleNonWorkingDays = (val: MultiValue<Options>) => {
    if (val) {
      setNonWorkingDaysValue(val);
      formik.setFieldValue(
        'nonWorkingDays',
        val.map((item) => {
          return item.value;
        }),
      );
    }
  };
  const handleIndustries = (val: SingleValue<Options>) => {
    if (val) {
      setIndustryValue(val);
      formik.setFieldValue('industry', val.value);
    }
  };

  const organisationChange =
    !editData?.country ||
    editData?.country !== formik.values.country ||
    !editData?.industry ||
    editData?.industry !== formik.values?.industry ||
    !editData?.nonWorkingDays ||
    editData?.nonWorkingDays !== formik.values?.nonWorkingDays ||
    !editData?.organisationName ||
    editData?.organisationName !== formik.values?.organisationName;

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (organisationChange) {
      formik.submitForm();
    }
    if (
      user?.userOrganisation[0].taskColour &&
      user?.userOrganisation[0].taskColour !==
        userOrgSettingForm.values.taskColour
    ) {
      userOrgSettingForm.submitForm();
    }
  };

  return (
    <div className="bg-white rounded-lg border px-2 py-1.5 sm:px-5 sm:py-4 w-full">
      <form onSubmit={(e) => submitForm(e)} className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <div className="block col-span-1">
            <label className={labelStyle}>
              Organisation Name
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <input
              disabled={viewOnly}
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
          <div className="block">
            <label className={labelStyle}>
              Industry
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Select
              isDisabled={viewOnly}
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
          <div className="block">
            <label className={labelStyle}>
              Non Working Days
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Select
              isDisabled={viewOnly}
              className={`${inputStyle} select !p-0`}
              onChange={handleNonWorkingDays}
              onBlur={() => formik.setTouched({ nonWorkingDays: true })}
              options={nonWorkingDays}
              value={nonWorkingDaysValue}
              name="nonWorkingDays"
              placeholder="Select non-working days"
              isMulti
              styles={reactSelectStyle}
            />
            <ErrorMessage>
              {formik.touched.nonWorkingDays && formik.errors.nonWorkingDays}
            </ErrorMessage>
          </div>
          <div className="block">
            <label className={labelStyle}>
              Country
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <Select
              isDisabled={viewOnly}
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
        </div>
        {/* <div>
          <FormLabel htmlFor="country">Default color</FormLabel>
          <div className="flex flex-wrap gap-4">
            {taskColors.map((taskColor) => (
              <div
                key={taskColor.colorPalette}
                onClick={() => {
                  !viewOnly &&
                    userOrgSettingForm.setFieldValue(
                      "taskColour",
                      taskColor.color
                    );
                }}
                className={
                  "flex border-[5px] rounded-full overflow-hidden " +
                  `${
                    userOrgSettingForm.values.taskColour === taskColor.color
                      ? "border-primary-500"
                      : "border-primary-100"
                  } ${viewOnly ? "cursor-not-allowed" : "cursor-pointer"}`
                }
              >
                <div
                  className="w-5 h-10"
                  style={{ backgroundColor: taskColor.bgColor }}
                ></div>
                <div
                  className="w-5 h-10"
                  style={{ backgroundColor: taskColor.textColor }}
                ></div>
              </div>
            ))}
          </div>
        </div> */}
        {!viewOnly && (
          <div className="flex justify-end">
            <Button
              type="submit"
              variant={'primary'}
              isLoading={isSubmitting || IsTaskColourSubmitting}
              disabled={isSubmitting || IsTaskColourSubmitting}
              className="py-2.5 mt-5 rounded-md hover:bg-opacity-80 disabled:bg-opacity-50"
            >
              Save
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
export default OrganisationNoPopUpForm;
