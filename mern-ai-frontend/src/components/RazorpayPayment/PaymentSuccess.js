import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { verifyRazorpayPaymentAPI as verifyPaymentAPI } from "../../apis/razorPayment/razorPayment";

const PaymentSuccess = () => {
  // Get search parameters
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const paymentId = searchParams.get("payment_id");
  const signature = searchParams.get("signature");

  const razorpayNotes = JSON.parse(
    decodeURIComponent(searchParams.get("notes") || "{}")
  );

  const payload = {
    orderId,
    paymentId,
    signature,
    notes: razorpayNotes,
    amount: searchParams.get("amount"),
  };

  const {
    isLoading,
    isError,
    isSuccess,
    data,
    error // Destructure the error object here
  } = useQuery({
    queryKey: ["verify-razorpay-payment", orderId],
    queryFn: () => verifyPaymentAPI(payload),
    enabled: !!orderId && !!paymentId && !!signature,
    // Add an onError callback for debugging if needed
    onError: (err) => {
      console.error("PaymentSuccess - Query error:", err);
    }
  });

  // Helper function to extract a displayable message from an error object (copied for consistency)
  const getErrorMessage = (error) => {
    if (!error) return "An unknown error occurred.";
    if (typeof error === 'string') return error;

    if (error.response && error.response.data) {
      return error.response.data.description || error.response.data.error || error.response.data.message || JSON.stringify(error.response.data);
    }
    return error.message || JSON.stringify(error);
  };


  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3" />
          <p className="text-lg text-gray-600">
            Verifying your payment, please wait...
          </p>
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">
          <FaTimesCircle className="text-5xl mb-3" />
          <p className="text-xl">Payment verification failed</p>
          <p className="text-gray-600 mt-2">
            {/* Display a more specific error if available from the query.error object */}
            {getErrorMessage(error || "An error occurred during verification. Please try again or contact support.")}
          </p>
          <Link
            to="/" // Or a more appropriate retry/home page
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
          >
            Go to Home
          </Link>
        </div>
      ) : (
        <div className="text-center text-green-500">
          <FaCheckCircle className="text-5xl mb-3" />
          <h1 className="text-2xl font-bold mb-3">Payment Successful</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your payment. Transaction ID: <b>{paymentId}</b>
          </p>
          <Link
            to="/generate-content"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Using AI
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;