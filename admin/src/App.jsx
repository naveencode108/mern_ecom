import React, { useEffect } from "react";
import Login from "./components/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Add } from "./components/pages/Add";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { List } from "./components/pages/List";
import { Order } from "./components/pages/Order";
import { User } from "./components/pages/User";
import { authentication } from "./store/auth/authSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authentication());
  }, []);

  const { isAuth, isLoading } = useSelector((state) => state.auth);
  return (
    <>
      {isLoading ? (
        <h1 className="w-full min-h-screen flex justify-center items-center text-4xl">Loading..</h1>
      ) : (
        <>
           <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {!isAuth && <Route path="/login" element={<Login />} />}
            <Route
              path="/login"
              element={
                isAuth ? (
                  <Navigate to={"/add"} />
                ) : (
                  <Login />
                )
              }
            />
            {isAuth === true ? (
              <>
                <Route
                  path="/*"
                  element={
                    <div className="w-full">
                      <Navbar />
                      <div className="w-full flex">
                        <Sidebar />
                        <div className="w-full">
                          <Routes>
                            <Route path="/add"  element={<Add />} />
                            <Route path="/list" element={<List />} />
                            <Route path="/order" element={<Order />} />
                            <Route path="/users" element={<User />} />
                          </Routes>
                        </div>
                      </div>
                    </div>
                  }
                />
              </>
            ) : (
              <>
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </>
      )}
    </>
  );
};

export default App;
