export const validatePhoneNumber = (phoneNumber) => {
  const number = phoneNumber.slice(3);
  const phoneNumberAsInt = parseInt(number.replace(' ', ''), 10);
  return phoneNumberAsInt >= 80000000 && phoneNumberAsInt < 100000000;
};

export const validateCardNumber = (cardNumber) => {
const cardNumberAsInt = parseInt(cardNumber.replaceAll(' ', ''), 10);
return cardNumberAsInt >= Math.pow(10, 15) && cardNumberAsInt < Math.pow(10, 16);
};

export const validateCVC = (cvc) => {
const cvcAsInt = parseInt(cvc);
return cvcAsInt >= 100 && cvcAsInt < 1000;
};

export const validateCardExpiry = (date) => {
const yearAsInt = parseInt(date.slice(3));
const monthAsInt = parseInt(date.slice(0, 2));
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
if (yearAsInt > currentYear) {
  return true;
} else if (yearAsInt === currentYear) {
  return monthAsInt > currentMonth;
} else {
  return yearAsInt > currentYear;
}
};

export const validateNumNights = (nights) => {
const night = parseInt(nights);
return (night > 0 );
};

export const validatePeople = (adults, children) => {
  const adultCount = parseInt(adults, 10);
  const childCount = parseInt(children, 10);
  
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
return start <= end ;
};

export const validDate = (date) => {
const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
return new Date(date) >= currentDate;
};

export const validNoneEmpty = (name) => {
  return name !== "";
}