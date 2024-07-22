const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS middleware
const cron = require('node-cron');
const { exec } = require('child_process');
// backend that uses express.js to make api requests
const app = express();
const PORT = process.env.PORT || 5000;
//netstat -ano | findstr :5000
//taskkill /PID 25008 /F

// Allow all origins and methods
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



// Cron job to restart the server after 10 seconds
// cron.schedule('*/10 * * * * *', () => {
//     console.log('Restarting server...');
// });

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});