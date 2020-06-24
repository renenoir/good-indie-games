import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState();

  useEffect(() => {
    try {
      setToken(localStorage.getItem("token"));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    try {
      if (!token) {
        localStorage.removeItem("token");
        return;
      }
      localStorage.setItem("token", token);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  console.log(token);

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
