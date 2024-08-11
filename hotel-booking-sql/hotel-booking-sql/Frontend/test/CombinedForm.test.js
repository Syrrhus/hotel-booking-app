import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import CombinedForm from '../src/pages/CombinedForm/CombinedForm';
import fetchMock from 'jest-fetch-mock';
import { useLocation } from 'react-router-dom';

// Mock child components
jest.mock('../src/pages/CombinedForm/BookingDetails', () => (props) => (
  <div>
    <input placeholder="Number of nights" name="numberOfNights" value={props.bookingInfo.numberOfNights} onChange={props.handleChange} />
    <input placeholder="Start date" name="startDate" value={props.bookingInfo.startDate} onChange={props.handleChange} />
    <input placeholder="End date" name="endDate" value={props.bookingInfo.endDate} onChange={props.handleChange} />
    <input placeholder="Adults" name="adults" value={props.bookingInfo.adults} onChange={props.handleChange} />
    <input placeholder="Children" name="children" value={props.bookingInfo.childrens} onChange={props.handleChange} />
    <button onClick={props.nextStep}>Next</button>
  </div>
));

jest.mock('../src/pages/CombinedForm/GuestDetails', () => (props) => (
  <div>
    <input placeholder="First Name" name="firstName" value={props.guestInfo.firstName} onChange={props.handleChange} />
    <input placeholder="Last Name" name="lastName" value={props.guestInfo.lastName} onChange={props.handleChange} />
    <input placeholder="Phone Number" name="phoneNumber" value={props.guestInfo.phoneNumber} onChange={props.handleChange} />
    <input placeholder="Email" name="email" value={props.guestInfo.email} onChange={props.handleChange} />
    <button onClick={props.prevStep}>Previous</button>
    <button onClick={props.nextStep}>Next</button>
  </div>
));

jest.mock('../src/pages/CombinedForm/Confirmation', () => (props) => (
  <div>
    <button onClick={props.prevStep}>Previous</button>
    <button onClick={props.nextStep}>Next</button>
  </div>
));

jest.mock('../src/pages/CombinedForm/PaymentDetails', () => (props) => (
  <div>
    <input placeholder="Card Number" name="cardNumber" value={props.value} onChange={(e) => props.setValue(e.target.value)} />
    <input placeholder="CVC" name="cvc" value={props.paymentInfo.cvc} onChange={props.handleChange} />
    <input placeholder="Expiry Date" name="cardExpiry" value={props.paymentInfo.cardExpiry} onChange={props.handleChange} />
    <button onClick={props.prevStep}>Previous</button>
    <button onClick={props.handleSubmit}>Submit</button>
  </div>
));

fetchMock.enableMocks();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

beforeEach(() => {
  fetch.resetMocks();
});

const mockHotel = {
  id: 1,
  original_metadata: { country: 'Country' },
  name: 'Mock Hotel',
  address: '123 Mock St',
  rating: 4.5,
  distance: 100,
  price: 200,
  image_details: { prefix: 'http://image.url/', suffix: '.jpg' },
  imageCount: 5,
  categories: {
    category1: { name: 'Category 1', score: 4, popularity: 90 },
    category2: { name: 'Category 2', score: 3.5, popularity: 80 }
  },
  amenities_ratings: [
    { name: 'WiFi', score: 4.2 },
    { name: 'Pool', score: 3.8 }
  ],
  amenities: {
    freeWiFi: true,
    breakfastIncluded: true
  }
};

const renderComponent = () => {
  useLocation.mockReturnValue({ state: { hotel: mockHotel } });

  render(
    <Router>
      <CombinedForm />
    </Router>
  );
};

test('renders CombinedForm and submits booking', async () => {
  renderComponent();

  // Mock the fetch response for the booking API
  fetch.mockResponseOnce(JSON.stringify({ bookingReference: 'ABC123' }), { status: 200 });

  const alertMock = jest.spyOn(window, 'alert').mockImplementation();

  // Simulate form filling for the steps
  fireEvent.change(screen.getByPlaceholderText('Number of nights'), { target: { value: '2' } });
  fireEvent.change(screen.getByPlaceholderText('Start date'), { target: { value: '2024-08-01' } });
  fireEvent.change(screen.getByPlaceholderText('End date'), { target: { value: '2024-08-03' } });
  fireEvent.change(screen.getByPlaceholderText('Adults'), { target: { value: '2' } });
  fireEvent.change(screen.getByPlaceholderText('Children'), { target: { value: '1' } });

  fireEvent.click(screen.getByText('Next'));

  fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
  fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByPlaceholderText('Phone Number'), { target: { value: '1234567890' } });
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });

  fireEvent.click(screen.getByText('Next'));

  // No need to fill anything on the confirmation step, just proceed
  fireEvent.click(screen.getByText('Next'));

  fireEvent.change(screen.getByPlaceholderText('Card Number'), { target: { value: '4111111111111111' } });
  fireEvent.change(screen.getByPlaceholderText('CVC'), { target: { value: '123' } });
  fireEvent.change(screen.getByPlaceholderText('Expiry Date'), { target: { value: '12/24' } });

  fireEvent.click(screen.getByText('Submit'));

   // Wait for the alert to appear and check the content
   await waitFor(() => {
    expect(alertMock).toHaveBeenCalledWith('Booking successful! Your booking reference is ABC123');
  });

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/bookings', expect.objectContaining({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: expect.any(String)
  }));

  // Clean up the mock
  alertMock.mockRestore();
});