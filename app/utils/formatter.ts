export const formatHourMinute = (dateString: string) => {
  const hour = new Date(dateString).getUTCHours().toString().padStart(2, "0");
  const minute = new Date(dateString)
    .getUTCMinutes()
    .toString()
    .padStart(2, "0");

  return `${hour}:${minute}`;
};

export const formatPrice = (amount: number): string => {
  return amount.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
