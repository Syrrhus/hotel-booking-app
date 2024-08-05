import React from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { validNoneEmpty } from './validation';

// Load your Stripe public key
const stripePromise = loadStripe('pk_test_51PixgOCs37t9J4ObCB1eASvICPMoV1Nr2k94QT4tfowt4zSRVjHOTxl17mEW5w1DEpyIE6KFVDodu1YLGqXD1eYI00zY7jp3nd');

const PaymentDetails = ({ paymentInfo, handleChange, handleSubmit, prevStep }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleNext = async (e) => {
    e.preventDefault();
    
    const cardElement = elements.getElement(CardElement);

    if (!validNoneEmpty(paymentInfo.billingAddress)) {
      alert("Please fill in your address");
      return;
    }

    if (!stripe || !elements || !cardElement) {
      console.error('Stripe, Elements, or CardElement is not available');
      return;
    }

    const { error } = await stripe.createToken(cardElement);

    if (error) {
      alert(`Invalid card details: ${error.message}`);
    } else {
      handleSubmit();
    }
  };

  return (
    <div>
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
        <div className="form-group">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        <button type="button" onClick={prevStep}>Back</button>
        <button type="button" onClick={handleSubmit}>Confirm Booking</button>
      </form>
    </div>
  );
};

const PaymentDetailsWrapper = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentDetails {...props} />
    </Elements>
  );
};

export default PaymentDetailsWrapper;
