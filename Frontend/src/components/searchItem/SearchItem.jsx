import "./searchItem.css";
import { useNavigate } from 'react-router-dom';

const SearchItem = ({ hotel }) => {

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/hotels/${hotel.id}`, { state: { hotel } });
  };

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

  console.log(hotel);
  return (
    <div className="searchItem">
      <img
        src={hotel.image_details || "https://via.placeholder.com/600"} // Fallback to a placeholder if no image URL
        alt={hotel.name}
        className="siImg"
      />
      <div className="siDesc">
        <h1 className="siTitle">{hotel.name}</h1>
        <span className="siDistance">{hotel.address}</span>
        {hotel.freeTaxi && <span className="siTaxiOp">Free airport taxi</span>}
        <span className="siSubtitle">{hotel.subtitle || "Studio Apartment with Air conditioning"}</span>
        <span className="siFeatures">{hotel.features || "Entire studio • 1 bathroom • 21m² 1 full bed"}</span>
        {hotel.freeCancellation && <span className="siCancelOp">Free cancellation</span>}
        {hotel.freeCancellation && (
          <span className="siCancelOpSubtitle">
            You can cancel later, so lock in this great price today!
          </span>
        )}
      </div>
      <div className="siDetails">
        <div className="siRating">
          <span>{getRatingText(hotel.rating)}</span>
          {/* <span>{hotel.ratingText || "Excellent"}</span> */}
          <button>{hotel.rating}</button>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">${hotel.price}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button className="siCheckButton" onClick={handleNavigate}>See availability</button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
