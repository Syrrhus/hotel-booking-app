import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { DateRange } from 'react-date-range';
import Navbar from '../../components/navbar/Navbar';
import SearchItem from '../../components/searchItem/SearchItem';
import './list.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

//all  the hotels of one destination displayed here 
const List = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(location.state.data || []);
  const [destination, setDestination] = useState(location.state.searchParams.destination || '');
  const [checkIn, setCheckIn] = useState(location.state.searchParams.checkin || new Date());
  const [checkOut, setCheckOut] = useState(location.state.searchParams.checkout || new Date());
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState({
    adult: location.state.searchParams.guests - location.state.searchParams.children || 1,
    children: location.state.searchParams.children || 0,
    room: location.state.searchParams.rooms || 1,
  });
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [rating, setRating] = useState([0, 5]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  useEffect(() => {
    setData(data); // Set initial data from the JSON file
  }, []);

  const filterHotels = () => {
    const filteredHotels = data.filter(hotel => {
      return (
        hotel.rating >= rating[0] &&
        hotel.rating <= rating[1] &&
        hotel.price >= priceRange[0] &&
        hotel.price <= priceRange[1]
      );
    });
    setData(filteredHotels);
  };

  return (
    <div>
      <Navbar style={{position:"sticky"}} />
      <div className="listContainer">
        <div className="listWrapper">
        <div className="hotelFilterWrapper">
            <div className="filterSection">
              <h2>Filters</h2>
              <div className="filterGroup">
                <label>Rating</label>
                <Slider range min={0} max={5} defaultValue={rating} onChange={(value) => setRating(value)} />
                <span>{`Rating: ${rating[0]} - ${rating[1]}`}</span>
              </div>
              <div className="filterGroup">
                <label>Price</label>
                <Slider range min={50} max={500} defaultValue={priceRange} onChange={(value) => setPriceRange(value)} />
                <span>{`Price: $${priceRange[0]} - $${priceRange[1]}`}</span>
              </div>
              <div className="filterGroup">
                <label>Check-in Date</label>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
              </div>
              <div className="filterGroup">
                <label>Check-out Date</label>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
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
              <button className="filterButton" onClick={filterHotels}>Apply Filters</button>
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
