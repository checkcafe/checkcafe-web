import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(4).max(100),
  password: z.string().min(8),
});

export const RegisterSchema = LoginSchema.extend({
  email: z.string().email().min(4),
  confirmPassword: z.string().min(8),
  name: z.string().min(4),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
