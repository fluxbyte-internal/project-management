import { z } from "zod";

export const authSignUpSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string({required_error:"Required*"}).email({ message: "Email is not valid" }),
    password: z
      .string()
      .regex(
        /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
        "Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number and 1 special chars."
      )
      .min(1, "Password is a required field"),
    confirmPassword: z.string({required_error:"Required*"}),
  })
  .refine(
    (values) => {
      if (!values.password) return true;
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );

export const authLoginSchema = z.object({
  email: z.string({required_error:"Required*"}).email({ message: "Email is not valid" }),
  password: z.string({required_error:"Required*"}).min(1, "Password is a required field"),
});

export const authRefreshTokenSchema = z.string();

export const verifyEmailOtpSchema = z.object({
  otp: z.string({required_error:"Required*"}).min(1, "Otp is required field"),
});

export const forgotPasswordSchema = z.object({
  email: z.string({required_error:"Required*"}).email(),
});

export const resetTokenSchema = z.string().min(1, "Token is required field");

export const resetPasswordTokenSchema = z
  .object({
    password: z
      .string({required_error:"Required*"})
      .regex(
        /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
        "Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number and 1 special chars."
      )
      .min(1, "Password is a required field"),
    confirmPassword: z.string({required_error:"Required*"}),
  })
  .refine(
    (values) => {
      if (!values.password) return true;
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );
