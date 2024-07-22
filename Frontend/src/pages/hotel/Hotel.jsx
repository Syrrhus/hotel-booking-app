import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Hotel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hotel = location.state.hotel; // Extracting hotel data from state
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [rating, setRating] = useState([0, 5]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

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
            <FontAwesomeIcon icon={faTimes} className="close" onClick={() => setOpen(false)} />
            <FontAwesomeIcon icon={faChevronLeft} className="arrow" onClick={() => handleMove("l")} />
            <div className="sliderWrapper">
              <img src={photos[slideNumber].src} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="arrow" onClick={() => handleMove("r")} />
          </div>
        )}
        <div className="hotelContent">
          <div className="hotelDetailsWrapper">
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
                  <img onClick={() => handleOpen(i)} src={photo.src} alt="" className="hotelImg" />
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
                  <p>Solo: {hotel.trustyou.score.solo}</p>
                  <p>Couple: {hotel.trustyou.score.couple}</p>
                  <p>Family: {hotel.trustyou.score.family}</p>
                  <p>Business: {hotel.trustyou.score.business}</p>
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
                  <b>${hotel.price}</b> (9 nights)
                </h2>
                <button onClick={handleNavigate}>Reserve or Book Now!</button>
              </div>
            </div>
          </div>
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
                <Slider range min={50} max={500} defaultValue={priceRange} onChange={(value) => setPriceRange(value)} />
                <span>{`Price: $${priceRange[0]} - $${priceRange[1]}`}</span>
              </div>
              <div className="filterGroup">
                <label>Check-in Date</label>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
              </div>
              <div className="filterGroup">
                <label>Check-out Date</label>
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
              </div>
              <div className="filterGroup">
                <label>Adults</label>
                <input type="number" min="1" value={adults} onChange={(e) => setAdults(e.target.value)} />
              </div>
              <div className="filterGroup">
                <label>Children</label>
                <input type="number" min="0" value={children} onChange={(e) => setChildren(e.target.value)} />
              </div>
              <div className="filterGroup">
                <label>Rooms</label>
                <input type="number" min="1" value={rooms} onChange={(e) => setRooms(e.target.value)} />
              </div>
              <button className="filterButton">Apply Filters</button>
            </div>
          </div>
        </div>
        <div className="hotelMap">
          <MapContainer center={[hotel.latitude, hotel.longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[hotel.latitude, hotel.longitude]}>
              <Popup>
                {hotel.name} <br /> {hotel.address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Hotel;