import { z } from "zod";

import { id } from "./general";
import { UserSchema } from "./user";

const OperatingHourSchema = z.object({
  day: z.string(),
  openingTime: z.string(),
  closingTime: z.string(),
});

const OperatingHoursSchema = z.array(OperatingHourSchema).optional();
const schemaOperatingHoursPlace = z.object({
  id,
  operatingHours: OperatingHoursSchema,
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
  operatingHours: z.array(OperatingHourSchema),
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

export {
  OperatingHourSchema,
  AddressSchema,
  PlaceItemSchema,
  PlaceFacilitySchema,
  PlaceSchema,
  FavoritePlaceSchema,
  PlacesSchema,
  schemaOperatingHoursPlace,
};
