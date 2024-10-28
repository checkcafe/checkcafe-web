import { z } from "zod";

const passwordSchema = z
  .string({ required_error: "Please enter your password" })
  .min(1, { message: "Password is required" })
  .max(255, { message: "Password should be 255 characters or less" });

const usernameSchema = z
  .string({ required_error: "Please enter your username" })
  .min(3, { message: "Username should be at least 3 characters long" })
  .max(100, { message: "Username should be 100 characters or less" });

// Login Schema
export const LoginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

// Register Schema
export const RegisterSchema = LoginSchema.extend({
  name: z
    .string({ required_error: "Please enter your name" })
    .min(4, { message: "Name should be at least 4 characters long" }),

  email: z
    .string({ required_error: "Please enter your email address" })
    .email("Please enter a valid email address"),

  confirmPassword: passwordSchema,
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
