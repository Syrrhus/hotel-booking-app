import React from 'react';
import { validNoneEmpty, validatePhoneNumber } from './validation';
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css'; // Include default styles
import './phoneDetails.css'; // Your custom styles

const GuestDetails = ({ guestInfo, handleChange, nextStep, prevStep }) => {
  const handleNext = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!emailPattern.test(guestInfo.email)) {
      newErrors.email = 'Please enter a valid email '
      alert('Please enter a valid email address.');
    }else if (!validNoneEmpty(guestInfo.firstName)) {
      newErrors.firstName = 'Please enter your first name';
      alert("Please fill in your first name");
    } else if (!validNoneEmpty(guestInfo.lastName)) {
      newErrors.lastName = 'Please enter your last name';
      alert("Please fill in your last name");
    } else if (!validNoneEmpty(guestInfo.email)) {
      newErrors.email = 'Please enter your email';
      alert("Please fill in your email");
    } else if (!validatePhoneNumber(guestInfo.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be a valid Singapore number';
      alert(`Invalid phone number keyed! ${guestInfo.phoneNumber.slice(2)}`);
    }else {
      nextStep();
    }
  };

  // Custom handler for PhoneInput change
  const handlePhoneChange = (value) => {
    handleChange({ target: { name: 'phoneNumber', value } });
  };

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
          <PhoneInput
            defaultCountry="SG"
            value={guestInfo.phoneNumber}
            onChange={handlePhoneChange}
            className="PhoneInput" // Apply custom class
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
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          />
        </div>
        <button type="button" onClick={prevStep}>Back</button>
        <button type="button" onClick={handleNext}>Next</button>
      </form>
    </div>
  );
};

export default GuestDetails;
