import useForgotPassword from "@/api/mutation/useForgotPasswordEmailSend";
import InputEmail from "@/components/common/InputEmail";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema } from "@backend/src/schemas/authSchema";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ErrorMessage from "@/components/common/ErrorMessage";
import EmailSend from "../../../assets/svg/EmailSendSuccess.svg";
import { z } from "zod";

function ForgotPassword() {
  const labelStyle = "font-medium text-base text-gray-8 ";
  const useForgotePassword = useForgotPassword();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik<z.infer<typeof forgotPasswordSchema>>({
    initialValues: {
      email: "",
    },
    validationSchema: toFormikValidationSchema(forgotPasswordSchema),
    onSubmit: (values, helper) => {
      setIsLoading(true);
      useForgotePassword.mutate(values, {
        onSuccess() {
          setIsLoading(false);
          setIsSubmitted(true);
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
  return (
    <div className="flex flex-col px-2 items-center min-h-screen py-6 justify-center bg-gradient-to-t from-[#FFF8DF] to-[#FFD6AB]">
      <div className="w-[min(400px,100%)] space-y-4 py-4 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
        <div className="px-4">
          <h3 className="text-2xl text-center font-bold text-primary-900">
            {!isSubmitted ? "Forgot Password" : "Email sent"}
          </h3>
        </div>
        <hr />
        {isSubmitted ? (
          <div className="flex flex-col justify-center items-center">
            <div className="h-16 w-16 rounded-full bg-success bg-opacity-60 flex justify-center items-center">
              <img src={EmailSend} className="h-11" />
            </div>
            <div className="text-center mt-3">
              <p>
                Password Reset Request Successful! <br />
                <p className="text-sm mt-2 mx-2">
                  Please check your email for further instructions on resetting
                  your password.
                </p>
              </p>
            </div>
            <div className="w-full p-3 mt-3">
              <Button
                type="submit"
                variant={"primary"}
                className="w-full"
                onClick={() => navigate("/")}
              >
                back
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="px-4 flex flex-col ">
            <div className="mt-1">
              <label htmlFor="email" className={labelStyle}>
                Email
              </label>
              <InputEmail
                name="email"
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

export default ForgotPassword;
