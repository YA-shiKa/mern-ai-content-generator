import React from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

const StatusMessage = ({ type, message }) => {
  let icon;
  let colorClass;

  switch (type) {
    case "error":
      icon = <AiOutlineCloseCircle className="text-red-500 text-3xl" />;
      colorClass = "bg-red-100 text-red-700";
      break;
    case "success":
      icon = <AiOutlineCheckCircle className="text-green-500 text-3xl" />;
      colorClass = "bg-green-100 text-green-700";
      break;
    case "loading":
      icon = (
        <AiOutlineLoading3Quarters className="animate-spin text-blue-500 text-3xl" />
      );
      colorClass = "bg-blue-100 text-blue-700";
      break;
    default:
      icon = null;
  }

  // Determine the message to display
  let displayMessage;
  if (typeof message === "string") {
    displayMessage = message;
  } else if (typeof message === "object" && message !== null) {
    // Prioritize 'description' (common in Razorpay/API errors), then 'error', then 'message', then stringify
    displayMessage = message.description || message.error || message.message || JSON.stringify(message, null, 2);
  } else {
    // Convert any other type (like numbers, booleans, null, undefined) to a string
    displayMessage = String(message);
  }

  return (
    <div className={`flex items-center p-4 rounded-lg ${colorClass} space-x-3`}>
      {icon}
      <span className="text-sm font-medium whitespace-pre-wrap">
        {displayMessage}
      </span>
    </div>
  );
};

export default StatusMessage;