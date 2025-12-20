/**
 * Clamp a numeric input value to stay within min and max bounds
 * @param inputValue - String representation of the number to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value as string
 */
export function clampNumericInput(
  inputValue: string,
  min: number,
  max: number,
): string {
  const value = parseInt(inputValue) || 0;
  if (value < min) {
    return min.toString();
  }
  if (value > max) {
    return max.toString();
  }
  return inputValue;
}
