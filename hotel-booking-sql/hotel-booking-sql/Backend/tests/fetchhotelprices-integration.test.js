import hotelController from '../controllers/hotelController.js'; // Adjust the path as needed
import axios from 'axios';

jest.mock('axios'); // Mock axios to simulate API calls

describe('hotelController API Integration Tests', () => {
    let req;
    let res;

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
        jest.clearAllMocks(); // Clear mocks after each test to avoid interference
    });

    describe('fetchHotelPrices', () => {
        it('should fetch hotel prices successfully from the real API', async () => {
            req.query = {
                destination_id: '1',
                checkin: '2024-08-15',
                checkout: '2024-08-20',
                guests: '2',
            };

            // Mock the axios response to simulate a successful API call
            axios.get.mockResolvedValue({
                data: {
                    hotels: [
                        { id: 1, name: 'Hotel One', price: 100 },
                        { id: 2, name: 'Hotel Two', price: 200 },
                    ],
                },
            });

            await hotelController.fetchHotelPrices(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([
                { id: 1, name: 'Hotel One', price: 100 },
                { id: 2, name: 'Hotel Two', price: 200 },
            ]);
        });

        it('should return 400 if required query parameters are missing', async () => {
            req.query = {
                destination_id: '1',
                checkin: '2024-08-15',
                // Missing checkout and guests
            };

            await hotelController.fetchHotelPrices(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing required query parameters' });
        });

        it('should handle API errors gracefully', async () => {
            req.query = {
                destination_id: '1',
                checkin: '2024-08-15',
                checkout: '2024-08-20',
                guests: '2',
            };

            // Mock the axios response to simulate an API failure
            axios.get.mockRejectedValue({
                response: {
                    data: { message: 'Internal Server Error' },
                    status: 500,
                },
            });

            await hotelController.fetchHotelPrices(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'An error occurred while fetching hotel price',
                details: { message: 'Internal Server Error' },
            });
        });
    });
});
