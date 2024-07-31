import express from 'express';
import axios from 'axios';
import cors from 'cors';
import cron from 'node-cron';
import bodyParser from 'body-parser';
import bookingsRouter from './routes/bookings.js';
import db from './db/db.js'; // Ensure the database connection is initialized

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware to handle CORS and JSON requests
app.use(cors());
app.use(bodyParser.json());

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

// Add the bookings route
app.use('/api/bookings', bookingsRouter);


app.get('/api/hotel-prices', async (req, res) => {
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


    app.get('/api/hotels/:id/prices', async (req, res) => {
        const hotelId = req.params.id;
        const { destination_id, checkin, checkout, guests } = req.query;
    
        try {
            const response = await axios.get(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}/price`, {
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
            res.json(response.data.json);
            console.log(res.json(response.data.json),"hotel code");
            res.status(200).json(response.data);
            
        } catch (error) {
            console.error(`Error fetching hotel prices: ${error.message}`); 
            
            res.status(500).json({ error: 'An error occurred while fetching hotel price', details: error.response ? error.response.data : null });
            //res.status(500).json({ message: 'Failed to fetch hotel prices', error: error.message });
        }
    });

// Cron job to restart the server after 10 seconds (modify as needed)
cron.schedule('*/10 * * * * *', () => {
    console.log('Restarting server...');
    exec('kill -9 $(lsof -t -i:5000)', (err) => {
        if (err) {
            console.error('Error restarting server:', err);
        } else {
            process.exit();
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});