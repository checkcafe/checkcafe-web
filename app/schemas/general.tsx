import { z } from "zod";

export const id = z.string({ required_error: "ID is required" });

export const userId = z.string({ required_error: "User ID is required" });
