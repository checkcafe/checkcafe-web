export interface Filter {
  name?: string;
  priceRangeMin?: { lte: string };
  priceRangeMax?: { gte: string };
  "city.name"?: string;
  openingTime?: { lte: string };
  closingTime?: { gte: string };
}
