import { useState } from "react";
import { NavLink } from "react-router-dom";
import show from "../../../assets/eye-alt.svg";
import hide from "../../../assets/eye-slash.svg";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useLoginMutation from "@/api/mutation/useLoginMutation";
import ErrorMessage from "@/components/common/ErrorMessage";
import { authLoginSchema } from "@backend/src/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { isAxiosError } from "axios";

export type LoginValues = {
  email: string;
  password: string;
};

function Login() {
  const { login } = useAuth();
  const loginMutation = useLoginMutation();
  const labelStyle = "font-medium text-base text-gray-8 ";
  const inputStyle =
    "py-1.5 px-3 rounded-md border border-gray-100 mt-2 w-full h-[46px] focus:outline-[#943B0C]";
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<LoginValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(authLoginSchema),
    onSubmit: (values, helper) => {
      setIsLoading(true);
      loginMutation.mutate(values, {
        onSuccess(data) {
          login(data);
        },
        onError(error) {
          if (isAxiosError(error)) {
            setIsLoading(false);
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
        },
      });
    },
  });

  const handleShowPassword = () => {
    setShowPassword((old) => !old);
  };

  return (
    <>
      <div className="flex flex-col px-2 items-center min-h-screen py-6 justify-center bg-gradient-to-t from-[#FFF8DF] to-[#FFD6AB]">
        <div className="w-[min(400px,100%)] space-y-4 py-4 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
          <div className="px-4">
            <h3 className="text-2xl text-center font-bold text-primary-900">
              Login
            </h3>
          </div>
          <hr />
          <form onSubmit={formik.handleSubmit} className="px-4">
            <div className="mt-4">
              <label htmlFor="email" className={labelStyle}>
                Email
              </label>
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
              <div>
                <ErrorMessage>
                  {formik.touched.email && formik.errors.email}
                </ErrorMessage>
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
              <div className="p-2 absolute top-[40%] right-[5%]">
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
            <div className="flex items-center">
              <Button
                type="submit"
                variant={"primary"}
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Submit
              </Button>
            </div>
            <a
              href="#"
              className="mt-4 text-xs text-right text-danger hover:underline"
            >
              Forget Password?
            </a>
            <div className="mt-4 text-grey-600">
              New user?{" "}
              <NavLink className="text-warning hover:underline" to="/signup">
                Sign Up
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
