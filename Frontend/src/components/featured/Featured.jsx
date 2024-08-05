import React from 'react';
import './featured.css';

const Featured = () => {
  return (
    <div className="featured">
      <div className="featuredItem">
        <img
          src="https://media.cntraveller.com/photos/620a483417b9c49e6e797962/16:9/w_2240,c_limit/Exterior%2001.jpg"
          alt="Resort Background"
          className="featuredImg"
        />
        <div className="exploreBanner">
          <h1>Explore a new world with Ascenda</h1>
        </div>
      </div>
    </div>
  );
};

export default Featured;
