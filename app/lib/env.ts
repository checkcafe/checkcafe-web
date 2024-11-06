import { z } from "zod";

export const EnvSchema = z.object({
  VITE_BACKEND_API_URL: z.string(),
  VITE_ACCESS_TOKEN_NAME: z.string().optional(),
  VITE_UPLOADCARE_PUBLIC_KEY: z.string().optional(),
  VITE_UPLOADCARE_SECRET_KEY: z.string().optional(),
});

export const ENV = EnvSchema.parse(import.meta.env);
export const BACKEND_API_URL = ENV.VITE_BACKEND_API_URL;
export const ACCESS_TOKEN_NAME = ENV.VITE_ACCESS_TOKEN_NAME;
export const UPLOADCARE_PUBLIC_KEY = ENV.VITE_UPLOADCARE_PUBLIC_KEY;
export const UPLOADCARE_SECRET_KEY = ENV.VITE_UPLOADCARE_SECRET_KEY;
