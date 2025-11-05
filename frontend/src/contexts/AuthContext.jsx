import { createContext, useEffect, useState } from "react";
import { isLoggedIn, getCurrentUser, logout } from "../utils/twilioService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      if (isLoggedIn()) {
        const userData = getCurrentUser();
        setUser({ phoneNumber: userData.phoneNumber });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signOut = () => {
    logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
