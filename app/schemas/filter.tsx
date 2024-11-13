import { z } from "zod";

export const filterSchema = z
  .object({
    priceRangeMin: z
      .number()
      .min(1, { message: "Price must be greater than 1" })
      .optional(),
    priceRangeMax: z
      .number()
      .min(1, { message: "Price must be greater than 1" })
      .optional(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.priceRangeMin &&
      data.priceRangeMax &&
      data.priceRangeMax < data.priceRangeMin
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["priceRangeMax"],
        message:
          "The maximum price must be greater than or equal to the minimum price",
      });
    }
  });
