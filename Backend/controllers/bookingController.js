import mysql from 'mysql';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/db.js';

export const createBooking = async (req, res) => {
  const {
    destinationID,
    hotelID,
    numberOfNights,
    startDate,
    endDate,
    adults,
    children,
    messageToHotel,
    roomTypes,
    price,
    salutation,
    firstName,
    lastName,
    phoneNumber,
    email,
    billingAddress,
    cardNumber,
    cvc,
    cardExpiry
  } = req.body;

  const bookingReference = uuidv4();

  try {
    const guestResult = await new Promise((resolve, reject) => {
      const query = 'INSERT INTO guest_info (salutation, firstName, lastName, phoneNumber, email) VALUES (?, ?, ?, ?, ?)';
      db.query(query, [salutation, firstName, lastName, phoneNumber, email], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const guestID = guestResult.insertId;

    const bookingResult = await new Promise((resolve, reject) => {
      const query = 'INSERT INTO booking_info (destinationID, hotelID, numberOfNights, startDate, endDate, adults, children, messageToHotel, roomTypes, price, bookingReference, guestID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [destinationID, hotelID, numberOfNights, startDate, endDate, adults, children, messageToHotel, roomTypes, price, bookingReference, guestID], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const bookingID = bookingResult.insertId;

    await new Promise((resolve, reject) => {
      const query = 'INSERT INTO payment_info (paymentID, payeeID, billingAddress, bookingID) VALUES (?, ?, ?, ?)';
      db.query(query, [cardNumber, cvc, billingAddress, bookingID], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    res.status(201).json({ message: 'Booking successful!', bookingReference });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Booking failed. Please try again.' });
  }
};