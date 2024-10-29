import { z } from "zod";

export const filterSchema = z.object({
  name: z.string().optional(),
  priceRange: z.object({ gte: z.string() }).optional(),
  city: z.string().optional(),
  operatingHours: z
    .object({
      openingTime: z.object({ gte: z.string() }).optional(),
      closingTime: z.object({ lte: z.string() }).optional(),
    })
    .optional(),
});
