import React, { useState, useEffect ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./searchItem.css";
import { SearchContext } from '../../context/SearchContext'; // Adjust path accordingly
import { format } from 'date-fns';

const SearchItem = ({ hotel }) => {
  const { searchParams,setSearchParams } = useContext(SearchContext);
  const [price, setPrice] = useState(null);
  const [RoomDetails, setRoomDetails] = useState([]);
  const [polling, setPolling] = useState(false); // State to control pollin
  const [PriceDetails, setPriceDetails] = useState([]);
  const [loadingPrice, setLoadingPrice] = useState(true);
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

  useEffect(() => {
    console.log(searchParams,"searchparams")
    if (searchParams.destination_id && searchParams.checkin && searchParams.checkout) {
      const fetchPrice = async () => {
        try {

          if (searchParams.hotelprices && searchParams.hotelprices[hotel.id]) {
            // If room details exist, use them and avoid fetching again
            console.log("Attempting to set Price for destination:", searchParams.hotelprices[hotel.id]);
            setPriceDetails(searchParams.hotelprices[hotel.id]);
            setLoadingPrice(false);
            return;
          }
          //console.log(searchParams,"searchparams")
       console.log("call price api")
          const response = await axios.get(`http://localhost:5000/hotels/prices`, {
            params: {
              destination_id: searchParams.destination_id,
              checkin: searchParams.checkin,
              checkout: searchParams.checkout,
              guests: searchParams.adults,
            },
          });

          

        //console.log(response.data,"price api");
// Initialize a counter to track the number of prices fetched
let fetchedPricesCount = 0;

// Loop through the hotels in response.data
response.data.forEach((hotelItem) => {
  if (fetchedPricesCount < 50) {
    if (hotelItem.id === hotel.id) { // Assuming hotel is defined and has an id
      setPrice(hotelItem.price); // Assuming hotelItem has a price field
      console.log(hotelItem.price, "price");
      setSearchParams((prev) => ({
        ...prev,
        PriceDetails: {
          ...prev.PriceDetails,
          [hotel.id]: {
            ...hotel, // Spread the full hotel object from your current data
            price: hotelItem.price // Add the price from hotelItem
          }
        }
      }));
      //console.log(searchParams,"seargcoarakjsm ")

      fetchedPricesCount++; // Increment the counter
    }
  } else {
    console.log('Fetched 50 prices, stopping further fetching.');
    return; // Exit the loop early if the limit is reached
  }
});
  
         
            
           
  
          
        } catch (error) {
          console.error('Error fetching hotel price:', error);
        }
      };
  
      fetchPrice();
    }
    
  }, [hotel,searchParams]);


  
  

  return (
    <div className="searchItem">
      <img
        src={firstImageUrl} // Fallback to a placeholder if no image URL
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
          <button>{hotel.rating}</button>
        </div>
        <div className="siDetailTexts">
          <span className="siPrice">${hotel.price || 'NotAvailable'}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button className="siCheckButton" onClick={handleNavigate}>See availability</button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;