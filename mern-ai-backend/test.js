const Razorpay = require('razorpay');
require('dotenv').config();

// Initialize Razorpay with the API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Create a test order
const testOrderData = {
  amount: 1000, // Amount in paise (10 INR)
  currency: "INR",
  receipt: "test_receipt_id",
};

razorpay.orders.create(testOrderData)
  .then(response => {
    console.log('Test order created:', response);
  })
  .catch(error => {
    console.error('Error creating order:', error);
  });
