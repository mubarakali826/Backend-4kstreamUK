const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripeRoutes = require("./striperoutes");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Retrieve Stripe keys from environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_API_KEY = process.env.STRIPE_API_KEY;

// Initialize express app
const app = express();

// ✅ FIX: Allow only your frontend domain
app.use(
  cors({
    origin: "https://4kstreamuk.com", // Allow only your frontend domain
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allow cookies/auth headers if needed
  })
);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add Stripe Keys to Global Context (Optional)
app.locals.STRIPE_SECRET_KEY = STRIPE_SECRET_KEY;
app.locals.STRIPE_API_KEY = STRIPE_API_KEY;

// Debug logs
console.log("Using Stripe Secret Key from .env");
console.log("Using Stripe Public Key from .env");

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AWS Server is running successfully! 🚀",
  });
});

// Routes
app.use("/api/v1/payment", stripeRoutes);

// Handle unhandled routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server.`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
