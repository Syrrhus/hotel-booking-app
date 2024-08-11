import hotelController from '../controllers/hotelController.js';


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

    describe('fetchHotels', () => {
        it('should fetch hotels successfully from the real API', async () => {
            const destinationId = '123'; // Use a real destination ID or a known test ID
            req.query.destination_id = destinationId;

            // Call the actual fetchHotels function
            await hotelController.fetchHotels(req, res);

            // Verify that the status 200 was set and json response was called
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object)); // Verify response data structure
        });

        it('should handle real API errors gracefully', async () => {
            const invalidDestinationId = 'invalid-id'; // Use a destination ID that will cause the API to fail
            req.query.destination_id = invalidDestinationId;

            // Call the actual fetchHotels function
            await hotelController.fetchHotels(req, res);

            // Verify that the status 500 was set and the error message was returned
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch data' });
        });
    });
});
