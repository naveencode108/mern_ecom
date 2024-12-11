import React from "react";
import { useForm } from "react-hook-form";
import axios from "../utils/Axios";
import { toast } from "react-toastify";
import {Navigate, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { adminLogin } from "../store/auth/authSlice";

const Login = () => {
   const dispatch= useDispatch();
  const navigate=useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

     dispatch(adminLogin(data)).then(data=>{
      try{
        if(data.payload.success){
          toast.success(`Welcome ${data.payload.isSuperAdmin?'SuperAdmin':'Admin'}`);
          localStorage.setItem('isSuperAdmin',data.payload.isSuperAdmin);
          navigate('/add');
        }
        else{
          toast.error(data.payload.message);
        }
      }
      catch(er){
        toast.error(er.message);
      }
     })
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-sm bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">AdminLogin</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
