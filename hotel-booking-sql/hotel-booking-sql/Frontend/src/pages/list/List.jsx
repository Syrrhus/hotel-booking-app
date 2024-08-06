import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import SearchItem from '../../components/searchItem/SearchItem';
import './list.css';
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SearchContext } from '../../context/SearchContext';
import { format } from 'date-fns';

const theme = createTheme({
  palette: {
    primary: {
      main: '#262e5d',
    },
  },
});

const List = () => {
  const { searchParams } = useContext(SearchContext);
  const { setSearchParams } = useContext(SearchContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(location.state.data || []);
  const [showhotelprices, setHotelPrices] = useState(null);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [priceRange, setPriceRange] = useState([50, 5000]);
  const [rating, setRating] = useState([0, 5]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = 5;

  useEffect(() => {
    if (location.state && location.state.searchParams) {
      const { destination_id, checkin, checkout } = location.state.searchParams;
      fetchAndMergePrices(destination_id, checkin, checkout);
    }
  }, [location.state]);


  useEffect(() => {
    if (searchParams.PriceDetails && Object.keys(searchParams.PriceDetails).length > 0) {
      const hotelsWithPrices = Object.values(searchParams.PriceDetails);
      setFilteredHotels(hotelsWithPrices);
      setRetryCount(0); // Reset retry count when data is successfully fetched
    } else if (retryCount < maxRetries) {
      // Retry fetching data if it's not yet available
      const { destination_id, checkin, checkout } = location.state.searchParams;
      setRetryCount(retryCount + 1);
      fetchAndMergePrices(destination_id, checkin, checkout);
    }
  }, [searchParams.PriceDetails, retryCount]);


  const fetchAndMergePrices = async (destination_id, checkin, checkout) => {
    setIsLoading(true);
    try {
      const formattedCheckIn = format(new Date(checkin), 'yyyy-MM-dd');
      const formattedCheckOut = format(new Date(checkout), 'yyyy-MM-dd');

      const response = await axios.get(`http://localhost:5000/hotels/prices`, {
        params: {
          destination_id: destination_id,
          checkin: formattedCheckIn,
          checkout: formattedCheckOut,
          guests: searchParams.adults,
        },
      });
      console.log("price api fetched")

      const prices = response.data;

 console.log("merging starting")
      const mergedData = data.map(hotel => {
        const priceData = prices.find(priceHotel => priceHotel.id === hotel.id);
        if (priceData) {
          return {
            ...hotel,
            price: priceData.price,
          };
        } else {
          return hotel;
        }
      });

      setData(mergedData);

      setSearchParams(prev => ({
        ...prev,
        PriceDetails: mergedData.reduce((acc, hotel) => {
          if (hotel.price) {
            acc[hotel.id] = hotel;
          }
          return acc;
        }, {}),
      }));

      console.log("search param set with Price details")

      setIsLoading(false);
      setLoadingButton(true);
    } catch (error) {
      console.error('Error fetching hotel prices:', error);
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    // Reset showhotelprices before applying filters
    setHotelPrices(null);

    const filtered = filteredHotels.filter(hotel => 
      (hotel.price !== null && hotel.price !== undefined && hotel.price >= priceRange[0] && hotel.price <= priceRange[1]) &&
      (hotel.rating !== null && hotel.rating !== undefined && hotel.rating >= rating[0] && hotel.rating <= rating[1])
    );

    setHotelPrices(filtered);
    setHasUpdated(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Navbar style={{ position: "sticky" }} />
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
                  <label>Price Range</label>
                  <Slider 
                    range 
                    min={0} 
                    max={5000} 
                    defaultValue={priceRange} 
                    onChange={(value) => setPriceRange(value)} 
                  />
                  <span>{`Price: $${priceRange[0]} - $${priceRange[1]}`}</span>
                </div>
                
                {isLoading && <p>Loading...</p>}
                <button className="filterButton" onClick={applyFilters}>Apply Filters</button>
                {hasUpdated && <p>Filter Applied!</p>}
              </div>
            </div>
            <div className="listResult">
              {showhotelprices ? (
                showhotelprices.map((hotel, index) => (
                  <SearchItem key={index} hotel={hotel} />
                ))
              ) : (
                Array.isArray(filteredHotels) && filteredHotels.length > 0 && loadingButton
                  ? filteredHotels.map((hotel, index) => (
                      <SearchItem key={index} hotel={hotel} />
                    ))
                  : data.map((hotel, index) => (
                      <SearchItem key={index} hotel={hotel} />
                    ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default List;
