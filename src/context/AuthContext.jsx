import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("refreshToken") // Check for refresh token in localStorage
  );

  const login = (refreshToken, accessToken, full_name, role) => {
    localStorage.setItem("refreshToken", refreshToken); // Save refresh token
    localStorage.setItem("full_name", full_name);
    localStorage.setItem("role", role);
    localStorage.setItem("accessToken", accessToken);
    setIsAuthenticated(true); // Update authentication state
  };

  const logout = () => {
    localStorage.removeItem("refreshToken"); // Clear refresh token
    localStorage.removeItem("full_Name");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false); // Update authentication state
  };

  useEffect(() => {
    // Optional: Validate the refresh token on app load (e.g., call an API)
    const token = localStorage.getItem("refreshToken");
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
