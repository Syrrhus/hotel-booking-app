import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useLocation, useParams,useNavigate } from "react-router-dom";
import axios from 'axios';

const Hotel = () => {
  const { id } = useParams();
  console.log('Hotel ID:', id); // Debugging log
  const [hotel, setHotel] = useState(null);
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/hotels/${id}`);
        setHotel(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/hotels/${id}/payment`, { state: { hotel } });
  };

  if (loading) return <div>Loading...</div>;
  if (!hotel) return <div>Error loading hotel details</div>;

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
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={photos[slideNumber].src} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <button className="bookNow" onClick={handleNavigate}>Reserve or Book Now!</button>
          <h1 className="hotelTitle">{hotel.name}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{hotel.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {hotel.address}
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over ${hotel.price} at this property and get a free airport taxi
          </span>
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
              <h1 className="hotelTitle">Stay in the heart of City</h1>
              <p className="hotelDesc">
                {hotel.description}
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <h1>Perfect for a 9-night stay!</h1>
              <span>
                Located in the real heart of {hotel.name}, this property has an excellent location score of {hotel.name}!
              </span>
              <h2>
                <b>${hotel.price}</b> (9 nights)
              </h2>
            </div>
          </div>
        </div>
        <MailList />
        <Footer />
      </div>
    </div>
  );
};

export default Hotel;
