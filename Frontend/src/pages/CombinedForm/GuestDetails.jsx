import React from 'react';

const GuestDetails = ({ guestInfo, handleChange, nextStep, prevStep }) => {
  return (
    <div>
      {/* <h2>Guest Details</h2> */}
      <form>
        <div>
          <label>Salutation</label>
          <select
            name="salutation"
            value={guestInfo.salutation}
            onChange={handleChange}
            required
          >
            <option value="Mr">Mr.</option>
            <option value="Mrs">Mrs.</option>
            <option value="Miss">Miss</option>
            <option value="Ms">Ms.</option>
          </select>
        </div>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={guestInfo.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={guestInfo.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={guestInfo.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={guestInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="button" onClick={prevStep}>Back</button>
        <button type="button" onClick={nextStep}>Next</button>
      </form>
    </div>
  );
};

export default GuestDetails;
