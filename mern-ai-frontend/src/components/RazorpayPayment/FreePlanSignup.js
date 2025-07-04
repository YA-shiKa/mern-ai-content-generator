import React from "react";
import { useMutation } from "@tanstack/react-query";
import StatusMessage from "../Alert/StatusMessage";
import { handleFreeSubscriptionAPI } from "../../apis/razorPayment/razorPayment";

const FreePlanSignup = () => {
  const planDetails = {
    name: "Free",
    price: "$0.00/month",
    features: ["5 Credits", "1 User", "Basic Support"],
  };

  // Helper function to extract a displayable message from an error object
  const getErrorMessage = (error) => {
    if (!error) return "An unknown error occurred.";
    if (typeof error === 'string') return error;

    if (error.response && error.response.data) {
      return error.response.data.description || error.response.data.error || error.response.data.message || JSON.stringify(error.response.data);
    }
    return error.message || JSON.stringify(error);
  };

  // Mutation for free plan
  const mutation = useMutation({
    mutationFn: handleFreeSubscriptionAPI,
    onError: (error) => {
      // You can add specific logging here if needed for this mutation
      console.error("FreePlanSignup - Mutation error:", error);
    }
  });

  // Handle confirm click
  const handleConfirmClick = () => {
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Confirm Your {planDetails.name} Plan
        </h2>

        {/* Error Message */}
        {mutation?.isError && (
          <StatusMessage
            type="error"
            // Use the helper to ensure a string is passed
            message={getErrorMessage(mutation?.error)}
          />
        )}

        {/* Loading State */}
        {mutation?.isPending && (
          <StatusMessage type="loading" message="Loading please wait..." />
        )}

        {/* Success Message */}
        {mutation?.isSuccess && (
          <StatusMessage type="success" message="Plan has been upgraded" />
        )}

        <p className="text-center text-gray-600 mb-4">
          Enjoy our free plan with no costs involved. Get started now and
          upgrade anytime to access more features.
        </p>

        <ul className="list-disc list-inside mb-6 text-gray-600">
          {planDetails.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>

        <div className="text-center text-green-600 font-bold mb-6">
          {planDetails.price} - No Payment Required
        </div>

        <button
          onClick={handleConfirmClick}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Confirm Free Plan : $0.00/month
        </button>
      </div>
    </div>
  );
};

export default FreePlanSignup;