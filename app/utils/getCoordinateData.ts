import { GeoJSONs } from "~/types/responseMap";

export function getCoordinates(data: GeoJSONs): {
  latitude: number;
  longitude: number;
} {
  // Extract the first feature from the FeatureCollection
  const feature = data.features[0];

  // Access the coordinates from the geometry object
  const coordinates = feature?.geometry.coordinates;

  // Return the coordinates as latitude and longitude
  const longitude = coordinates && coordinates[0]; // Longitude is the first element in the array
  const latitude = coordinates && coordinates[1]; // Latitude is the second element in the array

  return { latitude: latitude as number, longitude: longitude as number };
}
