import express from 'express';
import cron from 'node-cron';
import corsMiddleware from './middlewares/corsMiddleware.js';
import bookingsRouter from './routes/bookings.js';
import hotelRoutes from './routes/hotelRoutes.js';
import hotelPriceRoutes from './routes/hotelPriceRoutes.js';
import db from './db/db.js'; // Ensure the database connection is initialized

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle CORS and JSON requests
app.use(corsMiddleware);
app.use(express.json()); // Replacing body-parser with express's built-in middleware

// Routes
app.use('/api/bookings', bookingsRouter);
app.use('/hotels', hotelPriceRoutes);
app.use('/api/hotels', hotelRoutes);

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
