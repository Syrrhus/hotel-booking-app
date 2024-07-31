
// server.js or your backend file
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const hotelPricesRouter = require('./hotelPrices.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Endpoint to fetch data from external API
app.get('/api/hotels', async (req, res) => {
  const destinationId = req.query.destination_id;
  const apiUrl = `https://hotelapi.loyalty.dev/api/hotels?destination_id=${destinationId}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/hotels/:id', async (req, res) => {
  const hotelId = req.params.id;
  const apiUrl = `https://hotelapi.loyalty.dev/api/hotels/${hotelId}`;

  try {
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching hotel details: ${error.message}`);
    res.status(500).json({ message: 'Error fetching hotel details' });
  }
});




// Endpoint for hotel prices - previously in hotelPrices.cjs
app.get('/api/hotel-prices', async (req, res) => {
  const { destination_id, checkin, checkout, guests } = req.query;

  console.log('Received request for hotel prices with params:', { destination_id, checkin, checkout, guests });

  if (!destination_id || !checkin || !checkout || !guests) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

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

    res.json(response.data);
  } catch (error) {
    console.error("Error occurred while fetching hotel prices:", error);

    if (error.response) {
      res.status(error.response.status).json({
        message: 'Failed to fetch hotel prices',
        error: error.response.data || error.message
      });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
