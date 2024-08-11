import { createBooking } from '../controllers/bookingController.js'; // Adjust the import path
import db from '../db/db.js'; // Mocked database module
import { v4 as uuidv4 } from 'uuid';

jest.mock('../db/db.js'); // Mock the db module
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'), // Mock UUID to return a fixed value
}));

describe('createBooking API', () => {
  let req;
  let res;
  let statusMock;
  let jsonMock;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      body: {
        destinationID: 1,
        hotelID: 2,
        numberOfNights: 3,
        startDate: '2024-08-10',
        endDate: '2024-08-13',
        adults: 2,
        children: 1,
        messageToHotel: 'Special request',
        roomTypes: 'Deluxe',
        price: 500,
        salutation: 'Mr.',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        email: 'john.doe@example.com',
        billingAddress: '123 Main St',
        cardNumber: '1111-2222-3333-4444',
        cvc: '123',
        cardExpiry: '12/25',
      },
    };

    // Mock response status and json methods
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();

    res = {
      status: statusMock,
      json: jsonMock,
    };

    // Clear all mock data before each test
    jest.clearAllMocks();
  });

  test('should create a booking and respond with success', async () => {
    // Mock database responses for each query
    db.query
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { insertId: 1 }); // Mock response for guest info insertion
      })
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { insertId: 2 }); // Mock response for booking info insertion
      })
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { affectedRows: 1 }); // Mock response for payment info insertion
      });

    // Call the createBooking function with mocked req and res
    await createBooking(req, res);

    // Verify that the database queries were called correctly
    expect(db.query).toHaveBeenCalledTimes(3); // Check that three queries were executed
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO guest_info'),
      expect.arrayContaining([
        req.body.salutation,
        req.body.firstName,
        req.body.lastName,
        req.body.phoneNumber,
        req.body.email,
      ]),
      expect.any(Function)
    );
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO booking_info'),
      expect.arrayContaining([
        req.body.destinationID,
        req.body.hotelID,
        req.body.numberOfNights,
        req.body.startDate,
        req.body.endDate,
        req.body.adults,
        req.body.children,
        req.body.messageToHotel,
        req.body.roomTypes,
        req.body.price,
        'mocked-uuid',
        1,
      ]),
      expect.any(Function)
    );
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO payment_info'),
      expect.arrayContaining([
        req.body.cardNumber,
        req.body.cvc,
        req.body.billingAddress,
        2,
      ]),
      expect.any(Function)
    );

    // Verify the response
    expect(statusMock).toHaveBeenCalledWith(201); // Check that status 201 is set
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Booking successful!',
      bookingReference: 'mocked-uuid',
    });
  });

  test('should handle database errors and respond with failure', async () => {
    // Simulate a database error during guest info insertion
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Database error'), null); // Mock a database error
    });

    await createBooking(req, res);

    // Verify that only the first query was attempted
    expect(db.query).toHaveBeenCalledTimes(1); // Check that only one query was called

    // Verify the response
    expect(statusMock).toHaveBeenCalledWith(500); // Check that status 500 is set
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Booking failed. Please try again.',
    });
  });

  test('should handle booking info insertion failure', async () => {
    // Mock successful guest info insertion
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, { insertId: 1 });
    });

    // Simulate a failure during booking info insertion
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Booking info error'), null); // Mock a booking info error
    });

    await createBooking(req, res);

    // Verify that only the first two queries were attempted
    expect(db.query).toHaveBeenCalledTimes(2); // Check that two queries were called

    // Verify the response
    expect(statusMock).toHaveBeenCalledWith(500); // Check that status 500 is set
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Booking failed. Please try again.',
    });
  });

  test('should handle payment info insertion failure', async () => {
    // Mock successful guest and booking info insertion
    db.query
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { insertId: 1 });
      })
      .mockImplementationOnce((query, values, callback) => {
        callback(null, { insertId: 2 });
      });

    // Simulate a failure during payment info insertion
    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Payment info error'), null); // Mock a payment info error
    });

    await createBooking(req, res);

    // Verify that all three queries were attempted
    expect(db.query).toHaveBeenCalledTimes(3); // Check that three queries were called

    // Verify the response
    expect(statusMock).toHaveBeenCalledWith(500); // Check that status 500 is set
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Booking failed. Please try again.',
    });
  });
});
