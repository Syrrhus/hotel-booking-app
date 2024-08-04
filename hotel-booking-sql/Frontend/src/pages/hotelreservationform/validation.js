export const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberAsInt = parseInt(phoneNumber.replace(' ', ''), 10);
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

export const validatePeople = (ppl) =>{
  const people = parseInt(ppl);
  return (people > 0);
};

export const dateDifference = (start, end) =>{
  return start < end ;
};

export const validDate = (date) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return new Date(date) >= currentDate;
};
