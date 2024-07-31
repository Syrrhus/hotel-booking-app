import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import SearchItem from '../../components/searchItem/SearchItem';
import './list.css';
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Autocomplete, Button, TextField, Grid, Paper, ClickAwayListener, IconButton, Box, Popper } from '@mui/material';
import { debounce } from 'lodash';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import destinationsData from '../../components/header/destinations.json';
import hotelPriceData from './hoteldata.json';

const theme = createTheme({
  palette: {
    primary: {
      main: '#262e5d',
    },
  },
});

const List = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(location.state?.data || []);
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [submit, setSubmit] = useState(false);
  const [priceRange, setPriceRange] = useState([50, 1000]);
  const [rating, setRating] = useState([0, 5]);

  const mergeHotelData = (apiData, priceData) => {
    console.log('Merging hotel data...');
    console.log('API Data:', JSON.stringify(apiData, null, 2));
    console.log('Price Data:', JSON.stringify(priceData, null, 2));
  
    return apiData.map(hotel => {
      const priceInfo = priceData.hotels.find(h => h.id === hotel.id);
      if (!priceInfo) {
        console.log(`No price info found for hotel with ID: ${hotel.id}`);
      } else {
        console.log(`Found price info for hotel with ID: ${hotel.id}`);
      }
      return {
        ...hotel,
        priceInfo: priceInfo || {}
      };
    });
  };


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
    console.log('s')
    try {
      setSubmit(true);
      const response = await axios.get('http://localhost:5000/api/hotels', {
        params: {
          ...searchParams
        }
      });
      console.log('API Response:', JSON.stringify(response.data, null, 2));
      console.log('Hotel Price Data:', JSON.stringify(hotelPriceData, null, 2));
  
      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        const mergedData = mergeHotelData(response.data, hotelPriceData);
        console.log('Merged Data:', JSON.stringify(mergedData, null, 2));
        setData(mergedData);
        navigate("/hotels", { state: { data: mergedData, searchParams } });
      } else {
        console.error('API response is not an array:', response.data);
        setData([]);
      }
      setSubmit(false);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setSubmit(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const selectedDestination = uniqueDestinationsData.find(s => s.uid === destination);
    if (!selectedDestination) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (selectedDestination && checkIn && checkOut) {
      const searchParams = {
        destination_id: selectedDestination.uid,
        checkin: checkIn.toISOString().split('T')[0],
        checkout: checkOut.toISOString().split('T')[0],
        guests: adults + children,
        rooms
      };
      handleSearch(searchParams);
    } else {
      setErrorMessage('Please fill in all required fields.');
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
    const filteredData = data.filter(hotel => {
      return (
        hotel.price >= priceRange[0] &&
        hotel.price <= priceRange[1] &&
        hotel.rating >= rating[0] &&
        hotel.rating <= rating[1]
      );
    });
    setData(filteredData);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Navbar style={{ position: "sticky" }} />
        <div className="listContainer">
          <div className="listSearchBar">
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
                        if (errorMessage) setErrorMessage('');
                      }}
                      renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Check-out"
                      value={checkOut}
                      onChange={(newValue) => {
                        setCheckOut(newValue);
                        if (errorMessage) setErrorMessage('');
                      }}
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
          </div>
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
                  <Slider range min={50} max={1000} defaultValue={priceRange} onChange={(value) => setPriceRange(value)} />
                  <span>{`Price: $${priceRange[0]} - $${priceRange[1]}`}</span>
                </div>
                <button className="filterButton" onClick={handleApplyFilters}>Apply Filters</button>
              </div>
            </div>
            <div className="listResult">
              {data.length > 0 ? (
                data.map((hotel, index) => (
                  <SearchItem key={hotel.id || index} hotel={hotel} />
                ))
              ) : (
                <div>No hotels found with the selected filters.</div>
              )}
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
      <Popper id={id} open={open} anchorEl={anchorEl} style={{ width: "400px", zIndex: 3 }}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                Rooms
              </Grid>
              <Grid item xs={6} container justifyContent="space-between">
                <IconButton onClick={() => handleOption("rooms", "d")} disabled={rooms <= 1}>
                  <RemoveIcon style={{ border: rooms !== 1 ? "2px solid #262e5d" : "2px solid #d6d6d6", borderRadius: "50%" }} />
                </IconButton>
                <Box style={{ marginTop: "8px" }}>{rooms}</Box>
                <IconButton onClick={() => handleOption("rooms", "i")}>
                  <AddIcon style={{ border: "2px solid #262e5d", borderRadius: "50%" }} />
                </IconButton>
              </Grid>
              <Grid item xs={6}>
                Adults
              </Grid>
              <Grid item xs={6} container justifyContent="space-between">
                <IconButton onClick={() => handleOption("adults", "d")} disabled={adults <= 1}>
                  <RemoveIcon style={{ border: adults !== 1 ? "2px solid #262e5d" : "2px solid #d6d6d6", borderRadius: "50%" }} />
                </IconButton>
                <Box style={{ marginTop: "8px" }}>{adults}</Box>
                <IconButton onClick={() => handleOption("adults", "i")}>
                  <AddIcon style={{ border: "2px solid #262e5d", borderRadius: "50%" }} />
                </IconButton>
              </Grid>
              <Grid item xs={6}>
                Children
              </Grid>
              <Grid item xs={6} container justifyContent="space-between">
                <IconButton onClick={() => handleOption("children", "d")} disabled={children <= 0}>
                  <RemoveIcon style={{ border: children !== 0 ? "2px solid #262e5d" : "2px solid #d6d6d6", borderRadius: "50%" }} />
                </IconButton>
                <Box style={{ marginTop: "8px" }}>{children}</Box>
                <IconButton onClick={() => handleOption("children", "i")}>
                  <AddIcon style={{ border: "2px solid #262e5d", borderRadius: "50%" }} />
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