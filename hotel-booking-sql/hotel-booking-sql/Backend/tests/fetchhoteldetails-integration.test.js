import hotelController from '../controllers/hotelController.js';
import axios from 'axios';

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

    describe('fetchHotelDetails', () => {
        it('should fetch hotel details successfully from the real API', async () => {
            const hotelId = '1'; // Use a valid hotel ID for testing
            req.params.id = hotelId;

            await hotelController.fetchHotelDetails(req, res);

            expect(res.status).not.toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));
        });
    });
});
