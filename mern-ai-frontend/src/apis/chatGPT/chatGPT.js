

import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
export const generateContentAPI = async (userPrompt) => {
  const response = await axios.post(
    "http://localhost:8090/api/v1/openai/generate-content",
    { prompt: userPrompt },
    { withCredentials: true }
  );
  return response?.data;
};