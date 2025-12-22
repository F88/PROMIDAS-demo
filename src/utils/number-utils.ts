/**
 * Clamp a numeric input value to stay within min and max bounds
 * @param inputValue - String representation of the number to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value as string, or empty string if input is not a valid number
 */
export function clampNumericInput(
  inputValue: string,
  min: number,
  max: number,
): string {
  // Allow empty string for clearing the input
  if (inputValue.trim() === '') {
    return '';
  }

  const value = parseInt(inputValue);

  // Return empty string for invalid numeric input
  if (isNaN(value)) {
    return '';
  }

  if (value < min) {
    return min.toString();
  }
  if (value > max) {
    return max.toString();
  }
  return value.toString();
}
