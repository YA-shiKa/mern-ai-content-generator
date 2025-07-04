import { createContext, useContext, useEffect, useState } from "react";
import { checkUserAuthStatusAPI } from "../apis/user/usersAPI";
import { useQuery } from "@tanstack/react-query";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ add loading state

  const token = localStorage.getItem("token");

  const { data, isSuccess, isLoading } = useQuery({
    queryFn: checkUserAuthStatusAPI,
    queryKey: ["checkAuth"],
    enabled: !!token,
  });

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isSuccess) {
      setIsAuthenticated(data); // API returns true or false
      setLoading(false); // ✅ stop loading after auth is checked
    }
    if (!isLoading && !isSuccess) {
      setLoading(false); // even if it fails, stop loading
    }
  }, [isSuccess, isLoading, data]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
