// ValidDate.test.js

import { isValidDate } from '../src/pages/hotel/Hotel'; // Adjust path if necessary

describe('isValidDate', () => {

  // Test for valid Date objects
  test('returns true for valid dates', () => {
    expect(isValidDate(new Date())).toBe(true); // Current date
    expect(isValidDate(new Date('2024-01-01'))).toBe(true); // Specific date
  });

  // Test for invalid Date objects and invalid date strings
  test('returns false for invalid dates', () => {
    expect(isValidDate(new Date('Invalid Date'))).toBe(false); // Invalid Date object
    expect(isValidDate('2024-01-01')).toBe(false); // Strings should return false
  });

  // Test for non-date inputs
  test('returns false for non-date objects', () => {
    expect(isValidDate(null)).toBe(false); // Null input
    expect(isValidDate(undefined)).toBe(false); // Undefined input
    expect(isValidDate({})).toBe(false); // Empty object
    expect(isValidDate([])).toBe(false); // Array input
    expect(isValidDate(12345)).toBe(false); // Number input
    expect(isValidDate(true)).toBe(false); // Boolean input
  });
});
