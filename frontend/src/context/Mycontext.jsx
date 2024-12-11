import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from '../utils/Axios'

export const QuantityContext = createContext();

export const Provider = ({ children }) => {
  const [Quantity, setQuantity] = useState(
    localStorage.getItem("qt") ? parseInt(localStorage.getItem("qt")) : 1
  );

  const [loadingButton, setLoadingButton] = useState(false);

  const addToCart = async (id,Quantity) => {
    if (!sessionStorage.getItem("login_token")) {
      toast.error("You need to login first.");
      return;
    }
    setLoadingButton(true);
    try {
      // const res = await axios.post("/products/add_to_cart", { productId: id, quantity }, { withCredentials: true });
      const res = await axios.post("/products/add_to_cart", { productId: id, quantity:Quantity }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoadingButton(false);
  };

  const setquantity = (data) => {
    localStorage.setItem("qt", data);
    setQuantity(data);
  };

  return (
    <QuantityContext.Provider value={{ Quantity, setquantity,addToCart ,loadingButton}}>
      {children}
    </QuantityContext.Provider>
  );
};
