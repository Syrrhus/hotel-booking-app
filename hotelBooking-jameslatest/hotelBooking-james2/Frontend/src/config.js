// config.js
const API_BASE_URL = 'http://localhost:5000/api';

export const endpoints = {
  fetchHotels: `${API_BASE_URL}/hotels`,
  fetchHotelById: (hotelId) => `${API_BASE_URL}/hotels/${hotelId}`,
};
