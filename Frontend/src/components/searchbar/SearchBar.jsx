import React, { useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from "@fortawesome/free-solid-svg-icons";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Autocomplete, Button, TextField, Grid, Card, Popper, Paper, ClickAwayListener, IconButton, Box } from '@mui/material';
import { debounce } from 'lodash';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import "../../components/header/header.css";
import destinationsData from '../header/destinations.json'; 
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const SearchBar = ({type}) => {
  const [destination, setDestination] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [data, setData] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

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
        params: {
          ...searchParams
        }
      });
      setData(response.data.slice(0, 10));
      setShow(false);
      setSubmit(false);
      navigate("/hotels", { state: { data: response.data.slice(0, 10), searchParams } });
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setSubmit(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    

    const selectedDestination = uniqueDestinationsData.find(s => s.term === destination);
    if (!selectedDestination) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (selectedDestination && checkIn && checkOut) {
      const searchParams = {
        destination_id: selectedDestination.uid,
        checkin: checkIn,
        checkout: checkOut,
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
      setDestination(newValue ? newValue.term : '');
    }, 300),
    []
  );

  return (
    <div className="header">
      <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>
        {type !== "list" && (
          <>
            <div className="headerSearch">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <Autocomplete
                    options={uniqueDestinationsData}
                    getOptionLabel={(option) => option.term || option.type || 'Unknown'}
                    filterOptions={(options, state) =>
                      options.filter(option => option.term && option.term.toLowerCase().startsWith(state.inputValue.toLowerCase()))
                    }
                    freeSolo
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
                      onChange={(newValue) => setCheckIn(newValue)}
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
                  <Button variant="contained" style={{ backgroundColor: "white", color: "#264cc2", border: "2px solid #264cc2", height: "53px" }} fullWidth type="submit" onClick={handleSubmit}>
                    {submit ? (
                      <span>Fetching...</span>
                    ) : (
                      <span>Submit</span>
                    )}
                  </Button>
                </Grid>
              </Grid>
              {errorMessage && (
                <div style={{ color: "red", marginTop: "10px" }}>
                  {errorMessage}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// RoomsAndGuests component
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
      <Popper id={id} open={open} anchorEl={anchorEl} style={{ width: "400px" }}>
        <ClickAwayListener onClickAway={handleClose}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                Rooms
              </Grid>
              <Grid item xs={6} container justifyContent="space-between">
                <IconButton onClick={() => setRooms(rooms - 1)} disabled={rooms <= 1}>
                  <RemoveIcon style={{ border: rooms !== 1 ? "2px solid blue" : "2px solid #d6d6d6", borderRadius: "50%" }} />
                </IconButton>
                <Box style={{ marginTop: "8px" }}>{rooms}</Box>
                <IconButton onClick={() => setRooms(rooms + 1)}>
                  <AddIcon style={{ border: "2px solid blue", borderRadius: "50%" }} />
                </IconButton>
              </Grid>
              <Grid item xs={6}>
                Adults
              </Grid>
              <Grid item xs={6} container justifyContent="space-between">
                <IconButton onClick={() => setAdults(adults - 1)} disabled={adults <= 1}>
                  <RemoveIcon style={{ border: adults !== 1 ? "2px solid blue" : "2px solid #d6d6d6", borderRadius: "50%" }} />
                </IconButton>
                <Box style={{ marginTop: "8px" }}>{adults}</Box>
                <IconButton onClick={() => setAdults(adults + 1)}>
                  <AddIcon style={{ border: "2px solid blue", borderRadius: "50%" }} />
                </IconButton>
              </Grid>
              <Grid item xs={6}>
                Children
              </Grid>
              <Grid item xs={6} container justifyContent="space-between">
                <IconButton onClick={() => setChildren(children - 1)} disabled={children <= 0}>
                  <RemoveIcon style={{ border: children !== 1 ? "2px solid blue" : "2px solid #d6d6d6", borderRadius: "50%" }} />
                </IconButton>
                <Box style={{ marginTop: "8px" }}>{children}</Box>
                <IconButton onClick={() => setChildren(children + 1)}>
                  <AddIcon style={{ border: "2px solid blue", borderRadius: "50%" }} />
                </IconButton>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button fullWidth variant="contained" style={{ backgroundColor: "white", color: "#264cc2", border: "2px solid #264cc2", height: "53px" }} onClick={handleClose}>Done</Button>
            </Box>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </div>
  );
};

export default SearchBar;