import axios from 'axios';

const fetchHotels = async (req, res) => {
    const destinationId = req.query.destination_id;
    const apiUrl = `https://hotelapi.loyalty.dev/api/hotels?destination_id=${destinationId}`;

    try {
        const response = await axios.get(apiUrl);
        res.status(200).res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

const fetchHotelDetails = async (req, res) => {
    const hotelId = req.params.id;
    const apiUrl = `https://hotelapi.loyalty.dev/api/hotels/${hotelId}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error(`Error fetching hotel details: ${error.message}`);
        res.status(500).json({ message: 'Error fetching hotel details' });
    }
};

const fetchHotelPrices = async (req, res) => {
    const { destination_id, checkin, checkout, guests } = req.query;
        
    if (!destination_id || !checkin || !checkout || !guests) {
    return res.status(400).json({ error: 'Missing required query parameters' });
    }
    
    try {
    const response = await axios.get(`https://hotelapi.loyalty.dev/api/hotels/prices`, {
    params: {
    destination_id: destination_id,
    checkin: checkin,
    checkout: checkout,
    lang: 'en_US',
    currency: 'SGD',
    partner_id: '1',
    country_code: 'SG',
    guests: guests
    }
    });
    
    const hotels = response.data.hotels;
    hotels.forEach(hotel => {
    console.log(hotel.price,"new data");
   });
    
    
    // The API request was successful
    // if (response.data.completed && response.data.rooms.length === 0) {
    // // No rooms available
    // res.status(200).json({ message: 'No rooms available for the specified criteria', data: response.data });
    // } else {
    // // Rooms are available
    res.status(200).json(response.data.hotels);
    // }
    } catch (error) {
    console.error('Error fetching hotel price:', error.message);
    if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
    } else if (error.request) {
    console.error('Request details:', error.request);
    }
    res.status(500).json({ error: 'An error occurred while fetching hotel price', details: error.response ? error.response.data : null });
    }
};

const fetchHotelPriceById = async (req, res) => {
    const { id } = req.params;
    const { destination_id, checkin, checkout, guests } = req.query;
  
    if (!destination_id || !checkin || !checkout || !guests) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }
  
    try {
      const response = await axios.get(`https://hotelapi.loyalty.dev/api/hotels/${id}/price`, {
        params: {
          destination_id: destination_id,
          checkin: checkin,
          checkout: checkout,
          lang: 'en_US',
          currency: 'SGD',
          partner_id: '1',
          country_code: 'SG',
          guests: guests
        }
      });
      console.log(response.data);
  
      // The API request was successful
      if (response.data.completed && response.data.rooms.length === 0) {
        // No rooms available
        res.status(200).json({ message: 'No rooms available for the specified criteria', data: response.data });
      } else {
        // Rooms are available
        res.status(200).json(response.data);
      }
    } catch (error) {
      console.error('Error fetching hotel price:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request details:', error.request);
      }
      res.status(500).json({ error: 'An error occurred while fetching hotel price', details: error.response ? error.response.data : null });
    }
};

export default {
    fetchHotels,
    fetchHotelDetails,
    fetchHotelPrices,
    fetchHotelPriceById
};
