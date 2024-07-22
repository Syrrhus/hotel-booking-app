import "./searchItem.css";
import { useNavigate } from 'react-router-dom';

// Each hotel card detail
const SearchItem = ({ hotel }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/hotels/${hotel.id}`);
  };

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
          <span>{hotel.ratingText || "Excellent"}</span>
          <button>{hotel.rating || "8.9"}</button>
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
