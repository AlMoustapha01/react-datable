export function isDateInRange(
  date: string | Date,
  startDate: string | Date,
  endDate: string | Date
): boolean {
  // Convert input to Date objects if they are strings
  const checkDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure start date is less than or equal to end date
  if (start > end) {
    throw new Error("startDate must be less than or equal to endDate");
  }

  // Check if the date is in range
  return checkDate >= start && checkDate <= end;
}
