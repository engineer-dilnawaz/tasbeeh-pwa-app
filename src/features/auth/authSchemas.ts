import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, { message: "Please enter email" }).email({ message: "Email is incorrect" }),
  password: z.string().min(1, { message: "Please enter password" }),
});

export const signUpSchema = z.object({
  name: z.string().min(1, { message: "Please enter your name" }),
  email: z.string().min(1, { message: "Please enter email" }).email({ message: "Email is incorrect" }),
  password: z.string().min(1, { message: "Please enter password" }),
  confirmPassword: z.string().min(1, { message: "Please confirm password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: z.string().min(1, { message: "Please enter email" }).email({ message: "Email is incorrect" }),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
