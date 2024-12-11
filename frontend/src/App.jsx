import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import { Product } from "./components/Product";
import Login from "./components/Login";
import Register from "./components/Register";
import { Account } from "./components/pages/Account";
import { Cart } from "./components/pages/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import { Show } from "./components/Show";
import Placeorder from "./components/pages/Placeorder";
import Profile from "./components/pages/Profile";
import Orders from "./components/pages/Orders";
import Wishlist from "./components/pages/Wishlist";
import Address from "./components/pages/Address";
import Reviews from "./components/pages/Reviews";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import Chatbot from "./components/Chatbot";

const App = () => {
  return (
    <>
      <div className="w-full h-screen relative">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* {isLogin?<Route path="/login" element={<Navigate to='/'/>}/>:<Route path="/login" element={<Login/>} />} */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path="/showproduct/:id" element={<Show />} />

          <Route
            path="/product"
            element={<ProtectedRoute element={<Product />} />}
          />

          <Route
            path="/account"
            element={<ProtectedRoute element={<Account />} />}
          />
          <Route path="/account/profile" element={<Profile />} />
          <Route path="/account/orders" element={<Orders />} />
          <Route path="/account/wishlist" element={<Wishlist />} />
          <Route path="/account/address" element={<Address />} />
          <Route path="/account/reviews" element={<Reviews />} />

          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
          <Route
            path="/place_order"
            element={<ProtectedRoute element={<Placeorder />} />}
          />
        </Routes>

        <Chatbot />
      </div>
    </>
  );
};

export default App;
