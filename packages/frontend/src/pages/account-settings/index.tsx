import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useFormik } from "formik";
import { userUpdateSchema } from "@backend/src/schemas/userSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { z } from "zod";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import countries from "@/assets/json/countries.json";
import useUserProfileUpdateMutation from "@/api/mutation/useUserProfileUpdateMutation";
import { isAxiosError } from "axios";
import useCurrentUserQuery from "@/api/query/useCurrentUserQuery";
import FormLabel from "@/components/common/FormLabel";
import InputText from "@/components/common/InputText";
import InputSelect from "@/components/common/InputSelect";
import UserOrganisationCard from "./UserOrganisationCard";
import { NavLink } from "react-router-dom";

const countryOptions = countries.map((item) => {
  return { label: item.name, value: item.isoCode };
});

function AccountSettings() {
  const { user } = useUser();
  const { refetch: refetchUser } = useCurrentUserQuery();
  const userProfileUpdateMutation = useUserProfileUpdateMutation();

  const [isUserProfileSubmitting, setIsUserProfileSubmitting] = useState(false);
  const [countryValue, setCountryValue] =
    useState<SingleValue<(typeof countryOptions)[number]>>();

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
        onSuccess() {
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
          }
          setIsUserProfileSubmitting(false);
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

  return (
    <div className="overflow-auto w-full">
      <div className="max-w-5xl mx-auto p-4 pb-5">
        <div className="text-gray-600 text-lg font-bold mb-4">
          Account Settings
        </div>
        <div className="grid lg:grid-cols-4 gap-2">
          <div className="text-center text-gray-700 text-sm space-y-2">
            <div>
              {user.avatarImg ? (
                <img
                  src="https://image-svg.vercel.app/100"
                  className="w-40 h-40 m-auto rounded-full shadow"
                />
              ) : (
                <span className="block w-40 h-40 rounded-full m-auto shadow bg-primary-50"></span>
              )}
            </div>
            <Button
              variant="primary_outline"
              className="transition ease-in-out duration-150 h-auto px-2 py-1"
            >
              {user.avatarImg ? "Change Profile Photo" : "Add Profile Photo"}
            </Button>
          </div>
          <div className="lg:col-span-3">
            <form
              onSubmit={userProfileForm.handleSubmit}
              className="@container"
            >
              <div className="text-gray-600 text-lg font-bold mb-2">
                Basic information
              </div>
              <div className="grid @xl:grid-cols-2 gap-2">
                <div>
                  <FormLabel htmlFor="firstName">First Name</FormLabel>
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
                  <FormLabel htmlFor="lastName">Last Name</FormLabel>
                  <InputText
                    name="lastName"
                    id="lastName"
                    placeholder="Enter first name"
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
              <div className="flex items-center @2xl:col-span-2">
                <Button
                  isLoading={isUserProfileSubmitting}
                  variant={"primary"}
                  className="w-auto ml-auto"
                  disabled={isUserProfileSubmitting || !userProfileHasChanges}
                  type="submit"
                >
                  Save Changes
                </Button>
              </div>
            </form>
            <div className="@container space-y-2">
              <div className="text-gray-600 font-bold text-lg mb-2">
                Your Organisations
              </div>
              {user.userOrganisation.map((userOrg) => (
                <UserOrganisationCard
                  key={userOrg.userOrganisationId}
                  userOrganisation={userOrg}
                />
              ))}

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
    </div>
  );
}

export default AccountSettings;
