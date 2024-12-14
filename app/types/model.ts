export type OperatingHour = {
  day: string;
  openingTime: string;
  closingTime: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  cityId: string;
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
  priceRangeMin: string;
  priceRangeMax: string;
  latitude: number;
  longitude: number;
  address: Address;
  openingTime: string;
  closingTime: string;
  thumbnailUrl: string;
  submitter: User;
};

export type PlaceFacility = {
  id?: string;
  description?: string;
  facilityId: string;
  placeId?: string;
  // createdAt?: Date;
  // updatedAt?: Date;
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
  priceRangeMin: string;
  priceRangeMax: string;
  operatingHours: OperatingHour[];
  placeFacilities: PlaceFacility[];
  cityId: string;
  isPublished: boolean;
  photos: {
    url: string;
    order: number;
  }[];
  thumbnailUrl: string;
  submitter: User;
};

export type FavoritePlace = {
  favoriteId: string;
  name: string;
  slug: string;
  description?: string;
  streetAddress: Address;
  priceRange: string;
  latitude: number;
  longitude: number;
};

export type FavoritePlacesResponse = {
  name: string;
  username: string;
  avatarUrl: string;
  placeFavorites: FavoritePlace[];
};

export type City = {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  state: {
    name: string;
    country: {
      name: string;
      code: string;
    };
  };
};

type FacilityCategory = {
  name: string;
  description: string;
};

export type Facility = {
  id: string;
  name: string;
  description: string;
  facilityCategory: FacilityCategory;
};
