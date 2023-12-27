import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useFormik } from "formik";
import {
  TaskColorPaletteEnum,
  userOrgSettingsUpdateSchema,
  userUpdateSchema,
} from "@backend/src/schemas/userSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useEffect, useRef, useState } from "react";
import { SingleValue } from "react-select";
import countries from "@/assets/json/countries.json";
import useUserProfileUpdateMutation from "@/api/mutation/useUserProfileUpdateMutation";
import { isAxiosError } from "axios";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import FormLabel from "@/components/common/FormLabel";
import InputText from "@/components/common/InputText";
import InputSelect from "@/components/common/InputSelect";
// import UserOrganisationCard from "./UserOrganisationCard";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useFileUploadMutation from "@/api/mutation/useFileUploadMutation";
import Spinner from "@/components/ui/spinner";
import UserAvatar from "@/components/ui/userAvatar";
import ChangePassword from "@/components/changePassword/ChangePassword";
import useOrgSettingsUpdateMutation from "@/api/mutation/useOrgSettingsUpdateMutation";
import BackArrow from "../../assets/svg/Arrow.svg";

const countryOptions = countries.map((item) => {
  return { label: item.name, value: item.isoCode };
});

function AccountSettings() {
  const { user } = useUser();
  const { refetch: refetchUser } = useCurrentUserQuery();
  const userProfileUpdateMutation = useUserProfileUpdateMutation();
  const [isUserProfileSubmitting, setIsUserProfileSubmitting] = useState(false);

  const [isopenChangePassword, setIsOpenChangePassword] =
    useState<boolean>(false);

  const [isJobTitleSubmitting, setIsJobTitleSubmitting] = useState(false);

  const [countryValue, setCountryValue] =
    useState<SingleValue<(typeof countryOptions)[number]>>();
  const [fileUploading, setFileUploading] = useState(false);
  const avatarImg = useRef<HTMLInputElement>(null);
  const useFileUpload = useFileUploadMutation();
  const orgSettingsUpdateMutation = useOrgSettingsUpdateMutation(
    user?.userOrganisation[0].userOrganisationId ?? ""
  );
  const navigate = useNavigate();


  const userProfileForm = useFormik<z.infer<typeof userUpdateSchema>>({
    initialValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      country: user?.country ?? "",
    },
    validationSchema: toFormikValidationSchema(userUpdateSchema),
    onSubmit: (values, helper) => {
      setIsUserProfileSubmitting(true);
      userProfileUpdateMutation.mutate(values, {
        onSuccess(data) {
          toast.success(data.data.message);
          setIsUserProfileSubmitting(false);
          refetchUser();
        },
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
                error.response?.data?.message ?? "An unexpected error occurred."
              );
            }
          }
          setIsUserProfileSubmitting(false);
        },
      });
    },
  });
  const userOrgSettingForm = useFormik<
    z.infer<typeof userOrgSettingsUpdateSchema>
  >({
    initialValues: {
      jobTitle: user?.userOrganisation[0].jobTitle ?? "",
      taskColour:
        user?.userOrganisation[0].taskColour ?? TaskColorPaletteEnum.BLACK,
    },
    validationSchema: toFormikValidationSchema(userOrgSettingsUpdateSchema),
    onSubmit: (values, helper) => {
      setIsJobTitleSubmitting(true);
      orgSettingsUpdateMutation.mutate(values, {
        onSuccess(data) {
          toast.success(data.data.message);
          setIsJobTitleSubmitting(false);
          refetchUser();
        },
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
                error.response?.data?.message ?? "An unexpected error occurred."
              );
            }
          }
          setIsJobTitleSubmitting(false);
        },
      });
    },
  });
  useEffect(() => {
    setCountryValue(countryOptions.find((c) => c.value === user?.country));
  }, [user?.country]);

  if (!user) return null;

  const userProfileHasChanges =
    !user.firstName ||
    user.firstName !== userProfileForm.values.firstName ||
    !user.lastName ||
    user.lastName !== userProfileForm.values.lastName ||
    !user.country ||
    user.country !== userProfileForm.values.country;

  function fileUpload(image: File | null) {
    if (image) {
      setFileUploading(true);
      const formdata = new FormData();
      formdata.append("avatarImg", image);
      useFileUpload.mutate(formdata, {
        onSuccess() {
          refetchUser()
            .then(() => {
              setFileUploading(false);
            })
            .catch(() => {
              setFileUploading(false);
            });
        },
        onError(error) {
          if (Array.isArray(error.response?.data.errors)) {
            toast.error(
              error.response?.data.errors[0].message ??
                "An unexpected error occurred."
            );
          } else {
            toast.error(
              error.response?.data?.message ?? "An unexpected error occurred."
            );
          }
          setFileUploading(false);
        },
      });
    }
  }

  const handleChangePassword = () => {
    setIsOpenChangePassword(!isopenChangePassword);
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfileHasChanges) {
      userProfileForm.handleSubmit();
    }
    if (
      user.userOrganisation[0].jobTitle !== userOrgSettingForm.values.jobTitle
    ) {
      userOrgSettingForm.handleSubmit();
    }
  };

  return (
    <div className="overflow-auto w-full">
      <div className="max-w-5xl mx-auto p-4 pb-5">
        <div className="text-gray-600 text-lg font-bold mb-4 flex justify-start items-center gap-1">
          <div className="">
            <Button variant={"none"} onClick={() => navigate(-1)}>
              <img src={BackArrow} className="" />
            </Button>
          </div>
          Account Settings
        </div>
        <div className="grid lg:grid-cols-4 gap-2">
          <div className="text-center text-gray-700 text-sm space-y-2 flex  flex-col items-center">
            <div>
              {user.avatarImg ? (
                <div className="w-40 h-40 flex justify-center items-center m-auto rounded-full shadow">
                  {fileUploading ? (
                    <div>
                      <Spinner className="h-10 w-36" color="#F99807"></Spinner>
                    </div>
                  ) : (
                    <img src={user.avatarImg} className="rounded-full m-auto h-full w-full object-fill" />
                  )}
                </div>
              ) : (
                <div className="w-40 h-40 flex justify-center items-center m-auto rounded-full shadow">
                  {fileUploading ? (
                    <div>
                      <Spinner className="h-10 w-36" color="#F99807"></Spinner>
                    </div>
                  ) : (
                    <UserAvatar className="w-full h-full" fontClass="!text-7xl" user={user}></UserAvatar>
                  )}
                </div>
              )}
            </div>
            <input
              ref={avatarImg}
              accept="image/jpeg, image/jpg, image/png, image/webp"
              onChange={(e) => {
                fileUpload(e.target.files ? e.target.files[0] : null);
              }}
              type="file"
              name="avatarImg"
              id=""
              style={{ display: "none" }}
            />
            <div className="w-[80%] flex flex-col gap-5">
              <Button
                variant="primary_outline"
                className="transition ease-in-out duration-150 h-auto px-2 py-1 w-[1/2]"
                onClick={() => avatarImg.current?.click()}
              >
                {user.avatarImg ? "Change Profile Photo" : "Add Profile Photo"}
              </Button>
              {user.provider?.providerType === "EMAIL" && (
                <Button
                  variant="primary_outline"
                  className="transition ease-in-out duration-150 h-auto px-2 py-1 w-[1/2]"
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>
              )}
            </div>
          </div>
          <div className="lg:col-span-3">
            <form className="@container" onSubmit={(e) => submitForm(e)}>
              <div className="text-gray-600 text-lg font-bold mb-2">
                Basic information
              </div>
              <div className="grid @xl:grid-cols-2 gap-2">
                <div>
                  <FormLabel htmlFor="firstName">First name</FormLabel>
                  <InputText
                    name="firstName"
                    id="firstName"
                    placeholder="Enter first name"
                    value={userProfileForm.values.firstName}
                    onChange={userProfileForm.handleChange}
                  />
                  <div>
                    <ErrorMessage>
                      {userProfileForm.touched.firstName &&
                        userProfileForm.errors.firstName}
                    </ErrorMessage>
                  </div>
                </div>
                <div>
                  <FormLabel htmlFor="lastName">Last name</FormLabel>
                  <InputText
                    name="lastName"
                    id="lastName"
                    placeholder="Enter last name"
                    value={userProfileForm.values.lastName}
                    onChange={userProfileForm.handleChange}
                  />
                  <div>
                    <ErrorMessage>
                      {userProfileForm.touched.lastName &&
                        userProfileForm.errors.lastName}
                    </ErrorMessage>
                  </div>
                </div>
                <div>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <InputSelect
                    onChange={(val) => {
                      if (val) {
                        const selectedCountry =
                          val as (typeof countryOptions)[number];
                        const countryValue = selectedCountry?.value;
                        setCountryValue(selectedCountry);
                        userProfileForm.setFieldValue("country", countryValue);
                      }
                    }}
                    onBlur={userProfileForm.handleBlur}
                    options={countryOptions}
                    value={countryValue}
                    placeholder="Select country"
                    name="country"
                  />
                  <ErrorMessage>
                    {userProfileForm.touched.country &&
                      userProfileForm.errors.country}
                  </ErrorMessage>
                </div>
                <div>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <InputText
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={user.email}
                    disabled
                  />
                  <div>
                    <ErrorMessage>
                      {userProfileForm.touched.firstName &&
                        userProfileForm.errors.firstName}
                    </ErrorMessage>
                  </div>
                </div>
              </div>
              <div>
                <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
                <InputText
                  name="jobTitle"
                  id="jobTitle"
                  placeholder="Enter your job title"
                  value={userOrgSettingForm.values.jobTitle}
                  onChange={userOrgSettingForm.handleChange}
                />
                <div>
                  <ErrorMessage>
                    {userOrgSettingForm.touched.jobTitle &&
                      userOrgSettingForm.errors.jobTitle}
                  </ErrorMessage>
                </div>
              </div>
              <div className="flex items-center @2xl:col-span-2 mt-4">
                <Button
                  isLoading={isUserProfileSubmitting || isJobTitleSubmitting}
                  variant={"primary"}
                  className="w-auto ml-auto"
                  disabled={
                    isUserProfileSubmitting ||
                    isJobTitleSubmitting ||
                    !(
                      userProfileHasChanges ||
                      user.userOrganisation[0].jobTitle !==
                        userOrgSettingForm.values.jobTitle
                    )
                  }
                  type="submit"
                >
                  Save Changes
                </Button>
              </div>
            </form>

            <div className="@container space-y-2">
              {/* <div className="text-gray-600 font-bold text-lg mb-2">
                Your Organisations
              </div> */}
              {/* {user.userOrganisation.map((userOrg) => (
                <UserOrganisationCard
                  key={userOrg.userOrganisationId}
                  userOrganisation={userOrg}
                />
              ))} */}

              {user.userOrganisation.length === 0 && (
                <NavLink to={"/"}>
                  <div className="text-center text-lg border text-gray-800 border-gray-800 rounded-md py-5 px-2">
                    You Don’t have any organisation
                  </div>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
      {isopenChangePassword && (
        <ChangePassword handleClosePasswordPopUp={handleChangePassword} />
      )}
    </div>
  );
}

export default AccountSettings;
