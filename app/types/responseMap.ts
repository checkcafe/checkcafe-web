// Define the type for the feature data structure
interface Context {
  country: {
    id: string;
    name: string;
    country_code: string;
    country_code_alpha_3: string;
  };
  postcode: {
    id: string;
    name: string;
  };
  place: {
    id: string;
    name: string;
  };
  locality: {
    id: string;
    name: string;
  };
  neighborhood: {
    id: string;
    name: string;
  };
  address: {
    id: string;
    name: string;
    address_number: string;
    street_name: string;
  };
  street: {
    id: string;
    name: string;
  };
}

interface FeatureProperties {
  name: string;
  mapbox_id: string;
  feature_type: string;
  address: string;
  full_address: string;
  place_formatted: string;
  context: Context;
  coordinates: {
    latitude: number;
    longitude: number;
    routable_points: {
      name: string;
      latitude: number;
      longitude: number;
    }[];
  };
  language: string;
  maki: string;
  poi_category: string[];
  poi_category_ids: string[];
  external_ids: object;
  metadata: {
    wheelchair_accessible: boolean;
  };
  operational_status: string;
}

interface Geometry {
  coordinates: [number, number]; // Longitude, Latitude
  type: string;
}

interface Feature {
  type: string;
  geometry: Geometry;
  properties: FeatureProperties;
}

export interface GeoJSONs {
  type: string;
  features: Feature[];
  attribution: string;
  url: string;
}
