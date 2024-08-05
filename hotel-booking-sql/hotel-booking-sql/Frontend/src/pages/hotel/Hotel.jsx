import "./hotel.css";
import Navbar from "../../components/navbar2/Navbar2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SearchContext } from '../../context/SearchContext';
import { format } from 'date-fns';
import axios from 'axios';

// Custom icon for the map marker
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const Hotel = () => {
  const { searchParams } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();
  const hotel = location.state.hotel; // Extracting hotel data from state
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [RoomDetails, SetRoomDetails] = useState([]);
  const [loadingRoom, setLoadingRoom] = useState(true);

  const handleNavigate = (price, description) => {
    navigate(`/hotels/${hotel.id}/book`, { state: { price, description, hotel } });
  };

  useEffect(() => {
    const fetchroomprice = async () => {

      console.log(searchParams.checkin, "searchparamchecin");

      try {
        const response = await axios.get(`http://localhost:5000/hotels/${hotel.id}/prices`, {
          params: {
            destination_id: searchParams.destination_id,
            checkin: searchParams.checkin,
            checkout: searchParams.checkout,
            guests: searchParams.adults,
          },
        });
        if (response.data.completed) {
          console.log(response.data, "room response");
          SetRoomDetails(response.data.rooms);
          // Handle the response, e.g., update state with the fetched data
        } else {
          console.log('Response not completed, polling again...');
          setTimeout(fetchroomprice, 5000); // Poll every 5 seconds
        }

        console.log(response.data, "room response");
      }
      catch (error) {
        console.error('Error fetching hotel room price:', error);
      }
    }
    fetchroomprice();
    SetRoomDetails(searchParams.rooms || []);
    setLoadingRoom(false);

  }, [hotel]);

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date);
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

  useEffect(() => {
    const interval = setInterval(() => {
      handleMove("r");
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [slideNumber]);

  const handleThumbnailClick = (index) => {
    setSlideNumber(index);
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

            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{hotel.address}</span>
            </div>
            <span className="hotelRating">Rating: {hotel.rating}</span>
            <span className="hotelDistance">Excellent location: {hotel.distance.toFixed(2)}m</span>
            <span className="hotelPriceHighlight">Book a stay over ${hotel.price} only!</span>
            <div className="hotelImages">
              <div className="carousel">
                <FontAwesomeIcon icon={faChevronLeft} className="carouselArrow left" onClick={() => handleMove("l")} />
                <div className="carouselWrapper">
                  <img src={photos[slideNumber].src} alt="" className="carouselImg" />
                </div>
                <FontAwesomeIcon icon={faChevronRight} className="carouselArrow right" onClick={() => handleMove("r")} />
              </div>
              <div className="thumbnailCarousel">
                <div className="thumbnailWrapper">
                  {photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo.src}
                      alt=""
                      className={`thumbnailImg ${i === slideNumber ? "active" : ""}`}
                      onClick={() => handleThumbnailClick(i)}
                    />
                  ))}
                </div>
              </div>
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
          <div className="hotelMapWrapper">
            <div className="hotelMap">
              <MapContainer center={[hotel.latitude, hotel.longitude]} zoom={13} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[hotel.latitude, hotel.longitude]} icon={redIcon}>
                  <Popup>
                    {hotel.name} <br /> {hotel.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="roomDetails">
              <h2>Available Rooms</h2>
              {loadingRoom ? (
                <p>Loading room details...</p>
              ) : (
                <ul>
                  {Array.isArray(RoomDetails) && RoomDetails.length > 0 ? (
                    RoomDetails.map((room, index) => (
                      <li key={index} className="roomDetailItem">
                        <h3>{room.description}</h3>
                        <p><b>Price: ${room.price}</b></p>

                        {/* Display amenities as bullet points */}
                        <p><b>Amenities:</b></p>
                        <ul className="amenitiesList">
                          {room.amenities.map((amenity, amenityIndex) => (
                            <li key={amenityIndex}>{amenity}</li>
                          ))}
                        </ul>

                        {/* Display images if available */}
                        {room.images && room.images.length > 0 && (
                          <div className="roomImages">
                            {room.images.map((image, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={image.url}
                                alt={`Room ${index + 1} image ${imgIndex + 1}`}
                                className="roomImage"
                              />
                            ))}
                          </div>
                        )}

                        {/* Add the "Reserve or Book Now!" button */}
                        <button onClick={() => handleNavigate(room.price, room.description, hotel)}>Reserve or Book Now!</button>
                      </li>
                    ))
                  ) : (
                    <p>No room details available.</p>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;
