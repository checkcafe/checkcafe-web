import { z } from "zod";

export const EnvSchema = z.object({
  VITE_BACKEND_API_URL: z.string(),
  VITE_ACCESS_TOKEN_NAME: z.string().optional(),
});

export const ENV = EnvSchema.parse(import.meta.env);

export const BACKEND_API_URL = ENV.VITE_BACKEND_API_URL;
export const ACCESS_TOKEN_NAME = ENV.VITE_ACCESS_TOKEN_NAME;
