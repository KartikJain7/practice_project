import { createContext, useContext, useState, useEffect } from "react";
import { getLocalStorage } from "../config/helper";
import { frontUrl } from "@/config/config";
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    let token = getLocalStorage();
    if (!token && window.location.href.split("/")[3] != "login") {
      window.location.href = `${frontUrl}login`;
    }
  }, []);
  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}
