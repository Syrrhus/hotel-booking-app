import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

const Payment = () => {
  const location = useLocation();
  const hotel = location.state?.hotel; // Add optional chaining to avoid undefined error

  if (!hotel) {
    return <div>Hotel information is missing.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="paymentContainer">
        <h1>Payment for {hotel.name}</h1>
        {/* Add your payment form and logic here */}
        <p>Total price: ${hotel.price}</p>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
