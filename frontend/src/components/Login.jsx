import axios from "../utils/Axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShow,setisshow]=useState(false);
  const [loading,setloading]=useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let val = await axios.post(
      "/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    setloading(true);
    
    if (val.data.success) {
      setloading(false);
      toast.success(val.data.message);
      sessionStorage.setItem('login_token',val.data.token);
      sessionStorage.setItem('user_name',val.data.name);
      // localStorage.setItem("login_token", val.data.token);
      // localStorage.setItem('user_name',val.data.name);
      navigate("/");
    } else {
      setloading(false);
      toast.error(val.data.error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-sm bg-gray-200 p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border  rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type={isShow?'text':'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                required
              />
              {password!=''&&
              <button type="button" className="absolute right-2 top-10" onClick={()=>setisshow(!isShow)}>
                {isShow?
                <FaEyeSlash />
                :
                <FaEye />
                }
                </button>
              }
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500  text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300`}
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Forget Password?
            <Link to="/forgetPassword" className="text-blue-500 hover:underline">
             Click here
            </Link>
          </p>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
