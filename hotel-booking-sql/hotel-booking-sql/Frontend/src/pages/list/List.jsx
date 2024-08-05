import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react';
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

const theme = createTheme({
  palette: {
    primary: {
      main: '#262e5d',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#262e5d',
          color: 'white',
          '&:hover': {
            backgroundColor: '#1f264b',
          },
        },
      },
    },
  },
});

const List = () => {
  const { searchParams } = useContext(SearchContext);
  const { setSearchParams } = useContext(SearchContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(location.state.data || []);
  const [destination, setDestination] = useState(searchParams.destination_id || '');
  const [checkIn, setCheckIn] = useState(searchParams.checkIn ? new Date(searchParams.checkIn) : null);
  const [checkOut, setCheckOut] = useState(searchParams.checkOut ? new Date(searchParams.checkOut) : null);
  const [adults, setAdults] = useState(searchParams.adults || 2); // Default to 2 adults
  const [children, setChildren] = useState(searchParams.children || 0); // Default to 0 children
  const [rooms, setRooms] = useState(searchParams.rooms || 1);
  const [errorMessage, setErrorMessage] = useState('');
  const [submit, setSubmit] = useState(false);
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [rating, setRating] = useState([0, 5]);
  const [polling, setPolling] = useState(false); // State to control polling
  const [isLoading, setIsLoading] = useState(false);

  const isValidDate = (date) => date instanceof Date && !isNaN(date);

  useEffect(() => {
    if (location.state && location.state.searchParams) {
      const { destination_id, checkin, checkout } = location.state.searchParams;
      setDestination(destination_id);
      setCheckIn(new Date(checkin));
      setCheckOut(new Date(checkout));
    }
  }, [location.state]);

  const uniqueDestinationsData = useMemo(() => {
    return Array.from(new Set(destinationsData.map(a => a.uid)))
      .map(uid => {
        return destinationsData.find(a => a.uid === uid);
      });
  }, []);

  const handleSearch = async (searchParams) => {
    try {
      setSubmit(true);
      const response = await axios.get('http://localhost:5000/api/hotels', {
        params: { ...searchParams }
      });
      setData(response.data.slice(0, 10));
      setSubmit(false);
      navigate("/hotels", { state: { data: response.data.slice(0, 40), searchParams } });
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setSubmit(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedDestination = uniqueDestinationsData.find(s => s.uid === destination);

    if (!selectedDestination || !checkIn || !checkOut) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const searchParams = {
      destination_id: selectedDestination.uid,
      checkIn,
      checkOut,
      adults,
      children,
      rooms
    };

    setSearchParams(searchParams);
    handleSearch(searchParams);
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
    const filteredData = data.filter(hotel => {
      return (
        hotel.rating >= rating[0] &&
        hotel.rating <= rating[1]
      );
    });
    setData(filteredData);
  };

  const fetchFilteredHotels = async () => {
    if (!isValidDate(checkIn) || !isValidDate(checkOut)) {
      console.error('Invalid check-in or check-out date');
      return;
    }

    try {
      const formattedCheckIn = format(checkIn, 'yyyy-MM-dd');
      const formattedCheckOut = format(checkOut, 'yyyy-MM-dd');

      const params = {
        destination_id: destination,
        checkin: formattedCheckIn,
        checkout: formattedCheckOut,
        guests: `${adults + children}`,
        rooms,
      };

      const requestUrl = `http://localhost:5000/api/hotel/prices?${new URLSearchParams(params).toString()}`;

      const response = await axios.get(requestUrl);

      if (response.data.completed) {
        setPolling(false); // Stop polling when completed
      } else {
        if (!polling) {
          setPolling(true);
          setTimeout(fetchFilteredHotels, 5000); // Poll every 5 seconds
        }
      }
    } catch (error) {
      console.error('Error fetching filtered hotels:', error);
      setPolling(false); // Stop polling on error
    }
  };

  useEffect(() => {
    fetchFilteredHotels();

    console.log(searchParams,"check");

  }, [rating, priceRange, checkIn, checkOut, adults, children, rooms]);

  const fetchAndMergePrices = async () => {
    setIsLoading(true);
    try {
      const formattedCheckIn = format(searchParams.checkIn, 'yyyy-MM-dd');
      const formattedCheckOut = format(searchParams.checkOut, 'yyyy-MM-dd');

      const response = await axios.get(`http://localhost:5000/hotels/prices`, {
        params: {
          destination_id: searchParams.destination_id,
          checkin: formattedCheckIn,
          checkout: formattedCheckOut,
          guests: searchParams.adults,
        },
      });

      // Assuming response.data is an array of hotels with price details
      const prices = response.data;

      // Merge prices with existing data
      const mergedData = data.map(hotel => {
        const priceData = prices.find(priceHotel => priceHotel.id === hotel.id);
        return priceData
          ? { ...hotel, price: priceData.max_cash_payment }
          : null; // Filter out hotels without a price
      }).filter(hotel => hotel !== null); // Filter out any null values

      const top10Hotels = mergedData.slice(0, 10); // Get the first 10 hotels

      setData(top10Hotels); // Update the data state with the top 10 hotels
    } catch (error) {
      console.error('Error fetching hotel prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Navbar style={{ position: "sticky" }} />
        <div className="listContainer">
          {/* <div className="listSearchBar">
            <div className="headerSearch">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                    options={uniqueDestinationsData}
                    getOptionLabel={(option) => option.term || option.type || 'Unknown'}
                    filterOptions={(options, state) =>
                      options.filter(option => option.term && option.term.toLowerCase().startsWith(state.inputValue.toLowerCase()))
                    }
                    value={uniqueDestinationsData.find(option => option.uid === destination) || null}
                    onChange={debouncedHandleChange}
                    renderInput={(params) => <TextField {...params} label="Destination/Hotel Name" variant="outlined" />}
                    renderOption={(props, option) => {
                      const uniqueKey = `${option.uid}-${option.term}`;
                      return (
                        <li {...props} key={uniqueKey}>
                          {option.term}
                        </li>
                      );
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Check-in"
                      value={checkIn}
                      onChange={(newValue) => {
                        setCheckIn(newValue);
                        if (checkOut && newValue >= checkOut) {
                          setCheckOut(null);
                        }
                      }}
                      minDate={new Date()}
                      disablePast
                      renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Check-out"
                      value={checkOut}
                      onChange={(newValue) => setCheckOut(newValue)}
                      minDate={checkIn ? new Date(checkIn.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                      disablePast
                      renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <RoomsAndGuests
                    rooms={rooms}
                    setRooms={setRooms}
                    adults={adults}
                    setAdults={setAdults}
                    children={children}
                    setChildren={setChildren}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={submit}
                  >
                    {submit ? "Searching..." : "Search"}
                  </Button>
                </Grid>
              </Grid>
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
            </div>
          </div> */}
          <div className="listWrapper">
            <div className="hotelFilterWrapper">
              <div className="filterSection">
                <h2>Filters</h2>
                <div className="filterGroup">
                  <label>Rating</label>
                  <Slider range min={0} max={5} defaultValue={rating} onChange={(value) => setRating(value)} />
                  <span>{`Rating: ${rating[0]} - ${rating[1]}`}</span>
                </div>
                <button className="show-prices-button" onClick={fetchAndMergePrices} variant="contained" color="primary" disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : 'Show Hotels with Prices'}
                </button>
                <button className="filterButton" onClick={handleApplyFilters}>Apply Filters</button>
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
    </ThemeProvider>
  );
};

const RoomsAndGuests = ({ rooms, setRooms, adults, setAdults, children, setChildren }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleOption = (field, action) => {
    if (field === "rooms") {
      if (action === "i") setRooms(rooms + 1);
      else if (action === "d" && rooms > 1) setRooms(rooms - 1);
    } else if (field === "adults") {
      if (action === "i") setAdults(adults + 1);
      else if (action === "d" && adults > 1) setAdults(adults - 1);
    } else if (field === "children") {
      if (action === "i") setChildren(children + 1);
      else if (action === "d" && children > 0) setChildren(children - 1);
    }
  };

  return (
    <div>
      <TextField
        aria-describedby={id}
        value={`${rooms} room, ${adults} adults, ${children} children`}
        variant="outlined"
        fullWidth
        onClick={handleClick}
        InputProps={{
          readOnly: true,
        }}
      />
      <Popper id={id} open={open} anchorEl={anchorEl} style={{ width: "300px", zIndex: 3 }}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={4} className="field-label">
                Rooms
              </Grid>
              <Grid item xs={8} className="field-buttons">
                <IconButton onClick={() => handleOption("rooms", "d")} disabled={rooms <= 1} size="small">
                  <RemoveIcon />
                </IconButton>
                <Box style={{ margin: "0 50px" }}>{rooms}</Box>
                <IconButton onClick={() => handleOption("rooms", "i")} size="small">
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item xs={4} className="field-label">
                Adults
              </Grid>
              <Grid item xs={8} className="field-buttons">
                <IconButton onClick={() => handleOption("adults", "d")} disabled={adults <= 1} size="small">
                  <RemoveIcon />
                </IconButton>
                <Box style={{ margin: "0 50px" }}>{adults}</Box>
                <IconButton onClick={() => handleOption("adults", "i")} size="small">
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item xs={4} className="field-label">
                Children
              </Grid>
              <Grid item xs={8} className="field-buttons">
                <IconButton onClick={() => handleOption("children", "d")} disabled={children <= 0} size="small">
                  <RemoveIcon />
                </IconButton>
                <Box style={{ margin: "0 50px" }}>{children}</Box>
                <IconButton onClick={() => handleOption("children", "i")} size="small">
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button fullWidth variant="contained" style={{ backgroundColor: "white", color: "#262e5d", border: "2px solid #262e5d", height: "53px", fontWeight: "650" }} onClick={handleClose}>Done</Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default List;