import "./navbar2.css";
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="navbar">
      <div className="navContainer">
        <button className="backButton" onClick={handleBackClick}>
          &#x3C; {/* Unicode for "<" symbol */}
        </button>
        <img
          src="https://australianloyaltyassociation.com//wp-content/uploads/2024/02/Ascenda_Logo_Blue_RGB-1.png"
          className="Ascendalogo"
          onClick={handleLogoClick}
          alt="Ascenda Logo"
        />
      </div>
    </div>
  );
};

export default Navbar;
