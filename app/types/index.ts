export type OperatingHour = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  day: string;
  startDateTime: Date;
  endDateTime: Date;
  placeId: string;
};

export type Place = {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  slug: string;
  streetAddress: string;
  priceRange: string | null;
  isPublished: boolean;
  cityId: string | null;
  userId: string;

  operatingHours: OperatingHour[];

  updatedAt: Date;
  createdAt: Date;
};
