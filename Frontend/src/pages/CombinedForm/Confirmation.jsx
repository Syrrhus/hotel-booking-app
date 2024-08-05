import React from 'react';

const Confirmation = ({ bookingInfo, guestInfo,prevStep, nextStep}) => {
  return (
    <div>
      {/* <h2>Confirmation</h2> */}
      <div>
        <h3>Booking Details</h3>
        <p>Number of Nights: {bookingInfo.numberOfNights}</p>
        <p>Start Date: {bookingInfo.startDate}</p>
        <p>End Date: {bookingInfo.endDate}</p>
        <p>Adults: {bookingInfo.adults}</p>
        <p>Children: {bookingInfo.children}</p>
        <p>Room Types: {bookingInfo.roomTypes}</p>
        <p>Special Requests: {bookingInfo.messageToHotel}</p>
      </div>
      <div>
        <h3>Guest Details</h3>
        <p>Salutation: {guestInfo.salutation}</p>
        <p>First Name: {guestInfo.firstName}</p>
        <p>Last Name: {guestInfo.lastName}</p>
        <p>Phone Number: {guestInfo.phoneNumber}</p>
        <p>Email: {guestInfo.email}</p>
      </div>
      <button type="button" onClick={prevStep}>Back</button>
      <button type="button" onClick={nextStep}>Confirm and Pay</button>
    </div>
  );
};

export default Confirmation;
