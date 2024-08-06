import React from 'react';
import { validateNumNights, validatePeople, validDate, validNoneEmpty } from './validation';


const BookingDetails = ({ bookingInfo, handleChange, nextStep }) => {
  // console.log(bookingInfo.adults.includes("."), bookingInfo.children.includes("."), "nonesense")
  
  const handleNext = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateNumNights(bookingInfo.numberOfNights)){
      newErrors.numberOfNights = 'please enter validate days you intent to stay'
      alert("invalid number of night entered")
    } else if (!validDate(bookingInfo.startDate) || !validDate(bookingInfo.endDate)) {
      newErrors.validDate = 'Please enter valid dates that have not passed';
      alert('You cannot book a room for a date before today!');
    } else if (new Date(bookingInfo.startDate) > new Date(bookingInfo.endDate)) {
      newErrors.validDate = 'Start date cannot be after end date';
      alert('The start date cannot be after the end date!');
    }else if (validatePeople(bookingInfo.adults, bookingInfo.children) === 1) {
      newErrors.people = 'Please ensure there is at least one adult if there are children';
      alert(`Please ensure there is at least one adult if there are children ${bookingInfo.ch}`);
    }else if (validatePeople(bookingInfo.adults, bookingInfo.children) === 2) {
      newErrors.ppl = 'Please choose the number of adults';
      alert("Please ensure there is at least one adult ");
    }else if (validatePeople(bookingInfo.adults, bookingInfo.children) === false) {
        newErrors.ppl = 'Please enter a valid value!';
        alert("Please enter a valid value!");
    }else {
      nextStep()
    }
  }

  return (
    <div>
      {/* <h2>Booking Details</h2> */}
      <form>
        <div>
          <label>Number of Nights</label>
          <input
            type="text"
            name="numberOfNights"
            value={bookingInfo.numberOfNights}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={bookingInfo.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={bookingInfo.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Adults</label>
          <input
            type="text"
            name="adults"
            value={bookingInfo.adults}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Children</label>
          <input
            type="text"
            name="children"
            value={bookingInfo.children}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Special Requests</label>
          <textarea
            name="messageToHotel"
            value={bookingInfo.messageToHotel}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleNext}>Next</button>
      </form>
    </div>
  );
};

export default BookingDetails;
