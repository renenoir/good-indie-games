import React, { createContext, useContext, useState } from "react";

const LoginOpenContext = createContext();

export const LoginOpenProvider = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <LoginOpenContext.Provider value={{ loginOpen, setLoginOpen }}>
      {children}
    </LoginOpenContext.Provider>
  );
};

export default function useLoginOpen() {
  const context = useContext(LoginOpenContext);
  if (context === undefined) {
    throw new Error("useLoginOpen must be used within a LoginOpenProvider");
  }
  return context;
}
