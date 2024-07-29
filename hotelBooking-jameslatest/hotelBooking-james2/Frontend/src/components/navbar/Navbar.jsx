import "./navbar.css"
import React from 'react';
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navContainer">
        <img src="https://australianloyaltyassociation.com//wp-content/uploads/2024/02/Ascenda_Logo_Blue_RGB-1.png" 
        width={100} height={20}
        className="Ascendalogo"/>
        {/* <span className="logo">Ascenda</span> */}
        <div className="navItems">
          <button className="navButton">Register</button>
          <button className="navButton">Login</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar