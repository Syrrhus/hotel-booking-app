import React, { useState, useMemo, useCallback, useEffect,useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import SearchItem from '../../components/searchItem/SearchItem';
import './list.css';
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Autocomplete, Button, TextField, Grid, Paper, ClickAwayListener, IconButton, Box, Popper, CircularProgress } from '@mui/material';
import { debounce } from 'lodash';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import destinationsData from '../../components/header/destinations.json';
import { SearchContext } from '../../context/SearchContext'; // Adjust path accordingly
import { format } from 'date-fns';
import { parseISO } from 'date-fns';


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
  const [destination, setDestination] = useState(searchParams.destination_id);
  const [filterdataID, setfilterdataID] = useState(location.state.data || []);
  //const { destination_id, checkin, checkout } = location.state.searchParams;
  const [checkIn, setCheckIn] = useState(new Date(location.state.searchParams.checkin));
  const [checkOut, setCheckOut] = useState(new Date(location.state.checkout));
  const [adults, setAdults] = useState(2); // Default to 2 adults
  const [children, setChildren] = useState(0); // Default to 0 children
  const [rooms, setRooms] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [submit, setSubmit] = useState(false);
  const [priceRange, setPriceRange] = useState([50, 5000]);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [rating, setRating] = useState([0, 5]);
  const [polling, setPolling] = useState(false); // State to control polling
  const [hotelsWithPrices, setHotelsWithPrices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [loadingButton, setloadingButton] = useState(false);

  const isValidDate = (date) => date instanceof Date && !isNaN(date);

  useEffect(() => {
    if (location.state && location.state.searchParams) {
      const { destination_id, checkin, checkout } = location.state.searchParams;
      setDestination(destination_id);
      console.log(new Date(checkin),"new date")
      setCheckIn(new Date(checkin));
      setCheckOut(new Date(checkout));
    }
  }, [location.state]);

  const [filteredHotels, setFilteredHotels] = useState([]);

  useEffect(() => {
    const showItemsWithPrices = () => {
      const hotelsWithPrices = Object.values(searchParams.PriceDetails || {});
      console.log(searchParams.PriceDetails, "price details");
      setFilteredHotels(hotelsWithPrices);
    };

    // Automatically display hotels with prices when PriceDetails is updated
    if (searchParams.PriceDetails && Object.keys(searchParams.PriceDetails).length > 0) {
      showItemsWithPrices();
      setloadingButton(true); // Assuming you want to trigger this when data is available
    }
  }, [searchParams.PriceDetails]); // Re-run when PriceDetails changes

  
  
  const uniqueDestinationsData = useMemo(() => {
    return Array.from(new Set(destinationsData.map(a => a.uid)))
      .map(uid => {
        return destinationsData.find(a => a.uid === uid);
      });
  }, [searchParams]);

  const handleSearch = async (searchParams) => {
    try {
      setSubmit(true);
      const response = await axios.get('http://localhost:5000/api/hotels', {
        params: {
          ...searchParams
        }
      });

      if (!response.data || response.data.length === 0) {
        setErrorMessage('No hotels found for the given search criteria.');
        setSubmit(false);
        return;
      }

      setData(response.data.slice(0, 10));
      setSubmit(false);
      navigate("/hotels", { state: { data: response.data.slice(0, 40), searchParams } });
    } catch (error) { 
      console.error('Error fetching hotels:', error);
      setErrorMessage('An error occurred while fetching hotel data. Please try again later.');
      setSubmit(false);
    }
};


  const handleSubmit = (event) => {
    event.preventDefault();

    const selectedDestination = uniqueDestinationsData.find(s => s.uid === destination);
    console.log(selectedDestination, "Selected Destination");

    if (!selectedDestination || !isValidDate(checkIn) || !isValidDate(checkOut)) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    try {
      const searchParams = {
        destination_id: selectedDestination.uid,
        checkin: checkIn.toISOString().split('T')[0],
        checkout: checkOut.toISOString().split('T')[0],
        guests: adults + children,
        rooms
      };
      setSearchParams(searchParams);
      handleSearch(searchParams);
    } catch (error) {
      console.error('Error formatting dates:', error);
      setErrorMessage('An error occurred while processing your request. Please try again.');
    }
};

  const debouncedHandleChange = useCallback(
    debounce((event, newValue) => {
      setDestination(newValue ? newValue.uid : '');
      if (errorMessage) {
        setErrorMessage('');
      }
    }, 300),
    [errorMessage]
  );

  const handleApplyFilters = () => {
    setHasUpdated(false);
    const filtered = data.filter(hotel => 
      (hotel.price !== null && hotel.price !== undefined) &&
      hotel.price >= priceRange[0] && 
      hotel.price <= priceRange[1] && 
      hotel.rating >= rating[0] && 
      hotel.rating <= rating[1]
    );
    setData(filtered);
    setHasUpdated(true);
  };

  const fetchFilteredHotels = useCallback(
    debounce(async () => {
      if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
        console.log(checkIn,"checkin")
        console.error('Invalid check-in or check-out date');
        return;
      }

      try {
        const formattedCheckIn = format(checkIn, 'yyyy-MM-dd');
        const formattedCheckOut = format(checkOut, 'yyyy-MM-dd');
        console.log(formattedCheckIn,"formattedcheicunu")

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

        const requestUrl = `http://localhost:5000/api/hotel/prices?${new URLSearchParams(params).toString()}`;
        const response = await axios.get(requestUrl);

        if (response.data.completed) {
          const filteredHotels = response.data;
          console.log(filteredHotels, "filteredhotels");
    

          
          setPolling(false); // Stop polling when completed
        } else {
          if (!polling) {
            setPolling(true);
            setTimeout(fetchFilteredHotels, 5000); // Poll every 5 seconds
          }
        }
      } catch (error) {
        console.error('Error fetching filtered hotels:', error);
        setPolling(false);
      }
    }));


  useEffect(() => {
      fetchFilteredHotels();
    }, [ratingRange, priceRange, checkIn, checkOut, adults, children, rooms]);

  const fetchAndMergePrices = useCallback(async () => {
    if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
      console.error('Invalid check-in or check-out date');
      return;
    }

    setIsLoading(true);
    try {
      const formattedCheckIn = format(checkIn, 'yyyy-MM-dd');
      const formattedCheckOut = format(checkOut, 'yyyy-MM-dd');

      const response = await axios.get(`http://localhost:5000/hotels/prices`, {
        params: {
          destination_id: searchParams.destination_id,
          checkin: formattedCheckIn,
          checkout: formattedCheckOut,
          guests: searchParams.adults,
        },
      });

        const prices = response.data;

        const mergedData = data.map(hotel => {
        const priceData = prices.find(priceHotel => priceHotel.id === hotel.id);
        return priceData ? 
        { ...hotel, price: priceData.max_cash_payment } : 
        null
      }).filter(hotel => hotel !== null);

      setData(mergedData.slice(0, 10)); // Show only top 10 hotels
    } catch (error) {
      console.error('Error fetching hotel prices:', error);
    } finally {
      setIsLoading(false);
    }
  }, [data, searchParams, checkIn, checkOut]);

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
                {/* Added circular progress */}
                <button className="show-prices-button" onClick={fetchAndMergePrices} variant="contained" color="primary" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : 'Show Hotels with Prices'}
                </button>
                <button className="filterButton" onClick={handleApplyFilters}>Apply Filters</button>
                {hasUpdated && <p>Filter Applied!</p>}

              </div>
            </div>
            <div className="listResult">
            {Array.isArray(filteredHotels) && filteredHotels.length > 4 && loadingButton
  ? filteredHotels.map((hotel, index) => (
      <SearchItem key={index} hotel={hotel} />
    ))
  : data.map((hotel, index) => (
      <SearchItem key={index} hotel={hotel} />
    ))}


            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default List;
