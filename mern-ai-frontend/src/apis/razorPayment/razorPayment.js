import axios from "axios";

//======= Razorpay: Handle Free Plan =====
export const handleFreeSubscriptionAPI = async () => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/razorpay/free-plan",
    {},
    { withCredentials: true }
  );
  return response?.data;
};

//======= Razorpay: Create Order =====
export const createRazorPaymentIntentAPI = async (payment) => {
  try {
    const response = await axios.post(
      "http://localhost:8090/api/v1/razorpay/checkout",
      {
        amount: Number(payment?.amount),
        subscriptionPlan: payment?.subscriptionPlan, // 🛠 Make sure this matches backend
      },
      { withCredentials: true }
    );
    return response?.data;
  } catch (error) {
    console.error("Create Razorpay Order Error:", error); // ✅ Add this
    throw error; // rethrow for react-query to catch
  }
};



//======= Razorpay: Verify Payment =====
export const verifyRazorpayPaymentAPI = async (paymentData) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/razorpay/verify-payment",
    paymentData,
    { withCredentials: true }
  );
  return response?.data;
};
