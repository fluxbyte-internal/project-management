import { useState } from "react";
import { NavLink } from "react-router-dom";
import show from "../../../assets/eye-alt.svg";
import hide from "../../../assets/eye-slash.svg";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useSignupMutation from "../../../api/mutation/useSignupMutation";
import { isAxiosError } from "axios";
import ErrorMessage from "@/components/common/ErrorMessage";
import { authSignUpSchema } from "@backend/src/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function Signup() {
  const { login } = useAuth();
  const labelStyle = "font-medium text-base text-gray-8 ";
  const inputStyle =
    "py-1.5 px-3 rounded-md border border-gray-100 mt-2  w-full h-[46px] focus:outline-[#943B0C]";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const signupMutation = useSignupMutation();
  type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    country: string;
    timeZone: string;
    jobTitle: string;
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "",
      timeZone: "",
      jobTitle: "",
    },
    validationSchema: toFormikValidationSchema(authSignUpSchema),
    onSubmit: (values, helper) => {
      setIsLoading(true);
      signupMutation.mutate(values, {
        onSuccess(data) {
          login(data);
        },
        onError(error) {
          if (isAxiosError(error)) {
            setIsLoading(false);
            if (
              error.response?.status === 400 &&
              error.response?.data.errors &&
              Array.isArray(error.response.data.errors)
            ) {
              error.response.data.errors.map(
                (item: { message: string; path: string[] }) => {
                  helper.setFieldError(item.path[0], item.message);
                }
              );
            }
          }
        },
      });
    },
  });

  const handleShowPassword = () => {
    setShowPassword((old) => !old);
  };
  const handleShowConfirmationPassword = () => {
    setShowConfirmationPassword((old) => !old);
  };

  return (
    <>
      <div className="flex flex-col px-2 items-center min-h-screen py-6 justify-center bg-gradient-to-t from-[#FFF8DF] to-[#FFD6AB]">
        <div className="w-[min(400px,100%)] space-y-4 py-4 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
          <div className="px-4">
            <h3 className="text-2xl text-center font-bold text-primary-900">
              Sign Up
            </h3>
          </div>
          <hr />
          <form onSubmit={formik.handleSubmit} className="px-4">
            <div className="mt-4">
              <div className="w-full">
                <label htmlFor="email" className={labelStyle}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className={inputStyle}
                  placeholder="Enter email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                <div>
                  <ErrorMessage>
                    {formik.touched.email && formik.errors.email}
                  </ErrorMessage>
                </div>
              </div>
            </div>
            <div className="relative w-full mt-4">
              <label htmlFor="password" className={labelStyle}>
                Password
              </label>
              <input
                type={`${showPassword ? "text" : "password"}`}
                name="password"
                className={inputStyle}
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              <div className="p-2.5 absolute top-[35%] right-[5%]">
                <img
                  src={showPassword ? show : hide}
                  onClick={handleShowPassword}
                  width={16}
                  height={16}
                />
              </div>
              <div>
                <ErrorMessage>
                  {formik.touched.password && formik.errors.password}
                </ErrorMessage>
              </div>
            </div>
            <div className="relative w-full mt-4">
              <label htmlFor="showConfirmationPassword" className={labelStyle}>
                Confirm Password
              </label>
              <input
                type={`${showConfirmationPassword ? "text" : "password"}`}
                name="confirmPassword"
                className={inputStyle}
                placeholder="Enter password again"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
              />
              <div className="p-2.5 absolute top-[35%] right-[5%]">
                <img
                  src={showConfirmationPassword ? show : hide}
                  onClick={handleShowConfirmationPassword}
                  width={16}
                  height={16}
                />
              </div>
              <div>
                <ErrorMessage>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword}
                </ErrorMessage>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                isLoading={isLoading}
                variant={"primary"}
                disabled={
                  isLoading ||
                  !formik.dirty ||
                  !formik.isValid ||
                  formik.isValidating
                }
                className="w-full py-2.5 mt-4 rounded-md hover:bg-opacity-80 disabled:bg-opacity-50"
              >
                Submit
              </Button>
            </div>
            <div className="mt-4 text-grey-600">
              Already have an account?{" "}
              <NavLink className="text-warning hover:underline" to="/login">
                Log in
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
