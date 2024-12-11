import { createContext, useEffect, useState } from "react";

export const QuantityContext = createContext();

export const Provider = ({ children }) => {
  const [Quantity, setQuantity] = useState(
    localStorage.getItem("qt") ? parseInt(localStorage.getItem("qt")) : 1
  );

  const setquantity = (data) => {
    localStorage.setItem("qt", data);
    setQuantity(data);
  };

  return (
    <QuantityContext.Provider value={{ Quantity, setquantity }}>
      {children}
    </QuantityContext.Provider>
  );
};
