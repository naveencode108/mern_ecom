import React, { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "../utils/Axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegUserCircle } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const Logout = async () => {
    try {
      let val = await axios.post("/logout", {}, { withCredentials: true });
      // localStorage.removeItem("login_token");
      sessionStorage.removeItem('login_token');
      sessionStorage.removeItem('user_name');
      toast.success(val.data.message);
    } catch (er) {
      toast.error(er.message);
    } finally {
      navigate("/login");
    }
  };

  const isLogin = sessionStorage.getItem("login_token")?sessionStorage.getItem("login_token"):'';
  // const isLogin = localStorage.getItem("login_token")?localStorage.getItem("login_token"):'';
 
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex z-50  justify-between px-10 items-center bg-black text-white w-full py-5 mx-auto">
        <h1 className="text-2xl">Ecommerce</h1>
        <div
          className="relative text-left "
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div>
            <Link to="/" className="flex items-center px-5">
              <IoHomeOutline />
              Home
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06 0L10 10.25l3.71-3.04a.75.75 0 011.06 1.06l-4.25 3.5a.75.75 0 01-1.06 0l-4.25-3.5a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          {isOpen && (
            <div className="absolute right-0 z-10 py-2  rounded-md shadow-lg bg-black  ring-1 ring-black ring-opacity-5">
              <div
                className="py-1 flex gap-3 text-lg  flex-col"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <NavLink
                  className="flex   items-center hover:bg-white hover:text-black px-5  rounded transition duration-200"
                  to={`${isLogin ? "/product" : "/login"}`}
                >
                  <AiOutlineProduct />
                  Product
                </NavLink>
                {isLogin ? (
                  <span
                    onClick={Logout}
                    className="cursor-pointer flex items-center hover:bg-white hover:text-black px-5"
                  >
                    <CiLogout />
                    Logout
                  </span>
                ) : (
                  <Link
                    to="/login"
                    className="flex  items-center hover:bg-white hover:text-black px-5"
                  >
                    <CiLogin />
                    Login
                  </Link>
                )}
                <Link
                  to={`${isLogin ? "/account" : "/login"}`}
                  className="flex   items-center hover:bg-white hover:text-black px-5"
                >
                  <FaRegUserCircle />
                  Account
                </Link>
                <Link
                  to={`${isLogin ? "/cart" : "/login"}`}
                  className="flex   items-center hover:bg-white hover:text-black px-5"
                >
                  <FaRegUserCircle />
                  Cart
                </Link>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </>
  );
};

export default Navbar;
