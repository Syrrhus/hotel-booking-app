import React from 'react';
import './progressbar.css';

const ProgressBar = ({ step }) => {
  return (
    <div className="progress-bar">
      <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Booking</div>
      <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Guest Details</div>
      <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Payment</div>
      <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Confirmation</div>
    </div>
  );
};

export default ProgressBar;
