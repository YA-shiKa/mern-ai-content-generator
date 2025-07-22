const asyncHandler = require("express-async-handler");
const Razorpay = require("razorpay");
const {
  calculateNextBillingDate,
} = require("../utils/calculateNextBillingDate");
const {
  shouldRenewSubscriptionPlan,
} = require("../utils/shouldRenewsubscriptionPlan");
const Payment = require("../models/Payment");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// ----- Razorpay payment -----
const handleRazorPayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  const user = req?.user;

  try {
    // Razorpay order creation
    const order = await razorpay.orders.create({
      amount: Number(amount) * 100, // Amount in paise
      currency: "INR",
      receipt: `rcptid_${Math.random().toString(36).substring(2, 10)}`,
      notes: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      notes: order.notes,
    });
  } catch (error) {
    console.log("Error creating Razorpay order:", error);
    // If error is an object, convert it into a string for a cleaner error message
    const errorMessage = error && typeof error === "object" ? JSON.stringify(error) : error;
    res.status(500).json({ error: errorMessage });
  }
});

// ----- Verify Razorpay payment -----
const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  // For security: verify signature using crypto (optional for test mode)
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
  hmac.update(orderId + "|" + paymentId);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== signature) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const { subscriptionPlan, userId, userEmail } = req.body.notes;

  const userFound = await User.findById(userId);
  if (!userFound) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  const newPayment = await Payment.create({
    user: userId,
    email: userEmail,
    subscriptionPlan,
    amount: req.body.amount / 100,
    currency: "INR",
    status: "success",
    reference: paymentId,
  });

  let monthlyRequestCount = subscriptionPlan === "Premium" ? 100 : 50;

  const updatedUser = await User.findByIdAndUpdate(userId, {
    subscriptionPlan,
    trialPeriod: 0,
    nextBillingDate: calculateNextBillingDate(),
    apiRequestCount: 0,
    monthlyRequestCount,
    $addToSet: { payments: newPayment?._id },
  });

  res.json({
    status: true,
    message: "Payment verified and user updated",
    updatedUser,
  });
});

// ----- Handle free subscription -----
const handleFreeSubscription = asyncHandler(async (req, res) => {
  const user = req?.user;
  console.log("free plan", user);

  try {
    if (shouldRenewSubscriptionPlan(user)) {
      user.subscriptionPlan = "Free";
      user.monthlyRequestCount = 5;
      user.apiRequestCount = 0;
      user.nextBillingDate = calculateNextBillingDate();

      const newPayment = await Payment.create({
        user: user?._id,
        subscriptionPlan: "Free",
        amount: 0,
        status: "success",
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 0,
        currency: "INR",
      });

      user.payments.push(newPayment?._id);
      await user.save();

      res.json({
        status: "success",
        message: "Subscription plan updated successfully",
        user,
      });
    } else {
      return res.status(403).json({ error: "Subscription renewal not due yet" });
    }
  } catch (error) {
    console.log(error);
    // If error is an object, convert it into a string before sending to frontend
    const errorMessage = error && typeof error === "object" ? JSON.stringify(error) : error;
    res.status(500).json({ error: errorMessage });
  }
});

module.exports = {
  handleRazorPayment,
  verifyPayment,
  handleFreeSubscription,
};

