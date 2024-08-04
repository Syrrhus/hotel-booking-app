import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_YOUR_API_KEY_HERE');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: name,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      console.log('Payment Method Created:', paymentMethod);
      // Handle payment method as needed
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name on Card
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Card Details
        <CardElement />
      </label>
      {error && <div>{error}</div>}
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payment;
