import { Breadcrumbs, Button, Stack, Typography } from "@mui/material";
import axios from "../../utils/Axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {CircularProgress} from '@mui/material'

const Profile = () => {
  const [img, setimg] = useState();
  const [username, setusername] = useState("");
  const [loading,setloading]=useState('false');


  const handleSubmit = async (events) => {
    events.preventDefault();
    let file=events.target.profile.files[0];
    setloading(true);
    let formData=new FormData();
     
    if(file) formData.append('image',file);
    formData.append('name',username); 
     
    try{
      let res = await axios.post("/user_profile", formData, {
        withCredentials: true,
      });
      if(res.data.msg){
        toast.success('Profile Updated');
      }
      setusername(res.data.msg.name);
      setimg(res.data.msg.userImage);
    }
    catch(er){
       console.error(er.message);
       toast.error(er.message);
    }
    finally{
      setloading(false);
    }
  };

  const handleImg = (val) => {
    let file = val.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setimg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const get_user_profile=async()=>{
      let res=await axios.get('/get_user_profile',{withCredentials:true});
      setusername(res.data.msg.name)
      setimg(res.data.msg.userImage)
  }

  useEffect(() => {
    get_user_profile();
  }, []);

  return (
    <div className="p-10">
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link underline="hover" key="1" color="inherit" to="/account">
          Your account
        </Link>
          <Typography key="3" sx={{ color: "text.primary" }}>
            Your profile
          </Typography>
        </Breadcrumbs>
      </Stack>

      <div>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto"
          encType="multipart/form-data"
        >
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <img
                src={img && img}
                alt="Image"
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-300"
              />
              <label
                htmlFor="profilePic"
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232a3 3 0 014.536 4.536l-9.536 9.536a3 3 0 01-1.061.707l-3.9 1.299a.75.75 0 01-.95-.95l1.299-3.9a3 3 0 01.707-1.06l9.536-9.537z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.768 3.768a2.25 2.25 0 013.182 3.182M12 8.25l3.75 3.75"
                  />
                </svg>
              </label>
              <input
                name="profile"
                id="profilePic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImg}
              />
            </div>
          </div>

          {/* Name Change Section */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Change Name
            </label>
            <input
              type="text"
              name="name"
              onChange={(e) => setusername(e.target.value)}
              value={username}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              {loading==true?<CircularProgress color='' size={25}/>:'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
