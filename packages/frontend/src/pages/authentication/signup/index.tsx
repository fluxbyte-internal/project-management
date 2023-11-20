import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import show from "../../../assets/eye-alt.svg";
import hide from "../../../assets/eye-slash.svg";
import { useFormik } from "formik";
import { authSignUpSchema } from "backend/src/schemas/authSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useSignupMutation from "../../../api/mutation/useSignupMutation";
import { isAxiosError } from "axios";

function Signup() {
  const navigate = useNavigate();
  const errorStyle = "text-red-400 mt-2.5 ml-2.5";
  const inputStyle =
    "block w-full p-2.5 mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);
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
      signupMutation.mutate(values, {
        onSuccess(data) {
          if (data.data.data.token) {
            localStorage.setItem("Token", data.data.data.token);
            navigate("/");
          }
        },
        onError(error) {
          if (isAxiosError(error)) {
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
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
        <div>
          <a href="/">
            <h3 className="text-4xl font-bold text-primary-900">Logo</h3>
          </a>
        </div>
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
          <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <div className="flex md:flex-row flex-col justify-between items-center gap-5 mt-4">
              {/* First Name */}
              {/* <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  First Name
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="firstName"
                    className={inputStyle}
                    placeholder="Enter first name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                  />
                </div>
                <span className={errorStyle}>
                  {formik.touched.firstName && formik.errors.firstName}
                </span>
              </div> */}
              {/* Last Name */}
              {/* <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Last Name
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="lastName"
                    className={inputStyle}
                    placeholder="Enter last name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                  />
                </div>
                <span className={errorStyle}>
                  {formik.touched.lastName && formik.errors.lastName}
                </span>
              </div> */}
            </div>
            <div className="flex md:flex-row flex-col justify-between items-center gap-5 mt-4">
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Email
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="email"
                    name="email"
                    className={inputStyle}
                    placeholder="Enter email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                </div>
                <span className={errorStyle}>
                  {formik.touched.email && formik.errors.email}
                </span>
              </div>
              {/* Job Title */}
              {/* <div className="w-full">
                <label
                  htmlFor="jobTitle"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Job Title
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="jobTitle"
                    name="jobTitle"
                    className={inputStyle}
                    placeholder="Enter jobTitle"
                    value={formik.values.jobTitle}
                    disabled
                  />
                </div>
                <span className={errorStyle}>
                  {formik.touched.jobTitle && formik.errors.jobTitle}
                </span>
              </div> */}
            </div>
            <div className="flex md:flex-row flex-col justify-between items-center gap-5 mt-4">
              <div className="relative w-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Password
                </label>
                <label
                  htmlFor="showPassword"
                  onClick={handleShowPassword}
                  placeholder={`${showPassword ? "Hide" : "Show"}`}
                ></label>
                <div className="flex flex-col items-start">
                  <input
                    type={`${showPassword ? "text" : "password"}`}
                    name="password"
                    className={inputStyle}
                    placeholder="Enter password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="p-2.5 absolute top-[30%] right-[5%]">
                  <img
                    src={showPassword ? show : hide}
                    onClick={handleShowPassword}
                    width={18}
                    height={18}
                  />
                </div>
                <span className={errorStyle}>
                  {formik.touched.password && formik.errors.password}
                </span>
              </div>
              <div className="relative w-full">
                <label
                  htmlFor="showConfirmationPassword"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Confirm Password
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type={`${showConfirmationPassword ? "text" : "password"}`}
                    name="confirmPassword"
                    className={inputStyle}
                    placeholder="Enter password again"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="p-2.5 absolute top-[30%] right-[5%]">
                  <img
                    src={showPassword ? show : hide}
                    onClick={handleShowConfirmationPassword}
                    width={18}
                    height={18}
                  />
                </div>
                <span className={errorStyle}>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword}
                </span>
              </div>
            </div>
            {/* Select Country & Time Zone*/}
            {/* <div className="flex md:flex-row flex-col justify-between items-center gap-5 mt-4">
              <div className="w-full">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Select Country
                </label>
                <div className="flex flex-col items-start">
                  <select
                    name="country"
                    className={inputStyle}
                    onChange={formik.handleChange}
                    value={formik.values.country}
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    <option value="India">India</option>
                    <option value="Japan">Japan</option>
                    <option value="Korea">Korea</option>
                  </select>
                </div>
                <span className={errorStyle}>
                  {formik.touched.country && formik.errors.country}
                </span>
              </div>
              <div className="w-full">
                <label
                  htmlFor="timeZone"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Select Time Zone
                </label>
                <div className="flex flex-col items-start">
                  <select
                    name="timeZone"
                    className={inputStyle}
                    onChange={formik.handleChange}
                    value={formik.values.timeZone}
                  >
                    <option value="" disabled>
                      Select Time Zone
                    </option>
                    <option value="UTC +9:30 / +10:30">
                      Australian Central Time
                    </option>
                    <option value="UTC +5:30">India Standard Time</option>
                    <option value="UTC +9">Japan Standard Time</option>
                  </select>
                </div>
                <span className={errorStyle}>
                  {formik.touched.timeZone && formik.errors.timeZone}
                </span>
              </div>
            </div> */}
            <a href="#" className="text-xs text-danger hover:underline">
              Forget Password?
            </a>
            <div className="flex items-center mt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-success rounded-md hover:bg-success focus:outline-none focus:bg-success"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-4 text-grey-600">
            Already have an account?{" "}
            <NavLink className="text-success hover:underline" to="/login">
              Log in
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
