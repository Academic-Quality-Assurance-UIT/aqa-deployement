/**
 * Safely parses a date string or number into a Date object.
 * Returns null if the input is invalid or cannot be parsed.
 */
export function parseSafeDate(value: any): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const date = new Date(value);

  // Check if date is "Invalid Date"
  if (isNaN(date.getTime())) {
    return null;
  }

  // Handle specific edge cases from some APIs (e.g., 0000-00-00)
  if (date.getFullYear() < 1000) {
    return null;
  }

  return date;
}
