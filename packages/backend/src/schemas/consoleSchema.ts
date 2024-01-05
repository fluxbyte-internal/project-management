import { z } from "zod";
import { OperatorStatusEnumValue, ZodErrorMessageEnumValue } from "./enums.js";

export const consoleLoginSchema = z.object({
  email: z
    .string({ required_error: ZodErrorMessageEnumValue.REQUIRED })
    .email({ message: "Email is not valid" }),
  password: z
    .string({ required_error: ZodErrorMessageEnumValue.REQUIRED })
    .min(1, "Password is a required field"),
});

export const operatorSchema = z.object({
  firstName: z
    .string({ required_error: ZodErrorMessageEnumValue.REQUIRED })
    .optional(),
  lastName: z
    .string({ required_error: ZodErrorMessageEnumValue.REQUIRED })
    .optional(),
  email: z
    .string({ required_error: ZodErrorMessageEnumValue.REQUIRED })
    .email({ message: "Email is not valid" }),
});

export const operatorUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is a required field"),
  lastName: z.string().min(1, "Last name is a required field"),
  country: z.string().min(1, "Country is a required field")
});

export const operatorStatusSchema = z.object({
  status: z.nativeEnum(OperatorStatusEnumValue),
});

export const consolePasswordSchema = z
.object({
  oldPassword: z.string(),
  password: z
    .string()
    .regex(
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[0-9]).{8,}$/,
      "Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number and 1 special chars."
    )
    .min(1, "Password is a required field"),
  confirmPassword: z.string({
    required_error: ZodErrorMessageEnumValue.REQUIRED,
  }),
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

export const avatarImgConsoleSchema = z
  .any()
  .refine((files) => files?.avatarImg?.size <= 1024 * 1024 * 5, {message:"Max file size is 5MB."})
  .refine(
    (files) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        files?.avatarImg?.mimetype
      ),
    ".jpg, .jpeg, .png and .webp files are accepted."
  );
