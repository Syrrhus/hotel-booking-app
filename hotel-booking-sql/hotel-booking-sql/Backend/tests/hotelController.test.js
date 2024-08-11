import hotelController from '../controllers/hotelController.js'; // Import your controller
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Step 1: Create a Mock for Axios
const mockAxios = new MockAdapter(axios);

describe('hotelController API Tests', () => {
  let req;
  let res;

  // Set up mock request and response objects for Express
  beforeEach(() => {
    req = {
      query: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    mockAxios.reset(); // Reset axios mocks after each test
  });

  // Test for fetchHotels
  describe('fetchHotels', () => {
    it('should fetch hotels successfully', async () => {
      const destinationId = '123';
      req.query.destination_id = destinationId;

      const mockData = { hotels: [{ id: 1, name: 'Hotel One' }, { id: 2, name: 'Hotel Two' }] };

      // Step 2: Mock Axios response for hotels
      mockAxios.onGet(`https://hotelapi.loyalty.dev/api/hotels?destination_id=${destinationId}`).reply(200, mockData);

      await hotelController.fetchHotels(req, res);

      // Verify results
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle API errors gracefully', async () => {
      const destinationId = '123';
      req.query.destination_id = destinationId;

      // Mock a failure response from Axios
      mockAxios.onGet(`https://hotelapi.loyalty.dev/api/hotels?destination_id=${destinationId}`).reply(500);

      await hotelController.fetchHotels(req, res);

      // Verify error handling
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch data' });
    });
  });

  // Test for fetchHotelDetails
  describe('fetchHotelDetails', () => {
    it('should fetch hotel details successfully', async () => {
      const hotelId = '1';
      req.params.id = hotelId;

      const mockData = { id: 1, name: 'Hotel One', details: 'Details about Hotel One' };

      // Mock Axios response for hotel details
      mockAxios.onGet(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}`).reply(200, mockData);

      await hotelController.fetchHotelDetails(req, res);

      // Verify results
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should handle errors when fetching hotel details', async () => {
      const hotelId = '1';
      req.params.id = hotelId;

      // Mock a failure response from Axios
      mockAxios.onGet(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}`).reply(500);

      await hotelController.fetchHotelDetails(req, res);

      // Verify error handling
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching hotel details' });
    });
  });

  // Test for fetchHotelPrices
  describe('fetchHotelPrices', () => {
    it('should fetch hotel prices successfully', async () => {
      req.query = {
        destination_id: '123',
        checkin: '2024-08-10',
        checkout: '2024-08-13',
        guests: '2',
      };

      const mockData = { hotels: [{ id: 1, price: 100 }, { id: 2, price: 200 }] };

      // Mock Axios response for hotel prices
      mockAxios.onGet(`https://hotelapi.loyalty.dev/api/hotels/prices`).reply(200, mockData);

      await hotelController.fetchHotelPrices(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData.hotels);
    });

    it('should return 400 for missing query parameters', async () => {
      req.query = {
        destination_id: '123',
        checkin: '2024-08-10',
        // Missing checkout and guests
      };

      await hotelController.fetchHotelPrices(req, res);

      // Verify parameter validation
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required query parameters' });
    });

    it('should handle errors when fetching hotel prices', async () => {
      req.query = {
        destination_id: '123',
        checkin: '2024-08-10',
        checkout: '2024-08-13',
        guests: '2',
      };

      // Mock a failure response from Axios
      mockAxios.onGet(`https://hotelapi.loyalty.dev/api/hotels/prices`).reply(500);

      await hotelController.fetchHotelPrices(req, res);

      // Verify error handling
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occurred while fetching hotel price',
        details: undefined,
      });
    });
  });

  // Test for fetchHotelPriceById
  describe('fetchHotelPriceById', () => {
    it('should fetch hotel price by ID successfully', async () => {
      req.params.id = '1';
      req.query = {
        destination_id: '123',
        checkin: '2024-08-10',
        checkout: '2024-08-13',
        guests: '2',
      };

      const mockData = { completed: true, rooms: [{ id: 1, price: 150 }] };

      // Mock Axios response for specific hotel price by ID
      mockAxios.onGet(`https://hotelapi.loyalty.dev/api/hotels/1/price`).reply(200, mockData);

      await hotelController.fetchHotelPriceById(req, res);

      // Verify results
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it('should return 400 for missing query parameters', async () => {
      req.params.id = '1';
      req.query = {
        destination_id: '123',
        // Missing checkin, checkout, and guests
      };

      await hotelController.fetchHotelPriceById(req, res);

      // Verify parameter validation
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Missing required query parameters' });
    });

    it('should handle errors when fetching hotel price by ID', async () => {
      req.params.id = '1';
      req.query = {
        destination_id: '123',
        checkin: '2024-08-10',
        checkout: '2024-08-13',
        guests: '2',
      };

      // Mock a failure response from Axios
      mockAxios.onGet(`https://hotelapi.loyalty.dev/api/hotels/1/price`).reply(500);

      await hotelController.fetchHotelPriceById(req, res);

      // Verify error handling
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occurred while fetching hotel price',
        details: undefined,
      });
    });
  });
});
