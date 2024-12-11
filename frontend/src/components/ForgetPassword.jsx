import { toast } from "react-toastify";
import axios from '../utils/Axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
    const [email,setemail]=useState('');
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
          let res=await axios.post('/forget_password',{email});
           if(res.data.success){
               toast.success(res.data.message);
               navigate('/login');
            }
            else{
               toast.warning(res.data.message);
           }
        }
        catch(er){
          toast.error(er.message);
        }
    }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-full max-w-sm bg-gray-200 p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Forget Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e)=>setemail(e.target.value)}
                className="w-full px-3 py-2 border  rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Send Forget Link
            </button>
          </form>
         
        </div>
      </div>
  )
}

export default ForgetPassword;