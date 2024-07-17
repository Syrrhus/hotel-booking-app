// Change all require statements to import
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import cron from 'node-cron';
import { exec } from 'child_process';

const app = express();
const PORT = process.env.PORT || 5000;

// netstat -ano | findstr :5000
// taskkill /PID 25008 /F

app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Example endpoint, adjust accordingly
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

// Cron job, ensure this logic is required
cron.schedule('*/10 * * * * *', () => {
    console.log('Restarting server...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});