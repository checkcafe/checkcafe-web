export interface Filter {
  name?: string;
  priceRange?: { gte?: string; lte?: string };
  "city.name"?: string;
  "operatingHours.openingTime"?: { gte: string };
  "operatingHours.closingTime"?: { lte: string };
}
