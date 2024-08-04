import axios from "axios";
import { useLocation } from "react-router-dom";

const PayButton = ({hotelBooked}) => {
    const location = useLocation();
    const hotel = location.state.hotel;

    const handleCheckOut = () => {
        axios.post(`http://localhost:5000/hotels/stripe/payment`, {
            hotelBooked
        }).then((res) => {
            if (res.data.url) {
                console.log(hotel)
            }
        }).catch((error) => {
            console.log("what");
        });
    };

    return (
        <>
            <button onClick={() => handleCheckOut()}>checkout</button>
        </>
    )
}

export default PayButton;