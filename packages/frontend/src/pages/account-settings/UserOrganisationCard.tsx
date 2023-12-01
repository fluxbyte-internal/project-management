import useOrgSettingsUpdateMutation from "@/api/mutation/useOrgSettingsUpdateMutation";
import useCurrentUserQuery, { UserOrganisationType,
} from "@/api/query/useCurrentUserQuery";
import ErrorMessage from "@/components/common/ErrorMessage";
import FormLabel from "@/components/common/FormLabel";
import InputText from "@/components/common/InputText";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import {
  userOrgSettingsUpdateSchema,
  TaskColorPaletteEnum,
} from "@backend/src/schemas/userSchema";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const taskColors = Object.keys(TaskColorPaletteEnum).map((colorPalette) => {
  const color =
    TaskColorPaletteEnum[colorPalette as keyof typeof TaskColorPaletteEnum];
  const colors = color.split(" ");
  return {
    colorPalette,
    color,
    textColor: colors[0],
    bgColor: colors[1],
  };
});

function UserOrganisationCard(props: { userOrganisation: UserOrganisationType }) {
  const { userOrganisation } = props;
  const { refetch: refetchUser } = useCurrentUserQuery();
  const orgSettingsUpdateMutation = useOrgSettingsUpdateMutation(
    userOrganisation.userOrganisationId
  );
  const [isUserOrgSettingsSubmitting, setIsUserOrgSettingsSubmitting] =
    useState(false);

  const userOrgSettingForm = useFormik<
    z.infer<typeof userOrgSettingsUpdateSchema>
  >({
    initialValues: {
      jobTitle: userOrganisation.jobTitle ?? "",
      taskColour: userOrganisation.taskColour ?? TaskColorPaletteEnum.BLACK,
    },
    validationSchema: toFormikValidationSchema(userOrgSettingsUpdateSchema),
    onSubmit: (values, helper) => {
      setIsUserOrgSettingsSubmitting(true);
      orgSettingsUpdateMutation.mutate(values, {
        onSuccess() {
          setIsUserOrgSettingsSubmitting(false);
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
          setIsUserOrgSettingsSubmitting(false);
        },
      });
    },
  });

  const userOrgSettingsHasChanges =
    !userOrganisation.jobTitle ||
    userOrganisation.jobTitle !== userOrgSettingForm.values.jobTitle ||
    !userOrganisation.taskColour ||
    userOrganisation.taskColour !== userOrgSettingForm.values.taskColour;

  return (
    <div className="text-lg border border-primary-500 rounded-md group relative overflow-hidden">
      <div className="py-2 px-4 bg-primary-50">
        {userOrganisation.organisation.organisationName}
        <span className="text-sm text-primary-600 ml-2">
          ({userOrganisation.role})
        </span>
      </div>
      <NavLink to={`/organisation/${userOrganisation.organisationId}`}>
        <Button
          className="transition ease-in-out duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100 absolute right-1 top-1"
          variant={"primary_outline"}
          size={"sm"}
        >
          View
        </Button>
      </NavLink>
      <div className="mt-1 py-2 px-4">
        <form onSubmit={userOrgSettingForm.handleSubmit} className="@container">
          <div className="text-gray-600 font-bold mb-2">
            Organisation Settings
          </div>
          <div className="grid gap-2">
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
            <div>
              <FormLabel htmlFor="country">Default color</FormLabel>
              <div className="flex flex-wrap gap-4">
                {taskColors.map((taskColor) => (
                  <div
                    key={taskColor.colorPalette}
                    onClick={() =>
                      userOrgSettingForm.setFieldValue(
                        "taskColour",
                        taskColor.color
                      )
                    }
                    className={
                      "flex cursor-pointer border-[5px] rounded-full overflow-hidden " +
                      `${
                        userOrgSettingForm.values.taskColour === taskColor.color
                          ? "border-primary-500"
                          : "border-primary-100"
                      }`
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
            </div>
          </div>

          <div className="flex items-center @2xl:col-span-2">
            <Button
              isLoading={isUserOrgSettingsSubmitting}
              variant={"primary"}
              className="w-auto ml-auto"
              disabled={
                isUserOrgSettingsSubmitting || !userOrgSettingsHasChanges
              }
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserOrganisationCard;
