import { z } from "zod";

export const signInSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().trim().min(1, "Please enter your password."),
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is too short."),
    lastName: z.string().trim().min(2, "Last name is too short."),
    email: z.email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const emailOnlySchema = z.object({
  email: z.email({ message: "Please enter a valid email address to proceed." }),
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
