import { z } from "zod";

// import { id } from "./general";
import { UserSchema } from "./user";

const OperatingHour = z.object({
  day: z.string(),
  openingTime: z.string(),
  closingTime: z.string(),
});

const operatingHours = z.array(OperatingHour);
const schemaOperatingHoursPlace = z.object({
  operatingHours,
});

const facility = z.object({
  facilityId: z.string(),
  description: z.string().optional(),
});
const facilities = z.array(facility);

const schemaFacilities = z.object({
  placeFacilities: facilities,
});
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  countryCode: z.string(),
});

const PlaceItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  currency: z.string(),
  priceRangeMin: z.string(),
  priceRangeMax: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: AddressSchema,
  openingTime: z.string(),
  closingTime: z.string(),
  thumbnailUrl: z.string(),
  submitter: UserSchema,
});

const PlaceFacilitySchema = z.object({
  facility: z.string(),
  description: z.string(),
});

const PlaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  description: z.string().nullable(),
  slug: z.string(),
  address: AddressSchema,
  currency: z.string(),
  priceRange: z.string(),
  operatingHours: z.array(OperatingHour),
  placeFacilities: z.array(PlaceFacilitySchema),
  photos: z.array(
    z.object({
      url: z.string(),
      order: z.number(),
    }),
  ),
  thumbnailUrl: z.string(),
  submitter: UserSchema,
});
const PlacesSchema = z.array(PlaceItemSchema);
const FavoritePlaceSchema = z.object({
  favoriteId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  streetAddress: AddressSchema,
  priceRange: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

const EditPlaceSchema = z.object({
  placePhotos: z.string().min(1).optional(),
  name: z.string().min(4).max(255),
  description: z.preprocess(
    value => (value === "" ? undefined : value),
    z.string().min(4).max(255).optional(),
  ),
  streetAddress: z.string().min(4).max(100),
  priceRangeMin: z.preprocess(
    value => (value === "" ? undefined : value),
    z.number().min(1).optional(),
  ),
  priceRangeMax: z.preprocess(
    value => (value === "" ? undefined : value),
    z.number().min(1).optional(),
  ),
  latitude: z
    .number({
      required_error: "Please pinpoint cafe location",
      invalid_type_error: "latitude must be a number",
    })
    .min(-90, { message: "Latitude must be between -90 and 90." }),
  longitude: z
    .number({
      invalid_type_error: "longitude must be a number",
    })
    .min(-180, { message: "Longitude must be between -180 and 180." }),
  cityId: z
    .string({
      required_error: "Please select city",
      invalid_type_error: "Name must be a string",
    })
    .min(4, { message: "Please select city" }),

  operatingHours: z
    .array(
      z.object({
        day: z.string(),
        openingTime: z
          .string()
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Invalid time format (HH:mm).",
          })
          .optional(),
        closingTime: z
          .string()
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
            message: "Invalid time format (HH:mm).",
          })
          .optional(),
      }),
      // .refine(data => !data.day || (data.openingTime && data.closingTime), {
      //   message:
      //     "If a day is selected, both openingTime and closingTime must be provided.",
      //   path: ["openingTime", "closingTime"], // Error message targets both fields
      // }),
    )
    .optional(),

  // placeFacilities: z
  //   .array(
  //     z.object({
  //       facilityId: z
  //         .string()
  //         .nonempty({ message: "Facility ID cannot be empty." }),
  //       description: z.string().optional(),
  //     }),
  //   )
  //   .optional(),
});

export {
  OperatingHour,
  AddressSchema,
  PlaceItemSchema,
  PlaceFacilitySchema,
  PlaceSchema,
  FavoritePlaceSchema,
  PlacesSchema,
  schemaOperatingHoursPlace,
  EditPlaceSchema,
  operatingHours,
  schemaFacilities,
};
