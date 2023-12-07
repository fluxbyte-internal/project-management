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
import Facebook from "../../../assets/svg/facebook.svg";


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
    window.open("http://localhost:8000/api/auth/google", "_self");
  };
  const facebook = () => {
    window.open("http://localhost:8000/api/auth/facebook", "_self");
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="lg:flex flex-col items-center justify-center lg:w-1/2 bg-gradient-to-t from-[#FFF8DF] to-[#FFD6AB] hidden">
        <img src={SignUp} />
      </div>
      <div className="flex flex-col items-center w-full lg:w-1/2 justify-center overflow-hidden bg-white">
        <div className="w-full sm:px-14 max-w-xl">
          <div className="px-4">
            <h3 className="text-2xl text-center font-bold text-primary-900">
              Login
            </h3>
          </div>
          <hr className="m-4" />
          <form onSubmit={formik.handleSubmit} className="px-4">
            <div className="w-full mt-1">
              <label htmlFor="email" className={labelStyle}>
                Email
              </label>
              <InputEmail
                name="email"
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
            <div className="w-full mt-1">
              <label htmlFor="password" className={labelStyle}>
                Password
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
                  variant={"ghost"}
                  size={"icon"}
                  onClick={handleShowPassword}
                  className="absolute top-1/2 right-1 -translate-y-1/2 mt-[1px]"
                >
                  <img
                    src={showPassword ? show : hide}
                    width={16}
                    height={16}
                  />
                </Button>
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
            <div className="mt-4 text-grey-600">
              New user?{" "}
              <NavLink className="text-warning hover:underline" to="/signup">
                Sign Up
              </NavLink>
            </div>
          </form>
          <div className="flex items-center p-4">
            <div className="w-full pr-2"><hr /></div>
            <div className="w-full bg-[#E7E7E7] text-xs py-1 rounded-lg text-center">Or continue with</div>
            <div className="w-full pl-2"><hr /></div>
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
              <span>Sign in with Google</span>
            </Button>
            <Button
              type="button"
              variant={"secondary"}
              isLoading={isLoading}
              disabled={isLoading}
              onClick={facebook}
              className="w-full flex py-2.5 mt-1.5 rounded-md gap-2.5 hover:bg-[#1876f2d8] bg-[#1877F2] text-white"
            >
              <img src={Facebook} />
              <span>
                Sign in with Facebook
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


