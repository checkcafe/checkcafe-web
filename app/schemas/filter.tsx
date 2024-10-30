import { z } from "zod";

export const filterSchema = z
  .object({
    priceFrom: z
      .number()
      .min(1, { message: "Price must be greater than 1" })
      .optional(),
    priceTo: z
      .number()
      .min(1, { message: "Price must be greater than 1" })
      .optional(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.priceFrom && data.priceTo && data.priceTo < data.priceFrom) {
      ctx.addIssue({
        code: "custom",
        path: ["priceTo"],
        message:
          "The maximum price must be greater than or equal to the minimum price",
      });
    }

    if (data.openTime && data.closeTime && data.closeTime <= data.openTime) {
      ctx.addIssue({
        code: "custom",
        path: ["closeTime"],
        message: "Close time must be after open time",
      });
    }
  });
