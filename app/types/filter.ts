export interface Filter {
  name?: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  "city.name"?: string;
  "operatingHours.openingTime"?: { gte: string };
  "operatingHours.closingTime"?: { lte: string };
}
