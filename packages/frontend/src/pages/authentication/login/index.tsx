import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import show from "../../../assets/eye-alt.svg";
import hide from "../../../assets/eye-slash.svg";
import { useFormik } from "formik";
import { authLoginSchema } from "backend/src/schemas/authSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useLoginMutation from "../../../api/mutation/useLoginMutation";
import { isAxiosError } from "axios";

function Login() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const errorStyle = "text-sm text-red-400 mt-2.5 ml-2.5";
  const inputStyle =
    "block w-full p-2.5 mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50";
  const [showPassword, setShowPassword] = useState<boolean>(false);
  type FormValues = {
    email: string;
    password: string;
  };
  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(authLoginSchema),
    onSubmit: (values, helper) => {
      loginMutation.mutate(values, {
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

  const handleShowPassword = () => {
    setShowPassword((old) => !old);
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
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Email
              </label>
              <div>
                <input
                  type="text"
                  name="email"
                  className={inputStyle}
                  id="email"
                  placeholder="Enter email"
                  value={formik.values.email}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                />
              </div>
              <span className={errorStyle}>
                {formik.touched.email && formik.errors.email}
              </span>
            </div>
            <div className="relative w-full mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Password
              </label>
              <div>
                <input
                  type={`${showPassword ? "text" : "password"}`}
                  name="password"
                  className={inputStyle}
                  placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="p-2 absolute top-[35%] right-[5%]">
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
            <a href="#" className="text-xs text-danger hover:underline">
              Forget Password?
            </a>
            <div className="flex items-center mt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-success rounded-md hover:bg-success focus:outline-none focus:bg-success"
              >
                Log in
              </button>
            </div>
          </form>
          <div className="mt-4 text-grey-600">
            New user?{" "}
            <NavLink className="text-success hover:underline" to="/signup">
              Sign Up
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
