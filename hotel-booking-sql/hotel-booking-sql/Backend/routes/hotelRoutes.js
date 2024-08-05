import express from 'express';
import hotelController from '../controllers/hotelController.js';

const router = express.Router();

router.get('/', hotelController.fetchHotels);
router.get('/:id', hotelController.fetchHotelDetails);


export default router;


