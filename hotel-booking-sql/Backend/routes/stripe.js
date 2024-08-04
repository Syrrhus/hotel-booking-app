// This is your test secret API key.
import Stripe from "stripe";
import express from 'express';
import dotenv from "dotenv";
const stripe = Stripe('sk_test_51PixgOCs37t9J4ObkXLvN9ngwvNTf1yeRqaBg4Qe1WMzXtJ9SqDtFjwsdvBULuVBmv34nDVfhXbcWcssPz7ltXKl00yuh7DZnx');
const router = express.Router()

dotenv.config()

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:300/checkout-success`,
    cancel_url: `http://localhost:300/checkout-cancel`,
  });

  res.send({url: session.url});
});

export default router;