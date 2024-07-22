import "./hotel.css"
import Navbar from "../../components/navbar/Navbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Hotel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hotel = location.state.hotel; // Extracting hotel data from state
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleNavigate = () => {
    navigate(`/hotels/${hotel.id}/payment`, { state: { hotel } });
  };

  const photos = hotel.image_details.prefix
    ? Array.from({ length: hotel.imageCount }, (_, i) => ({
        src: `${hotel.image_details.prefix}${i}${hotel.image_details.suffix}`
      }))
    : [];

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? photos.length - 1 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === photos.length - 1 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  return (
    <div>
      <Navbar />
      <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faTimes}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={photos[slideNumber].src} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <button className="bookNow" onClick={handleNavigate}>
            Reserve or Book Now!
          </button>
          <h1 className="hotelTitle">{hotel.name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{hotel.address}</span>
          </div>
          <span className="hotelRating">
            <span>Rating: {hotel.rating}</span>
          </span>
          <span className="hotelDistance">Excellent location: {hotel.distance.toFixed(2)}m</span>
          <span className="hotelPriceHighlight">Book a stay over ${hotel.price} only!</span>
          <div className="hotelImages">
            {photos.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo.src}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Stay in the heart of {hotel.original_metadata.city}</h1>
              <p className="hotelDesc" dangerouslySetInnerHTML={{ __html: hotel.description }}></p>
              <div className="hotelTrustYouScores">
                <h2>TrustYou Scores</h2>
                <p>Overall: {hotel.trustyou.score.overall}</p>
                <p>Kaligo Overall: {hotel.trustyou.score.kaligo_overall}</p>
                <p>Solo: {hotel.trustyou.score.solo || "N/A"}</p>
                <p>Couple: {hotel.trustyou.score.couple || "N/A"}</p>
                <p>Family: {hotel.trustyou.score.family || "N/A"}</p>
                <p>Business: {hotel.trustyou.score.business || "N/A"}</p>
              </div>
              <div className="hotelCategories">
                <h2>Categories</h2>
                {Object.keys(hotel.categories).map((key) => (
                  <div key={key}>
                    <p>{hotel.categories[key].name}: {hotel.categories[key].score}</p>
                    <p>Popularity: {hotel.categories[key].popularity}</p>
                  </div>
                ))}
              </div>
              <div className="hotelAmenitiesRatings">
                <h2>Amenities Ratings</h2>
                {hotel.amenities_ratings.map((amenity, index) => (
                  <div key={index}>
                    <p>{amenity.name}: {amenity.score}</p>
                  </div>
                ))}
              </div>
              <div className="hotelAmenities">
                <h2>Amenities</h2>
                <ul>
                  {Object.keys(hotel.amenities).map((key) => (
                    <li key={key}>{key.replace(/([A-Z])/g, ' $1')}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a {hotel.categories.family_hotel ? "Family" : "Business"} stay!</h1>
              <h2>
                <b>${hotel.price || "N/A"}</b> (9 nights)
              </h2>
              <button onClick={handleNavigate}>Reserve or Book Now!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hotel