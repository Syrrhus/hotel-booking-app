import React from 'react';
import { MaskedInput, createDefaultMaskGenerator } from 'react-hook-mask';

const PaymentDetails = ({ paymentInfo, handleChange, nextStep, prevStep, value, setValue }) => {
  const maskGenerator = createDefaultMaskGenerator('9999 9999 9999 9999');
  return (
    <div>
      {/* <h2>Payment Details</h2> */}
      <form>
        <div>
          <label>Billing Address</label>
          <input
            type="text"
            name="billingAddress"
            value={paymentInfo.billingAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <MaskedInput
            maskGenerator={maskGenerator}
            value={value}
            onChange={setValue}
            placeholder='Card number'
          />
        </div>
        <div>
          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={paymentInfo.cvc}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="cardExpiry"
            placeholder="MM/YYYY"
            value={paymentInfo.cardExpiry}
            onChange={handleChange}
            required
          />
        </div>
        <button type="button" onClick={prevStep}>Back</button>
        <button type="button" onClick={nextStep}>Next</button>
      </form>
    </div>
  );
};

export default PaymentDetails;
