import request from 'supertest';
import express from 'express';
import bookingRoutes from '../routes/bookings.js';
import createTestConnection from '../db/testDb'; // Import the connection promise

const app = express();
app.use(express.json());
app.use('/bookings', bookingRoutes);

let connection;

beforeAll(async () => {
  try {
    // Wait for the connection to be established
    connection = await createTestConnection;

    // Set up test database tables
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS guest_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        salutation VARCHAR(10),
        firstName VARCHAR(50),
        lastName VARCHAR(50),
        phoneNumber VARCHAR(20),
        email VARCHAR(100)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS booking_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        destinationID INT,
        hotelID INT,
        numberOfNights INT,
        startDate DATE,
        endDate DATE,
        adults INT,
        children INT,
        messageToHotel TEXT,
        roomTypes VARCHAR(100),
        price DECIMAL(10, 2),
        bookingReference VARCHAR(36),
        guestID INT,
        FOREIGN KEY (guestID) REFERENCES guest_info(id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payment_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paymentID VARCHAR(50),
        payeeID VARCHAR(10),
        billingAddress TEXT,
        bookingID INT,
        FOREIGN KEY (bookingID) REFERENCES booking_info(id)
      )
    `);
  } catch (error) {
    console.error('Error setting up test database:', error.message);
    process.exit(1); // Exit the process if the database setup fails
  }
});

afterAll(async () => {
  if (connection) {
    try {
      // Clean up: drop test tables and close connection
      await connection.execute('DROP TABLE IF EXISTS payment_info');
      await connection.execute('DROP TABLE IF EXISTS booking_info');
      await connection.execute('DROP TABLE IF EXISTS guest_info');
      await connection.end();
    } catch (error) {
      console.error('Error cleaning up test database:', error.message);
    }
  }
});

describe('Booking Integration Tests', () => {
  beforeEach(async () => {
    // Clear tables before each test
    await connection.execute('DELETE FROM payment_info');
    await connection.execute('DELETE FROM booking_info');
    await connection.execute('DELETE FROM guest_info');
  });

  test('should create a booking through the API', async () => {
    const bookingData = {
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
      cardExpiry: '12/25'
    };

    const response = await request(app)
      .post('/bookings')
      .send(bookingData)
      .expect(201);

    expect(response.body).toHaveProperty('message', 'Booking successful!');
    expect(response.body).toHaveProperty('bookingReference');

    // Verify data in the database
    const [guestRows] = await connection.execute('SELECT * FROM guest_info');
    expect(guestRows.length).toBe(1);
    expect(guestRows[0]).toMatchObject({
      salutation: bookingData.salutation,
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      phoneNumber: bookingData.phoneNumber,
      email: bookingData.email
    });

    const [bookingRows] = await connection.execute('SELECT * FROM booking_info');
    expect(bookingRows.length).toBe(1);
    expect(bookingRows[0]).toMatchObject({
      destinationID: bookingData.destinationID,
      hotelID: bookingData.hotelID,
      numberOfNights: bookingData.numberOfNights,
      startDate: new Date(bookingData.startDate),
      endDate: new Date(bookingData.endDate),
      adults: bookingData.adults,
      children: bookingData.children,
      messageToHotel: bookingData.messageToHotel,
      roomTypes: bookingData.roomTypes,
      price: bookingData.price.toString(), // MySQL returns decimals as strings
      bookingReference: response.body.bookingReference
    });

    const [paymentRows] = await connection.execute('SELECT * FROM payment_info');
    expect(paymentRows.length).toBe(1);
    expect(paymentRows[0]).toMatchObject({
      paymentID: bookingData.cardNumber,
      payeeID: bookingData.cvc,
      billingAddress: bookingData.billingAddress
    });
  });

  test('should handle booking creation failure', async () => {
    const incompleteBookingData = {
      // Missing required fields
    };

    const response = await request(app)
      .post('/bookings')
      .send(incompleteBookingData)
      .expect(500);

    expect(response.body).toHaveProperty('message', 'Booking failed. Please try again.');

    // Verify no data was inserted
    const [guestRows] = await connection.execute('SELECT * FROM guest_info');
    expect(guestRows.length).toBe(0);

    const [bookingRows] = await connection.execute('SELECT * FROM booking_info');
    expect(bookingRows.length).toBe(0);

    const [paymentRows] = await connection.execute('SELECT * FROM payment_info');
    expect(paymentRows.length).toBe(0);
  });
});
