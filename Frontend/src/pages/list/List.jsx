<<<<<<< HEAD
import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
// src/icons.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';

library.add(faStar);


const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.date);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state.options);
=======
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
>>>>>>> main

  return (
    <div>
      <Navbar />
<<<<<<< HEAD
      {/* <Header type="list" /> */}
=======
>>>>>>> main
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
<<<<<<< HEAD
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                date[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  minDate={new Date()}
                  ranges={date}
=======
              <span onClick={() => setOpenDate(!openDate)}>{`${format(new Date(checkIn), "MM/dd/yyyy")} to ${format(new Date(checkOut), "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => {
                    setCheckIn(item.selection.startDate);
                    setCheckOut(item.selection.endDate);
                  }}
                  minDate={new Date()}
                  ranges={[{ startDate: new Date(checkIn), endDate: new Date(checkOut), key: 'selection' }]}
>>>>>>> main
                />
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
<<<<<<< HEAD
                  <span className="lsOptionText">
                    Min price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">
                    Max price <small>per night</small>
                  </span>
                  <input type="number" className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
=======
>>>>>>> main
                  <span className="lsOptionText">Adult</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
<<<<<<< HEAD
                    placeholder={options.adult}
=======
                    value={options.adult}
                    onChange={(e) => setOptions({ ...options, adult: e.target.value })}
>>>>>>> main
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input
                    type="number"
                    min={0}
                    className="lsOptionInput"
<<<<<<< HEAD
                    placeholder={options.children}
=======
                    value={options.children}
                    onChange={(e) => setOptions({ ...options, children: e.target.value })}
>>>>>>> main
                  />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input
                    type="number"
                    min={1}
                    className="lsOptionInput"
<<<<<<< HEAD
                    placeholder={options.room}
=======
                    value={options.room}
                    onChange={(e) => setOptions({ ...options, room: e.target.value })}
>>>>>>> main
                  />
                </div>
              </div>
            </div>
<<<<<<< HEAD
            <div className="lsItem">
              <label>Star Rating</label>
              <input
                type="range"
                min="1"
                max="5"
                // value={starRating}
                // onChange={(e) => setStarRating(e.target.value)}
                className="lsOptionSlider"
              />
              {/* <span>{starRating} stars</span> */}
            </div>
            <button>Search</button>
          </div>
          
          <div className="listResult">
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
            <SearchItem />
=======
            <button>Search</button>
          </div>
          <div className="listResult">
            {data.map((hotel, index) => (
              <SearchItem key={index} hotel={hotel} />
            ))}
>>>>>>> main
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
