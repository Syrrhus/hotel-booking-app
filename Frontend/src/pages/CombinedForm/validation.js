export const validatePhoneNumber = (phoneNumber) => {
  const number = phoneNumber.slice(3);
  const phoneNumberAsInt = parseInt(number.replace(' ', ''), 10);
  return phoneNumberAsInt >= 80000000 && phoneNumberAsInt < 100000000;
};

export const validateNumNights = (nights) => {
  if (typeof nights !== 'string') return false;
  if (nights.includes(".") || !/^\d+$/.test(nights)) return false;

  const night = parseInt(nights, 10); // Parse the input as an integer
  
  // Return true if the parsed integer is greater than 0
  return night > 0;
};

export const validatePeople = (adults, children) => {
  const adultCount = parseInt(adults, 10);
  const childCount = parseInt(children, 10);

  if (adults.includes(".")|| children.includes(".") || !/^\d+$/.test(adults) || !/^\d+$/.test(children)) return false;
  
  if (adultCount > 0 && childCount >= 0) {
    return true;
  } else if (adultCount === 0 && childCount > 0) {
    return 1; // Invalid: children without adults
  } else if (adultCount === 0 && childCount === 0) {
    return 2; // Invalid: no people at all
  }
  
  return true; // Valid: adults with or without children
};

export const dateDifference = (start, end) =>{
  if (!(start instanceof Date) || !(end instanceof Date)) {
    return false;
  }

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return false;
  }
  return start < end ;
};

export const validDate = (date) => {
const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
return new Date(date) >= currentDate;
};

export const validNoneEmpty = (name) => {
  if (!/^\d+$/.test(name)) return false;
  return name !== "";
}