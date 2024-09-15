import React, { createContext, useContext, useState } from "react";

// Create context with proper naming
export const MyContext = createContext();

// Export the context provider
export default function ContextApi({ children }) {
  const [isAuth, setIsAuth] = useState(false);

  const data = {
    isAuth,
    setIsAuth
  };

  return (
    <MyContext.Provider value={data}>
      {children}
    </MyContext.Provider>
  );
}

// Create a custom hook for using context
export const useAuth = () => useContext(MyContext);
