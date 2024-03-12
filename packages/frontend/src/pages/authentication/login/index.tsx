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
import InputEmail from "@/components/common/InputEmail";
import { toast } from "react-toastify";
import SignUp from "../../../assets/svg/signup.svg";
import Google from "../../../assets/svg/google.svg";
// import Facebook from "../../../assets/svg/facebook.svg";
import { baseURL } from "../../../Environment";

export type LoginValues = {
  email: string;
  password: string;
};

function Login() {
  const { login } = useAuth();
  const loginMutation = useLoginMutation();
  const labelStyle = "font-medium text-[13px] text-gray-8 ";
  const inputStyle =
    "py-1.5 px-3 rounded-md border border-gray-100 w-full focus:outline-[#943B0C]";
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
          login();
          toast.success(data.data.message);
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
            if (!Array.isArray(error.response?.data.errors)) {
              toast.error(
                error.response?.data?.message ?? "An unexpected error occurred."
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

  const google = () => {
    window.open(`${baseURL}/api/auth/google`, "_self");
  };

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-t from-[#FFF8DF] to-[#FFD6AB] sm:p-20">
      <div className="lg:flex flex-col items-center justify-center lg:w-1/2 hidden">
        <img src={SignUp} />
      </div>
      <div className="flex flex-col items-center w-full lg:w-1/2 justify-center overflow-hidden ">
        <div className="max-sm:py-4 sm:px-4 py-6 w-full md:w-[65%] max-w-xl overflow-y-auto bg-white shadow-lg rounded-2xl">
          <div className="px-4">
            <h3 className="text-2xl text-center font-bold text-primary-900">
              Login
            </h3>
          </div>
          <div className="flex flex-col px-4 gap-4">
            <Button
              type="button"
              variant={"outline"}
              isLoading={isLoading}
              disabled={isLoading}
              onClick={google}
              className="w-full flex py-2.5 mt-1.5 rounded-md gap-2.5 hover:bg-opacity-80 disabled:bg-opacity-50"
            >
              <img src={Google} />
              <span>Google</span>
            </Button>
            {/* <Button
              type="button"
              variant={"secondary"}
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full flex py-2.5 mt-1.5 rounded-md gap-2.5 hover:bg-[#1876f2d8] bg-[#1877F2] text-white"
            >
              <img src={Facebook} />
              <span>
                Facebook
              </span>
            </Button> */}
          </div>
          <div className="flex items-center p-2">
            <div className="w-full pr-2">
              <hr />
            </div>
            <div className="w-full bg-[#E7E7E7] text-xs py-1 rounded-lg text-center">
              Or continue email
            </div>
            <div className="w-full pl-2">
              <hr />
            </div>
          </div>
          <form onSubmit={formik.handleSubmit} className="px-4 flex flex-col gap-1">
            <div className="w-full mt-1">
              <label htmlFor="email" className={labelStyle}>
                Email
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <InputEmail
                name="email"
                placeholder="Enter email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className="h-10 mt-0"
              />
              <div>
               <ErrorMessage className="!text-xs block mt-1">
                  {formik.touched.email && formik.errors.email}
                </ErrorMessage>
              </div>
            </div>
            <div className="w-full mt-1">
              <label htmlFor="password" className={labelStyle}>
                Password
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type={`${showPassword ? "text" : "password"}`}
                  name="password"
                  className={inputStyle}
                  placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <Button
                  type="button"
                  variant={"ghost"}
                  size={"icon"}
                  onClick={handleShowPassword}
                  className="absolute top-[20px] right-1 -translate-y-1/2 mt-[1px]"
                >
                  <img
                    src={showPassword ? show : hide}
                    width={16}
                    height={16}
                  />
                </Button>
              </div>
              <div>
               <ErrorMessage className="!text-xs block mt-1">
                  {formik.touched.password && formik.errors.password}
                </ErrorMessage>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                type="submit"
                variant={"primary"}
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full py-2.5 mt-1.5 rounded-md hover:bg-opacity-80 disabled:bg-opacity-50"
              >
                Submit
              </Button>
            </div>
            <NavLink
              className="mt-4 text-xs text-right text-danger hover:underline"
              to="/forgot-password"
            >
              Forget Password?
            </NavLink>
            <div className="mt-2 text-sm text-grey-600">
              New user?{" "}
              <NavLink className="text-warning hover:underline" to="/signup">
                Sign Up
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
