export interface Filter {
  name?: string;
  priceRangeMin?: { gte: string };
  priceRangeMax?: { lte: string };
  "city.name"?: string;
  openingTime?: { lte: string };
  closingTime?: { gte: string };
}
