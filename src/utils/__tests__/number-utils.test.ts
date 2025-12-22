import { describe, it, expect } from 'vitest';
import { clampNumericInput } from '../number-utils';

describe('clampNumericInput', () => {
  describe('valid numeric inputs', () => {
    it('should return the value as string when within bounds', () => {
      expect(clampNumericInput('50', 0, 100)).toBe('50');
      expect(clampNumericInput('0', 0, 100)).toBe('0');
      expect(clampNumericInput('100', 0, 100)).toBe('100');
    });

    it('should clamp to min when value is below minimum', () => {
      expect(clampNumericInput('-10', 0, 100)).toBe('0');
      expect(clampNumericInput('-1', 0, 100)).toBe('0');
    });

    it('should clamp to max when value is above maximum', () => {
      expect(clampNumericInput('150', 0, 100)).toBe('100');
      expect(clampNumericInput('99999', 0, 100)).toBe('100');
    });

    it('should normalize numeric strings', () => {
      expect(clampNumericInput('007', 0, 100)).toBe('7');
      expect(clampNumericInput('42', 0, 100)).toBe('42');
    });
  });

  describe('empty and whitespace inputs', () => {
    it('should return empty string for empty input', () => {
      expect(clampNumericInput('', 0, 100)).toBe('');
    });

    it('should return empty string for whitespace-only input', () => {
      expect(clampNumericInput('   ', 0, 100)).toBe('');
      expect(clampNumericInput('\t', 0, 100)).toBe('');
      expect(clampNumericInput('\n', 0, 100)).toBe('');
    });
  });

  describe('invalid numeric inputs', () => {
    it('should return empty string for non-numeric characters', () => {
      expect(clampNumericInput('x', 0, 100)).toBe('');
      expect(clampNumericInput('abc', 0, 100)).toBe('');
      expect(clampNumericInput('!@#', 0, 100)).toBe('');
    });

    it('should handle mixed alphanumeric input using parseInt behavior', () => {
      // parseInt parses leading numeric characters
      expect(clampNumericInput('12abc', 0, 100)).toBe('12');
      // parseInt returns NaN when string starts with non-numeric characters
      expect(clampNumericInput('abc12', 0, 100)).toBe('');
    });

    it('should handle decimal numbers by truncating to integer', () => {
      expect(clampNumericInput('3.14', 0, 100)).toBe('3');
      expect(clampNumericInput('99.9', 0, 100)).toBe('99');
    });
  });

  describe('edge cases', () => {
    it('should handle large numbers correctly', () => {
      expect(clampNumericInput('999999', 0, 99999)).toBe('99999');
      expect(clampNumericInput('50000', 0, 99999)).toBe('50000');
    });

    it('should handle negative bounds', () => {
      expect(clampNumericInput('-50', -100, 0)).toBe('-50');
      expect(clampNumericInput('-150', -100, 0)).toBe('-100');
      expect(clampNumericInput('50', -100, 0)).toBe('0');
    });

    it('should handle zero', () => {
      expect(clampNumericInput('0', 0, 100)).toBe('0');
      expect(clampNumericInput('0', -100, 100)).toBe('0');
    });
  });
});
