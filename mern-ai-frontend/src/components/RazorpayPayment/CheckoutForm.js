import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import StatusMessage from "../Alert/StatusMessage";
import { createRazorPaymentIntentAPI } from "../../apis/razorPayment/razorPayment";

const CheckoutForm = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const plan = params.plan;
  const amount = searchParams.get("amount");
  const [errorMessage, setErrorMessage] = useState(null); // This state should only hold a string or null

  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

  console.log("🧪 Razorpay Key (from .env):", razorpayKey);

  const mutation = useMutation({
    mutationFn: createRazorPaymentIntentAPI,
  });

  if (!razorpayKey) {
    return (
      <div className="text-red-500 text-center mt-10">
        Error: Razorpay key not set in environment. <br />
        Add <code>REACT_APP_RAZORPAY_KEY_ID</code> to your <code>.env</code> file and restart the dev server.
      </div>
    );
  }

  // Helper function to extract a displayable message from an error object
  const getErrorMessage = (error) => {
    if (!error) return "An unknown error occurred.";
    if (typeof error === 'string') return error; // If it's already a string

    // Check for common error structures
    if (error.response && error.response.data) {
      // Prioritize 'description' for Razorpay specific errors, then 'error', then 'message'
      return error.response.data.description || error.response.data.error || error.response.data.message || JSON.stringify(error.response.data);
    }
    // Fallback for general JS errors or other structures
    return error.message || JSON.stringify(error);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors on new submission

    try {
      const paymentData = { amount, subscriptionPlan: plan };

      mutation.mutate(paymentData, {
        onSuccess: (data) => {
          const options = {
            key: razorpayKey,
            amount: data.amount,
            currency: data.currency,
            name: "AI Content Generator",
            description: `Subscription Plan: ${plan}`,
            order_id: data.orderId,
            handler: async function (response) {
              const verificationData = {
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                notes: data.notes,
                amount: data.amount,
              };

              try {
                const res = await fetch(
                  "http://localhost:8090/api/v1/razorpay/verify-payment",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(verificationData),
                  }
                );

                const result = await res.json();
                if (result.status === true) {
                  alert("Payment successful!");
                  window.location.href = "/success";
                } else {
                  // Ensure we extract a string message from the result
                  setErrorMessage(getErrorMessage(result.error || "Payment verification failed."));
                }
              } catch (err) {
                console.error("Verification error:", err);
                // Ensure we extract a string message from the catch error
                setErrorMessage(getErrorMessage(err));
              }
            },
            prefill: {
              name: "Your Name",
              email: "user@example.com",
            },
            theme: {
              color: "#6366F1",
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        },
        onError: (error) => {
          console.error("Payment creation error:", error);
          // Use the helper to get a displayable string
          setErrorMessage(getErrorMessage(error));
        },
      });
    } catch (error) {
      console.error("Unexpected error in handleSubmit:", error);
      // Use the helper to get a displayable string
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 mx-auto my-4 p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Pay for {plan} Plan - ₹{amount}
        </h2>

        {mutation.isPending && (
          <StatusMessage type="loading" message="Processing payment..." />
        )}

        {mutation.isError && (
          <StatusMessage
            type="error"
            // Use the helper for the message prop as well, for consistency
            message={getErrorMessage(mutation.error)}
          />
        )}

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Pay with Razorpay
        </button>

        {errorMessage && (
          // This div directly renders errorMessage, which is now guaranteed to be a string
          <div className="text-red-500 mt-4">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm;