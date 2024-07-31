import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import Navbar from '../../components/navbar/Navbar';
import SearchItem from '../../components/searchItem/SearchItem';
import './list.css';
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { endpoints } from '../../config'; // Make sure to update the import path if needed

const List = () => {
  const location = useLocation();

  const [data, setData] = useState(location.state.data || []);
  const [filterdataID, setfilterdataID] = useState(location.state.data || []);
  const [destination, setDestination] = useState(location.state.searchParams.destination_id || '');
  const [checkIn, setCheckIn] = useState(new Date(location.state.searchParams.checkin) || new Date());
  const [checkOut, setCheckOut] = useState(new Date(location.state.searchParams.checkout) || new Date());
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState({
    adult: location.state.searchParams.guests - location.state.searchParams.children || 1,
    children: location.state.searchParams.children || 0,
    room: location.state.searchParams.rooms || 1,
  });
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [polling, setPolling] = useState(false); // State to control polling

  const isValidDate = (date) => date instanceof Date && !isNaN(date);

  const fetchFilteredHotels = async () => {
    if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
      console.error('Invalid check-in or check-out date');
      return;
    }
  
    try {
      const formattedCheckIn = format(checkIn, 'yyyy-MM-dd');
      const formattedCheckOut = format(checkOut, 'yyyy-MM-dd');
      console.log(`Formatted Check-in Date: ${formattedCheckIn}`);
      console.log(`Formatted Check-out Date: ${formattedCheckOut}`);
      console.log(`Destination ID: ${destination}`);
      console.log(`Guests: ${adults + children}`);
  
      
  
      const params = {
        destination_id: destination,
        checkin: formattedCheckIn,
        checkout: formattedCheckOut,
        lang: 'en_US',
        currency: 'SGD',
        country_code: 'SG',
        guests: `${adults + children}`,
        partner_id: 1,
      };

      const requestUrl = `http://localhost:5000/api/hotel-prices?${new URLSearchParams(params).toString()}`;
      console.log('Request URL:', requestUrl);

      const response = await axios.get(requestUrl);
      console.log('API Response:', response.data);
  
      if (response.data.completed) {
        const filteredHotels = response.data;
        console.log(filteredHotels, "filteredhotels");
  
        //const hotelIDs = filteredHotels.map(hotel => hotel.id);
        //setfilterdataID(hotelIDs);
        //console.log(filterdataID, "dataID");
        
        setPolling(false); // Stop polling when completed
      } else {
        if (!polling) {
          setPolling(true);
          setTimeout(fetchFilteredHotels, 5000); // Poll every 5 seconds
        }
      }
    } catch (error) {
      console.error('Error fetching filtered hotels:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setPolling(false); // Stop polling on error
    }
  };
  

  useEffect(() => {
    fetchFilteredHotels();
  }, [ratingRange, priceRange, checkIn, checkOut, adults, children, rooms]);

  return (
    <div>
      <Navbar style={{ position: "sticky" }} />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="hotelFilterWrapper">
            <div className="filterSection">
              <h2>Filters</h2>
              <div className="filterGroup">
                <label>Rating</label>
                <Slider 
                  range 
                  min={0} 
                  max={5} 
                  defaultValue={ratingRange} 
                  onChange={(value) => setRatingRange(value)} 
                />
                <span>{`Rating: ${ratingRange[0]} - ${ratingRange[1]}`}</span>
              </div>
              <div className="filterGroup">
                <label>Price</label>
                <Slider 
                  range 
                  min={50} 
                  max={9000} 
                  defaultValue={priceRange} 
                  onChange={(value) => setPriceRange(value)} 
                />
                <span>{`Price: $${priceRange[0]} - $${priceRange[1]}`}</span>
              </div>
              <div className="filterGroup">
                <label>Check-in Date</label>
                <DatePicker selected={checkIn} onChange={(date) => setCheckIn(date)} />
              </div>
              <div className="filterGroup">
                <label>Check-out Date</label>
                <DatePicker selected={checkOut} onChange={(date) => setCheckOut(date)} />
              </div>
              <div className="filterGroup">
                <label>Adults</label>
                <input type="number" min="1" value={adults} onChange={(e) => setAdults(e.target.value)} />
              </div>
              <div className="filterGroup">
                <label>Children</label>
                <input type="number" min="0" value={children} onChange={(e) => setChildren(e.target.value)} />
              </div>
              <div className="filterGroup">
                <label>Rooms</label>
                <input type="number" min="1" value={rooms} onChange={(e) => setRooms(e.target.value)} />
              </div>
              <button className="filterButton" onClick={fetchFilteredHotels}>Apply Filters</button>
            </div>
          </div>
          <div className="listResult">
            {data.map((hotel, index) => (
              <SearchItem key={index} hotel={hotel} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;

