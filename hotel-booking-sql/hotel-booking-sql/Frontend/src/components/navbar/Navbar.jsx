import "./navbar.css";
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
