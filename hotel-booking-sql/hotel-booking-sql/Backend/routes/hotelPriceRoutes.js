import express from 'express';
import hotelController from '../controllers/hotelController.js';

const router = express.Router();

router.get('/prices', hotelController.fetchHotelPrices);
router.get('/:id/prices', hotelController.fetchHotelPriceById);

export default router;