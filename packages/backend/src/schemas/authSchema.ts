import { z } from "zod";

export const authSignUpSchema = z
  .object({
    email: z.string().email({ message: "Email is not valid" }),
    password: z.string().nonempty("Password is a required field"),
    confirmPassword: z.string().nonempty("Enter password first"),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );

export const authLoginSchema = z.object({
  email: z.string().email({ message: "Email is not valid" }),
  password: z.string().nonempty("Password is a required field"),
});

export const authRefreshTokenSchema = z.string();
