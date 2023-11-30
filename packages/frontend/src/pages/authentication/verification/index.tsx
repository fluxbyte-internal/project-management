import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import ErrorMessage from "@/components/common/ErrorMessage";
import { verifyEmailOtpSchema } from "@backend/src/schemas/authSchema";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";
import { z } from "zod";
import { useUser } from "@/hooks/useUser";
import useVerifyEmailMutation from "@/api/mutation/useVerifyEmailMutation";
import InputText from "@/components/common/InputText";
import FormLabel from "@/components/common/FormLabel";
import useTimer from "@/hooks/useTimer";
import useResendVerifyEmailOtpMutation from "@/api/mutation/useResendVerifyEmailOtpMutation";

export type LoginValues = {
  email: string;
  password: string;
};

function Verification() {
  const localLastSent = localStorage.getItem("lastSent");
  const { user } = useUser();
  const [lastSentTime, setLastSentTime] = useState(
    localLastSent ? parseInt(localLastSent) : null
  );
  const { time, resetTimer } = useTimer(
    lastSentTime
      ? Math.max(60 - Math.floor((Date.now() - lastSentTime) / 1000), 0)
      : 0
  );

  const verifyEmailMutation = useVerifyEmailMutation();
  const resendVerifyEmailOtpMutation = useResendVerifyEmailOtpMutation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const formik = useFormik<z.infer<typeof verifyEmailOtpSchema>>({
    initialValues: {
      otp: "",
    },
    validationSchema: toFormikValidationSchema(verifyEmailOtpSchema),
    onSubmit: (values, helper) => {
      setIsVerifying(true);
      verifyEmailMutation.mutate(values, {
        onSuccess() {
          // redirect and refetch user
        },
        onError(error) {
          if (isAxiosError(error)) {
            setIsVerifying(false);
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
    <>
      <div className="flex flex-col px-2 items-center min-h-screen py-6 justify-center bg-gradient-to-t from-[#FFF8DF] to-[#FFD6AB]">
        <div className="w-[min(400px,100%)] space-y-4 py-4 overflow-hidden bg-white shadow-md sm:max-w-lg sm:rounded-lg">
          <div className="px-4">
            <h3 className="text-2xl text-center font-bold text-primary-900">
              Verify Email
            </h3>
          </div>
          <hr />
          <form onSubmit={formik.handleSubmit} className="px-4">
            <div className="mt-4 text-gray-600">
              We have sent a OTP (One time password) to your email "
              <span className="font-bold">{user?.email}</span>"
            </div>
            <div className="relative w-full mt-4">
              <FormLabel htmlFor="otp">One time password</FormLabel>
              <InputText
                name="otp"
                placeholder="Please enter otp"
                value={formik.values.otp}
                onChange={formik.handleChange}
              />
              <div>
                <ErrorMessage>
                  {formik.touched.otp && formik.errors.otp}
                </ErrorMessage>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-danger text-sm">{resendError}</span>
              <Button
                variant={"primary_outline"}
                className="h-auto py-1 px-2"
                onClick={() => {
                  setIsResending(true);
                  resendVerifyEmailOtpMutation.mutate(null, {
                    onSuccess: () => {
                      const t = Date.now();
                      localStorage.setItem("lastSent", `${t}`);
                      resetTimer(60);
                      setLastSentTime(t);
                      setIsResending(false);
                      setResendError("");
                    },
                    onError: () => {
                      setResendError("Failed to resend OTP");
                      setIsResending(false);
                    },
                  });
                }}
                isLoading={isResending}
                disabled={time !== 0 || isResending}
              >
                {isResending
                  ? "Resend OTP"
                  : time === 0
                  ? "Resend OTP"
                  : `Resend otp in ${time}`}
              </Button>
            </div>
            <div className="flex items-center mt-1">
              <Button
                type="submit"
                variant={"primary"}
                className="w-full"
                isLoading={isVerifying}
                disabled={isVerifying}
              >
                Verify
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Verification;