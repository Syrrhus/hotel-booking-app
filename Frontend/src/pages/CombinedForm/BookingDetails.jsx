import React from 'react';

const BookingDetails = ({ bookingInfo, handleChange, nextStep }) => {
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
            type="number"
            name="adults"
            value={bookingInfo.adults}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Children</label>
          <input
            type="number"
            name="children"
            value={bookingInfo.children}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Room Types</label>
          <input
            type="text"
            name="roomTypes"
            value={bookingInfo.roomTypes}
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
        <button type="button" onClick={nextStep}>Next</button>
      </form>
    </div>
  );
};

export default BookingDetails;
