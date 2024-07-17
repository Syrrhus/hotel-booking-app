import React, { useState } from 'react';
import axios from 'axios';
import SearchForm from './SearchForm';
import HotelList from './HotelList';
import destinations from './destinations.json';
//passes handlesearch as a prop to searchform so that searchform can trigger hotel search
const App = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch hotel data based on the search parameters and then make api call to backend by api/hotels endpoint
 
  const handleSearch = async ({ destination_id, checkInDate, checkOutDate, guests, rooms }) => {

 
    //console.log('Search Params:', { destination_id, checkInDate, checkOutDate, guests, rooms }); 
    try {
      const response = await axios.get('/api/hotels', {
        params: {
          destination_id,
          checkin: checkInDate.toISOString().split('T')[0],
          checkout: checkOutDate.toISOString().split('T')[0],
          guests
        
        }
      });
      
      setHotels(response.data);
      
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };
  

// implement after clicking on hotel what all stuff to do 
  const handleSelectHotel = (hotelId) => {
    console.log('Selected hotel ID:', hotelId);
    // Redirect or show details of the selected hotel
  };

  return (
    <div>
      
      <SearchForm onSearch={handleSearch} destinations={destinations} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <HotelList hotels={hotels} onSelectHotel={handleSelectHotel} />
      )}
    </div>
  );
};

export default App;
