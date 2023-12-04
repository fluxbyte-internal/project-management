import { Button } from "@/components/ui/button";
import { resetPasswordTokenSchema } from "@backend/src/schemas/authSchema";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ErrorMessage from "@/components/common/ErrorMessage";
import PasswordReset from "../../../assets/svg/PasswordReset.svg";
import { z } from "zod";
import useResetPasswordMutation from "@/api/mutation/useResetPasswordMutation";
import InputPassword from "@/components/common/inputPassword";
function ResetPassword() {
  const [searchParams] = useSearchParams();

  const resetPasswordMutation = useResetPasswordMutation(
    searchParams.get("token") ?? ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmited] = useState(false);
  const [iserror, setIsError] = useState("");
  const labelStyle = "font-medium text-base text-gray-8 ";
  const inputStyle =
    "py-1.5 px-3 rounded-md border border-gray-100 w-full h-[46px] focus:outline-[#943B0C]";
  const navigate = useNavigate();
  const formik = useFormik<z.infer<typeof resetPasswordTokenSchema>>({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: toFormikValidationSchema(resetPasswordTokenSchema),
    onSubmit: (values, helper) => {
      setIsLoading(true);
      resetPasswordMutation.mutate(values, {
        onSuccess() {
          setIsLoading(false);
          setIsSubmited(true);
        },
        onError(error) {
          if (isAxiosError(error)) {
            setIsLoading(false);
            setIsError(error.response?.data.message ?? "");
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
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col px-2 items-center min-h-screen py-6 justify-center bg-gradient-to-t from-[#FFF8DF] to-[#FFD6AB]">
      <div className="w-[min(400px,100%)] space-y-4 py-4 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
        <div className="px-4">
          <h3 className="text-2xl text-center font-bold text-primary-900">
            {!isSubmitted ? "Reset Password" : ""}
          </h3>
        </div>
        <hr />
        {isSubmitted ? (
          <div className="flex flex-col justify-center items-center">
            <div className="h-16 w-16 rounded-full bg-success bg-opacity-60 flex justify-center items-center">
              <img src={PasswordReset} alt="" width={50} />
            </div>
            <div className="text-center mt-3">
              <p>
                Password Reset Successful!
                <br /> Kindly proceed to log in.
              </p>
            </div>
            <div className="w-full p-3 mt-3">
              <Button
                type="submit"
                variant={"primary"}
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="px-4 flex flex-col">
            <div className="w-full mt-1">
              <label htmlFor="password" className={labelStyle}>
                New Password
              </label>
              <div className="relative mt-1">
                <InputPassword
                  name="password"
                  className={inputStyle}
                  placeholder="Enter password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <ErrorMessage>
                  {formik.touched.password && formik.errors.password}
                </ErrorMessage>
              </div>
            </div>
            <div className="mt-1">
              <label htmlFor="showConfirmationPassword" className={labelStyle}>
                Confirm New Password
              </label>
              <div className="relative mt-1">
                <InputPassword
                  name="confirmPassword"
                  className={inputStyle}
                  placeholder="Enter password again"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                />
              </div>
              <div>
                <ErrorMessage>
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword}
                </ErrorMessage>
              </div>
            </div>
            <ErrorMessage>{iserror && iserror}</ErrorMessage>
            <div className="flex flex-col justify-center mt-1.5">
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
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
