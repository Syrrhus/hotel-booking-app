// getRatingTest.test.js

import { getRatingText } from '../src/pages/hotel/Hotel'; // Ensure this path is correct

describe('getRatingText', () => {
  test('returns "Excellent" for ratings 4 and above', () => {
    expect(getRatingText(4)).toBe('Excellent');
    expect(getRatingText(4.5)).toBe('Excellent');
  });

  test('returns "Very Good" for ratings between 3.5 and 3.9', () => {
    expect(getRatingText(3.5)).toBe('Very Good');
    expect(getRatingText(3.9)).toBe('Very Good');
  });

  test('returns "Good" for ratings between 3 and 3.4', () => {
    expect(getRatingText(3)).toBe('Good');
    expect(getRatingText(3.4)).toBe('Good');
  });

  test('returns "Average" for ratings between 2.5 and 2.9', () => {
    expect(getRatingText(2.5)).toBe('Average');
    expect(getRatingText(2.9)).toBe('Average');
  });

  test('returns "Below Average" for ratings between 1.5 and 2.4', () => {
    expect(getRatingText(1.5)).toBe('Below Average');
    expect(getRatingText(2.4)).toBe('Below Average');
  });

  test('returns "Poor" for ratings below 1.5', () => {
    expect(getRatingText(1.4)).toBe('Poor');
    expect(getRatingText(0)).toBe('Poor');
  });
});
