export type OperatingHour = {
  day: string;
  start: string;
  end: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
};

export type User = {
  name: string;
  username: string;
  avatarUrl: string;
};

export type PlaceItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  currency: string;
  priceRange: string;
  latitude: number;
  longitude: number;
  address: Address;
  openingTime: string;
  closingTime: string;
  thumbnail: string;
  submitter: User;
};

export type PlaceFacility = {
  facility: string;
  description: string;
};

export type Place = {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  slug: string;
  address: Address;
  currency: string;
  priceRange: string;
  operatingHours: OperatingHour[];
  placeFacilities: PlaceFacility[];
  photos: string[];
  submitter: User;
};
