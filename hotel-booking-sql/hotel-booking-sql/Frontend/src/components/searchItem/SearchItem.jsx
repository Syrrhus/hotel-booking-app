import React, { useState, useEffect ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./searchItem.css";
import { SearchContext } from '../../context/SearchContext'; // Adjust path accordingly
import { format } from 'date-fns';
import { faLocationDot, faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchItem = ({ hotel }) => {
  
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/hotels/${hotel.id}`, { state: { hotel } });
  };
  const firstImageUrl = hotel.image_details
  ?`${hotel.image_details.prefix}${hotel.image_details.suffix}`
  :"https://via.placeholder.com/600";

  function getRatingText(rating) {
    if (rating >= 4) {
      return "Excellent";
    } else if (rating >= 3.5) {
      return "Very Good";
    } else if (rating >= 3) {
      return "Good";
    } else if (rating >= 2.5) {
      return "Average";
    } else if (rating >= 1.5) {
      return "Below Average";
    } else {
      return "Poor";
    }
  }
 


  // limiting the small description words inside Hotel cards.
  const getLimitedWords = (htmlString) => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;
    const text = tempElement.textContent || tempElement.innerText || "";
    const words = text.split(/\s+/).slice(2, 32).join(' '); // Skipping first 2 words and taking next 30 words
    return words + (text.split(/\s+/).length > 22 ? '...' : '');
  };


  const limitedDescription = hotel.description ? getLimitedWords(hotel.description) : "";

  return (
    <div className="searchItem">
      <img
        src={firstImageUrl} // Primary image URL
        alt={hotel.name}
        className="siImg"
        // error picture
        onError={(e) => e.target.src = "https://remotive.com/company/49216/logo-large"} // Fallback image URL
      />
      {/* Main Hotel Cards */}
      <div className="siDesc">
        <h1 className="siTitle">{hotel.name}</h1>
        <span className="siDistance">
          <FontAwesomeIcon icon={faLocationDot} />
          <span> {hotel.address}</span>
          <p className="hotelDesc">{limitedDescription}</p>
        </span>
      </div>
      <div className="siDetails">
        {/* showing hotel ratings */}
        <div className="siRating">
          <span class="getRatingText">{getRatingText(hotel.rating)}</span>
          <button>{hotel.rating}</button>
        </div>
        <div className="siDetailTexts">
          {/* showing hotel price */}
          <span className="siPrice">${hotel.price || 'NA'}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button className="siCheckButton" onClick={handleNavigate}>See availability</button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;