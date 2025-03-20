require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsyncErrors = require("./middleware/catchAsyncErrors");

console.log(
  "Stripe Initialized with Secret Key from .env:",
  process.env.STRIPE_SECRET_KEY ? "Loaded" : "Not Loaded"
);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  console.log("Received request for payment processing with body:", req.body);

  if (!req.body.amount || typeof req.body.amount !== "number") {
    console.error("Invalid amount provided:", req.body.amount);
    return res
      .status(400)
      .json({ success: false, message: "Invalid amount provided" });
  }

  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "gbp",
      metadata: { company: "4kstreamUK" },
    });

    console.log("Payment intent created successfully:", myPayment.id);

    res.status(200).json({
      success: true,
      client_secret: myPayment.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Payment processing failed" });
  }
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  const stripeApiKey = process.env.STRIPE_API_KEY;

  console.log("Sending Stripe Publishable Key to frontend:", stripeApiKey);

  if (!stripeApiKey) {
    console.error("Stripe publishable key is not set in environment variables");
    return res
      .status(500)
      .json({ success: false, message: "Stripe API Key not configured" });
  }

  res.status(200).json({
    stripeApiKey: stripeApiKey,
  });
});
