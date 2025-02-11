import { z } from "zod";

const passwordSchema = z
  .string({ required_error: "Please enter your password!" })
  .min(1, { message: "Password is required!" })
  .max(255, { message: "Password is too long!" });

const usernameSchema = z
  .string({ required_error: "Please enter your username!" })
  .min(1, { message: "Username is required!" })
  .max(100, { message: "Username is too long!" });

// Login Schema
export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

// Register Schema
export const registerSchema = loginSchema
  .extend({
    name: z
      .string({ required_error: "Please enter your name" })
      .min(4, { message: "Name should be at least 4 characters long" }),
    email: z
      .string({ required_error: "Please enter your email address" })
      .email("Please enter a valid email address"),
    confirmPassword: passwordSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message:
      "Passwords do not match. Please ensure both passwords are identical.",
    path: ["confirmPassword"],
  });
