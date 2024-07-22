import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { DateRange } from 'react-date-range';
import Navbar from '../../components/navbar/Navbar';
import SearchItem from '../../components/searchItem/SearchItem';
import './list.css';
//all  the hotels of one destination displayed here 
const List = () => {
  const location = useLocation();
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

  return (
    <div>
      <Navbar style={{position:"sticky"}} />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input placeholder={destination} type="text" />
            </div>
            <div className="lsItem">
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(new Date(checkIn), "MM/dd/yyyy")} to ${format(new Date(checkOut), "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => {
                    setCheckIn(item.selection.startDate);
                    setCheckOut(item.selection.endDate);
                  }}
                  minDate={new Date()}
                  ranges={[{ startDate: new Date(checkIn), endDate: new Date(checkOut), key: 'selection' }]}
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.adult}
                    onChange={(e) => setOptions({ ...options, adult: e.target.value })}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
                    value={options.children}
                    onChange={(e) => setOptions({ ...options, children: e.target.value })}
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
                    value={options.room}
                    onChange={(e) => setOptions({ ...options, room: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <button>Search</button>
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
