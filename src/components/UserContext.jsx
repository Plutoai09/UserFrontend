import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userResponses, setUserResponses] = useState([]);

  return (
    <UserContext.Provider value={{ userResponses, setUserResponses }}>
      {children}
    </UserContext.Provider>
  );
};
