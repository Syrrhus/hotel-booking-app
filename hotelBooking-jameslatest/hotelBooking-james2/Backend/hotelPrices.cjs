const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/hotel-prices', async (req, res) => {
    const { destination_id, checkin, checkout, guests } = req.query;

    // Log the received parameters
    console.log('Received request for hotel prices with params:', { destination_id, checkin, checkout, guests });

    try {
        const response = await axios.get('https://hotelapi.loyalty.dev/api/hotels/prices', {
            params: {
                destination_id,
                checkin,
                checkout,
                lang: 'en_US',
                currency: 'SGD',
                country_code: 'SG',
                guests,
                partner_id: 1
            }
        });

        // Log the response data
        console.log('API Response:', response.data);

        res.json(response.data);
    } catch (error) {
        console.error("Error occurred while fetching hotel prices:", error);

        if (error.response) {
            console.error("Error data:", error.response.data);
            console.error("Error status:", error.response.status);
            console.error("Error headers:", error.response.headers);
        } else if (error.request) {
            console.error("Error request:", error.request);
        } else {
            console.error('Error message:', error.message);
        }

        res.status(error.response?.status || 500).json({
            message: 'Failed to fetch hotel prices',
            error: error.response?.data || error.message
        });
    }
});

module.exports = router;
