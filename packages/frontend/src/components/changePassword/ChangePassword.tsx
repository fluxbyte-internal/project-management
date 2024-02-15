import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { changePasswordSchema } from '@backend/src/schemas/userSchema';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import hide from '../../../src/assets/eye-slash.svg';
import show from '../../../src/assets/eye-alt.svg';
import CrossIcon from '../../assets/svg/CrossIcon.svg';
import { Button } from '../ui/button';
import usePasswordChangeMutation from '@/api/mutation/usePasswordChangeMutation';

type PasswordType = {
  handleClosePasswordPopUp: () => void;
};

function ChangePassword(props: PasswordType) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { handleClosePasswordPopUp } = props;
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewdPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const passwordMutation = usePasswordChangeMutation();
  const errorStyle = 'text-red-400 block text-sm h-1';
  const labelStyle = 'font-medium text-base text-gray-700 ';
  const inputStyle =
    'relative py-1.5 px-3 rounded-md border border-gray-100 mt-2 w-full h-[40px]';

  const formik = useFormik<z.infer<typeof changePasswordSchema>>({
    initialValues: {
      confirmPassword: '',
      oldPassword: '',
      password: '',
    },
    onSubmit: (values, helper) => {
      passwordMutation.mutate(values, {
        onError(error) {
          setIsSubmitting(false);
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
        },
        onSuccess(data) {
          formik.resetForm();
          handleClosePasswordPopUp();
          setIsSubmitting(false);
          toast.success(data.data.message);
        },
      });
    },
    validationSchema: toFormikValidationSchema(changePasswordSchema),
  });

  const handleShowNewPassword = () => {
    setShowNewPassword((old) => !old);
  };
  const handleShowOldPassword = () => {
    setShowOldPassword((old) => !old);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((old) => !old);
  };

  return (
    <div className="fixed bg-[#00000066] w-full top-0 h-full items-center flex justify-center z-50">
      <div className="lg:rounded-lg border border-white bg-[#fff]  flex flex-col lg:h-auto lg:min-w-[500px] min-w-full h-full  p-5  lg:overflow-y-auto ">
        <div className="flex justify-between  items-center">
          <div className="text-2xl  font-bold text-gray-500 ">
            Change Your Password
          </div>
          <div
            onClick={handleClosePasswordPopUp}
            className="flex items-center justify-center cursor-pointer h-5 w-5"
          >
            <img src={CrossIcon} className="h-full w-full"></img>
          </div>
        </div>
        <div className="p-4 overflow-y-auto lg:overflow-hidden max-h-screen">
          <div className="">
            <form onSubmit={formik.handleSubmit}>
              <div className="w-full ">
                <div className="flex gap-4 flex-col ">
                  <div className="text-left">
                    <label className={labelStyle}>
                      Old Password
                      <span className="ml-0.5 text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={`${showOldPassword ? 'text' : 'password'}`}
                        name="oldPassword"
                        className={inputStyle}
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      <Button
                        type="button"
                        variant={'ghost'}
                        size={'icon'}
                        onClick={handleShowOldPassword}
                        className="absolute top-1/2 right-1 -translate-y-1/2 mt-[3px]"
                      >
                        <img
                          src={showOldPassword ? show : hide}
                          width={16}
                          height={16}
                        />
                      </Button>
                    </div>
                    <span className={errorStyle}>
                      {formik.touched.oldPassword && formik.errors.oldPassword}
                    </span>
                  </div>
                  <div className="text-left">
                    <label className={labelStyle}>
                      New Password
                      <span className="ml-0.5 text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={`${showNewdPassword ? 'text' : 'password'}`}
                        name="password"
                        className={inputStyle}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <Button
                        type="button"
                        variant={'ghost'}
                        size={'icon'}
                        onClick={handleShowNewPassword}
                        className="absolute top-1/2 right-1 -translate-y-1/2 mt-[3px]"
                      >
                        <img
                          src={showNewdPassword ? show : hide}
                          width={16}
                          height={16}
                        />
                      </Button>
                    </div>
                    <span className={errorStyle}>
                      {formik.touched.password && formik.errors.password}
                    </span>
                  </div>
                  <div className="text-left">
                    <label className={labelStyle}>
                      Confirm Password
                      <span className="ml-0.5 text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={`${showConfirmPassword ? 'text' : 'password'}`}
                        name="confirmPassword"
                        className={inputStyle}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <Button
                        type="button"
                        variant={'ghost'}
                        size={'icon'}
                        onClick={handleShowConfirmPassword}
                        className="absolute top-1/2 right-1 -translate-y-1/2 mt-[3px]"
                      >
                        <img
                          src={showConfirmPassword ? show : hide}
                          width={16}
                          height={16}
                        />
                      </Button>
                    </div>
                    <span className={errorStyle}>
                      {formik.touched.confirmPassword &&
                        formik.errors.confirmPassword}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <Button
                  type="submit"
                  variant={'primary'}
                  className="font-medium text-lg"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Save
                </Button>
                <Button
                  type="submit"
                  variant={'primary_outline'}
                  className="font-medium text-lg"
                  onClick={handleClosePasswordPopUp}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
