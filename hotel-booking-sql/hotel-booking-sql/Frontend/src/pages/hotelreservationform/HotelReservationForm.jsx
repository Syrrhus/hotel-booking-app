import React, { useState } from 'react';
import './hotelreservationform.css';
import { useNavigate, useLocation } from "react-router-dom";
import { MaskedInput, createDefaultMaskGenerator } from 'react-hook-mask';
import {validateCardExpiry,validateCVC,validateCardNumber, validateNumNights,validatePhoneNumber, dateDifference } from './validation';


const HotelReservationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hotel = location.state.hotel; // Extracting hotel data from state
  

  const [bookingInfo, setBookingInfo] = useState({
    destinationID: hotel.original_metadata.country,
    hotelID: hotel.id,
    numberOfNights: '', 
    startDate: '',
    endDate: '',
    adults: 0,
    children: 0,
    messageToHotel: '',
    roomTypes: ''
  });

  const [guestInfo, setGuestInfo] = useState({
    salutation: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    billingAddress: '',
    cardNumber: '',
    cvc: '',
    cardExpiry: ''
  });

  const [errors, setErrors] = useState({});
  const maskGenerator = createDefaultMaskGenerator('9999 9999 9999 9999');
  const [value, setValue] = React.useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in guestInfo) {
      setGuestInfo((prevState) => ({
        ...prevState,
        [name]: value
      }));
    } else if (name in paymentInfo) {
      setPaymentInfo((prevState) => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setBookingInfo((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePhoneNumber(guestInfo.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be between 80000000 and 90000000';
      alert("Invalid phone number keyed!")
    }
    else if (!validateCardNumber(value)) {
      newErrors.creditCardNumber = 'Card number is invalid';
      alert("Invalid card number keyed!")
    }
    else if (!validateCVC(paymentInfo.cvc)) {
      newErrors.cardNumber = 'cvc is invalid';
      alert("Invalid cvc keyed!")
    }
    else if (!validateCardExpiry(paymentInfo.cardExpiry)) {
      newErrors.cardExpiry = 'card has expiry';
      alert("please use card that have not expired!")
    } else if (!validateNumNights(bookingInfo.numberOfNights)){
      newErrors.numberOfNights = 'please enter validate days you intent to stay'
      alert("invalid number of night entered")
    } else if (!dateDifference(bookingInfo.startDate, bookingInfo.endDate)){
      alert("invalid number start or end date entered")
    }
    

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
        setErrors({});
        // Prepare the data to be sent to the server
        const bookingData = {
          ...bookingInfo,
          ...guestInfo,
          ...paymentInfo,
          cardNumber: value // use the value from the masked input
        };
        
        try {
          const response = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
          });
  
          if (response.ok) {
            const result = await response.json();
            alert('Booking successful! Your booking reference is ' + result.bookingReference);
            navigate(`/hotels/${hotel.id}`, { state: { hotel } });
          } else {
            alert('Booking failed. Please try again.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Booking failed. Please try again.');
        }
      }

  };
  
  const handleNavigate = () => {
    navigate(`/hotels/${hotel.id}`, { state: { hotel } });
  };

  return (
    <div className="form-container">
      <h1>Hotel Reservation Form</h1>
      <h2>{hotel.name}</h2> {/* Display the hotel name here */}
      <p>Please complete the form below.</p>
      <form onSubmit={handleSubmit}>
        <h2>Your registration will be verified prior to your arrival.</h2>
        <div className="form-group">
          <div className="form-row">
            <label>Number of Nights</label>
            <input
              type="text"
              name="numberOfNights"
              value={bookingInfo.numberOfNights}
              onChange={handleChange}
              required
            />
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={bookingInfo.startDate}
              onChange={handleChange}
              required
            />
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={bookingInfo.endDate}
              onChange={handleChange}
              required
            />
            <label>Adults</label>
            <input
              type="number"
              name="adults"
              value={bookingInfo.adults}
              onChange={handleChange}
              required
            />
            <label>Children</label>
            <input
              type="number"
              name="children"
              value={bookingInfo.children}
              onChange={handleChange}
              required
            />
            <label>Room Types</label>
            <input
              type="text"
              name="roomTypes"
              value={bookingInfo.roomTypes}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Special Requests</label>
          <textarea
            name="messageToHotel"
            placeholder="Enter any special requests here..."
            value={bookingInfo.messageToHotel}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <div className="form-row">
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
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={guestInfo.firstName}
              onChange={handleChange}
              required
            />
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={guestInfo.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="form-row">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="xxxx xxxx"
              minLength="8"
              maxLength="9"
              value={guestInfo.phoneNumber}
              onChange={handleChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="ex: myname@example.com"
              value={guestInfo.email}
              onChange={handleChange}
              required
              className="email-input"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Billing Address</label>
          <input
            type="text"
            name="billingAddress"
            placeholder="Billing Address"
            value={paymentInfo.billingAddress}
            onChange={handleChange}
            required
          />
        </div>
        <h2>Payment Methods</h2>
        <div className="form-group">
          <div className="form-row">
            <MaskedInput
              maskGenerator={maskGenerator}
              value={value}
              onChange={setValue}
              placeholder='Card number'
            />
            <input
              type="text"
              name="cvc"
              placeholder="CVC"
              minLength="3"
              maxLength="3"
              value={paymentInfo.cvc}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="cardExpiry"
              placeholder="MM/YYYY"
              minLength="7"
              maxLength="7"
              value={paymentInfo.cardExpiry}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="button" onClick={handleNavigate}>
          Return to View Hotel
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default HotelReservationForm;