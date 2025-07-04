import axios from "axios";

export const getContentHistoryAPI = async () => {
  const response = await axios.get("http://localhost:8090/api/v1/history", {
    withCredentials: true,
  });
  return response?.data;
};
