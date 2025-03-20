const express = require("express");
const { processPayment, sendStripeApiKey } = require("./stripeController");
const router = express.Router();

// Route to process payment
router.post("/process", processPayment);

// Route to send Stripe API key
router.get("/stripe-key", sendStripeApiKey);

module.exports = router;
