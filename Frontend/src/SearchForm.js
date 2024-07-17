import React, { useState, useMemo, useCallback } from 'react';
import { TextField, Autocomplete, Button, Box, Grid, IconButton, Popper, Paper, ClickAwayListener, Card } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import destinationsData from './destinations.json';  
import HotelList from './HotelList';
import axios from 'axios';
import { MDBBtn } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { debounce } from 'lodash';



//code for popper 
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


const SearchForm = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [ErrorMessage, setErrorMessage] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [data, setData] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [show, setShow] = useState(true);
//to avoid calculating destination on every render and store it
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
      console.log(response.data[0], "api response");
      setSubmit(false); 
    } catch (error) {
      console.error('Error fetching hotels:', error); 
      setSubmit(false); 
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const selectedDestination = uniqueDestinationsData.find(s => s.term === destination);
    if (!selectedDestination) {
      setErrorMessage('Please fill in all required fields.'); // Ensure this sets the error message
      console.error('Please fill in all required fields.');
      return;
    }
    console.log(selectedDestination);
    if (selectedDestination && checkIn && checkOut) {
      const searchParams = {
        destination_id: selectedDestination.uid,
        checkin: checkIn.toISOString().split('T')[0],
        checkout: checkOut.toISOString().split('T')[0],
        guests: adults + children,
        rooms
      };
      console.log('Form Submitted', searchParams);
      handleSearch(searchParams);
      if (onSearch) {
        onSearch(searchParams); 
      }
    } else {
      console.error('Please fill in all required fields.');
    }
  };

  const handleBack = () => {
    setShow(true);
    setData([]);
  };
//to make sure destination search not called on every keystroke, func called only after user stopstyping for 300ms
  const debouncedHandleChange = useCallback(
    debounce((event, newValue) => {
      setDestination(newValue ? newValue.term : '');
      setDestinationId(newValue ? newValue.uid : '');
    }, 300),
    []
  );

  return (
    <center>
      {show ? (
        <div style={{ width: "100%", height: "140px", backgroundColor: "#2447ff" }}>
          <div style={{ width: "90%", paddingTop: "5%" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                <form onSubmit={handleSubmit}>
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
                      <DatePicker
                        label="Check-in"
                        value={checkIn}
                        onChange={(newValue) => setCheckIn(newValue)}
                        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <DatePicker
                        label="Check-out"
                        value={checkOut}
                        onChange={(newValue) => setCheckOut(newValue)}
                        renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
                      />
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
                      <Button variant="contained" style={{ backgroundColor: "white", color: "#264cc2", border: "2px solid #264cc2", height: "53px" }} fullWidth type="submit">
                        {submit ? (
                          <span>Fetching...</span>
                        ) : (
                          <span>Submit</span>
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                  {ErrorMessage && (
                  <div style={{ color: "red", marginTop: "10px" }}>
                    {ErrorMessage}
                  </div>
                )}
                </form>
              </Card>
            </LocalizationProvider>
          </div>
        </div>
      ) : (
        ""
      )}
      <div style={{ margin: "50px" }}>
        {!show ? (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
            <h2>Search Results Include</h2>
            <MDBBtn style={{ backgroundColor: "blue", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={handleBack}>Back to Search</MDBBtn>
          </div>
        ) : ("")}
        {data ? <HotelList hotels={data} /> : null}
      </div>
    </center>
  );
};

export default SearchForm;
