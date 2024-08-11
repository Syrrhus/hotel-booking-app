// validate.test.js
import { validatePhoneNumber, validateNumNights, validatePeople, dateDifference,validDate, validNoneEmpty} from '../src/pages/CombinedForm/validation'; // Adjust the path as needed

describe('validatePhoneNumber', () => {
  it('should return false when no phone number is input', () => {
    expect(validatePhoneNumber('')).toBe(false);
  });

  it('should return true for a valid phone number within the range', () => {
    expect(validatePhoneNumber('+6585000000')).toBe(true);
  });

  it('should return false for a phone number below the range', () => {
    expect(validatePhoneNumber('+6579999999')).toBe(false);
  });

  it('should return false for a phone number above the range', () => {
    expect(validatePhoneNumber('+6510000000')).toBe(false);
  });
});

describe('validateNumNights', () => {
    // Valid Equivalence Class
    test('should return true for positive integer values', () => {
      expect(validateNumNights('1')).toBe(true);
      expect(validateNumNights('10')).toBe(true);
      expect(validateNumNights('100')).toBe(true);
    });
    
    test('should return false for 0', () => {
        expect(validateNumNights('0')).toBe(false);
    })

    // Invalid Equivalence Classes
    test('should return false for negative integer values', () => {
      expect(validateNumNights('-1')).toBe(false);
      expect(validateNumNights('-100')).toBe(false);
    });
  
    test('should return false for non-integer values - character', () => {
      expect(validateNumNights('a')).toBe(false);
      expect(validateNumNights('/')).toBe(false)
    });
    
    test('should return false for non-integer values - float', () => {
        expect(validateNumNights('1.5')).toBe(false);
    });
    
    test('should return false for non-integer values - null', () => {
        expect(validateNumNights(null)).toBe(false);
    });
    
    test('should return false for non-integer values - underfined', () => {
        expect(validateNumNights(undefined)).toBe(false);
    });

    test('should return false for non-integer values - empty string', () => {
        expect(validateNumNights('')).toBe(false);
    });
});

describe('validatePeople', () => {
  // Valid cases
  test('should return true for positive number of adults and zero or more children', () => {
    expect(validatePeople('1', '0')).toBe(true); // 1 adult, 0 children
    expect(validatePeople('2', '3')).toBe(true); // 2 adults, 3 children
    expect(validatePeople('5', '10')).toBe(true); // 5 adults, 10 children
  });

  // Invalid cases
  test('should return 1 for zero adults and positive number of children', () => {
    expect(validatePeople('0', '1')).toBe(1); // 0 adults, 1 child
    expect(validatePeople('0', '5')).toBe(1); // 0 adults, 5 children
  });

  test('should return 2 for zero adults and zero children', () => {
    expect(validatePeople('0', '0')).toBe(2); // 0 adults, 0 children
  });

  // Additional edge cases
  test('should handle non-integer input by converting to integer', () => {
    expect(validatePeople('1.5', '2.5')).toBe(false); // 1 adult, 2 children (floats should be converted to integers)
    expect(validatePeople('2', '3.7')).toBe(false); // 2 adults, 3 children (floats should be converted to integers)
  });

  test('should handle negative input by treating as zero', () => {
    expect(validatePeople('-1', '3')).toBe(false); // -1 adult (treated as 0), 3 children
    expect(validatePeople('2', '-5')).toBe(false); // 2 adults, -5 children (treated as 0)
    expect(validatePeople('-3', '-4')).toBe(false);
  });

  test('should handle non-numeric input gracefully', () => {
    expect(validatePeople('abc', '123')).toBe(false); // Non-numeric adults, valid children
    expect(validatePeople('10', 'xyz')).toBe(false); // Valid adults, non-numeric children
    expect(validatePeople('abc', 'xyz')).toBe(false); // Non-numeric adults and children
  });
});

describe('dateDifference', () => {
  // Convert date strings to Date objects for comparison
  const date1 = new Date('2024-01-01');
  const date2 = new Date('2024-02-01');
  const date3 = new Date('2024-01-01');
  const date4 = new Date('2023-12-31');

  test('should return true if start date is earlier than end date', () => {
    expect(dateDifference(date1, date2)).toBe(true); 
  });

  test('should return false if start date is the same as end date', () => {
    expect(dateDifference(date1, date3)).toBe(false); 
  });

  test('should return false if start date is later than end date', () => {
    expect(dateDifference(date2, date1)).toBe(false); 
    expect(dateDifference(date2, date4)).toBe(false); 
  });
 

  test('should handle invalid date inputs gracefully', () => {
    expect(dateDifference(new Date('2025-02-30'), new Date('2025-03-01'))).toBe(false);
    expect(dateDifference(new Date('2024-08-32'), new Date('2024-09-10'))).toBe(false); 
    expect(dateDifference(new Date('2024-08-32'), new Date('2024-08-33'))).toBe(false);
  });
});

describe('validDate', () => {
  it('should return true for a valid future date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
    expect(validDate(futureDate.toISOString())).toBe(true);
  });

  it('should return true for today\'s date', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    expect(validDate(today.toISOString())).toBe(true);
  });

  it('should return false for a past date', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1); // Yesterday
    expect(validDate(pastDate.toISOString())).toBe(false);
  });

  it('should return false for an invalid date', () => {
    const invalidDate = 'invalid-date';
    expect(validDate(invalidDate)).toBe(false);
  });
});

describe('validNoneEmpty', () => {
    it('should return true for a valid numerical string', () => {
        expect(validNoneEmpty('12345')).toBe(true);
      });
    
      it('should return false for an empty string', () => {
        expect(validNoneEmpty('')).toBe(false);
      });
    
      it('should return false for a string with special characters', () => {
        expect(validNoneEmpty('123@456')).toBe(false);
      });

      it('should return falSE characters', () => {
        expect(validNoneEmpty('john///')).toBe(false);
      });
    
      it('should return false for a string with newline characters', () => {
        expect(validNoneEmpty('123\n456')).toBe(false);
      });
    
      it('should return false for a string with tabs', () => {
        expect(validNoneEmpty('123\t456')).toBe(false);
      });
});