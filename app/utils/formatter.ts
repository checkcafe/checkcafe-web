/**
 * Formats a given time string into a "HH:MM" format.
 *
 * @param time - The time string to be formatted.
 * @returns A formatted time string in "HH:MM" format.
 */
export function formatTime(time: string): string {
  const date = new Date(time);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  // console.log(hours, minutes, "date");
  const formattedTime = String(`${hours}:${minutes}`);
  return formattedTime;
}

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

export const formatFilterTime = (inputTime: string) => {
  const localDate = new Date(`1970-01-01T${inputTime}:00+07:00`);

  return localDate.toISOString();
};
