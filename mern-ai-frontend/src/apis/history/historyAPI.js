

import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
export const getContentHistoryAPI = async () => {
  const response = await axios.get("http://localhost:8090/api/v1/history", {
    withCredentials: true,
  });
  return response?.data;
};  