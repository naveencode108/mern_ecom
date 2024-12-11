import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Provider } from "./context/Mycontext.jsx";

 
const key= import.meta.env.VITE_STRIPE_PK;

const stripePromise = loadStripe(
  key
);

createRoot(document.getElementById("root")).render(
  <Provider>
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </BrowserRouter>
  </Provider>
);
