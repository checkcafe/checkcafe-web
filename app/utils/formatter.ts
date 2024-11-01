/**
 * Formats a given time string into a "HH:MM" format.
 *
 * @param time - The time string to be formatted.
 * @returns A formatted time string in "HH:MM" format.
 */
export const formatTime = (time: string): string => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

/**
 * Formats a given price amount into a string, using the Indonesian locale.
 *
 * @param amount - The price amount to be formatted.
 * @returns A formatted price string.
 */
export const formatPrice = (amount: number): string => {
  return amount.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Return format price range. ex: 50.000 - 200.000
 *
 * @param min - min price
 * @param max - max price
 * @returns - fixed value
 */
export const formatPriceRange = (
  min: string | null,
  max: string | null,
): string => {
  const formattedMin = min ? formatPrice(parseInt(min)) : null;
  const formattedMax = max ? formatPrice(parseInt(max)) : null;

  if (formattedMin && formattedMax) {
    return `${formattedMin} - ${formattedMax}`;
  }
  return formattedMin || formattedMax || "-";
};
