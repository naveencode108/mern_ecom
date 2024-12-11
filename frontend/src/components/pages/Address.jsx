
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "../../utils/Axios";
import { toast } from "react-toastify";



const Address = () => {
  const [address, setAddress] = useState({
    addressName: "",
    street: "",
    houseno: "",
    pincode: "",
    landmark: "",
    id: "",
    phoneno: "",
  });
  const [showaddress, setshowaddress] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');



  const handleChange = (e) => {
    const {name,value}=e.target;
    setAddress((prev)=>({...prev,[name]:value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(address.phoneno)) {
      setError('Phone number must be 10 digits.');
      return;
    }
    setError('');

    let res = await axios.post("/create_address", address, {
      withCredentials: true,
    });
    setshowaddress(res.data.msg);
    if (res.data) {
      toast.success(address.id?'Address Updated':'Address Created');
      setOpen(false);
      setAddress({
        addressName: "",
        street: "",
        houseno: "",
        pincode: "",
        landmark: "",
        id: "",
        phoneno:""
      });
    }
  };

  const updateAddress = async (item) => {
    const newAddress = {
      addressName: item.name,
      street: item.street,
      houseno: item.houseno,
      pincode: item.pincode,
      landmark: item.landmark,
      id: item._id,
      phoneno:item.phoneno
    };
    setOpen(true);
    setAddress(newAddress);
  };

  const removeAddress = async (id) => {
    let res = await axios.post(
      "/remove_address",
      { _id: id },
      { withCredentials: true }
    );
    if(res.data.msg){
       toast.success('Address Removed');
    }
    setshowaddress(res.data.msg);
  };

  const getAddress = async () => {
    try {
      let res = await axios.get("/get_address", { withCredentials: true });
        setshowaddress(res.data.msg.address);
    } catch (er) {
      console.log(er.message);
    }
  };

  useEffect(()=>{
    getAddress();
  },[]);

  return (
    <>
      <div className="p-4 sm:p-6 md:p-10 bg-gray-100 min-h-screen">
        {/* Breadcrumbs */}
        <Stack spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              underline="hover"
              key="1"
              color="inherit"
              to="/account"
              className="text-blue-700 hover:underline"
            >
              Your account
            </Link>
            <Typography key="3" sx={{ color: "text.primary" }}>
              Your address
            </Typography>
          </Breadcrumbs>
        </Stack>

        <div className="border mt-8 flex flex-col items-center lg:flex-row shadow-md rounded-md overflow-hidden bg-white">
          
          <div className="w-full lg:w-1/4  lg:h-96 bg-gray-50 flex justify-center items-center p-4 border-r border-gray-200">
            <button
              onClick={() => setOpen(true)}
              className="bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
            >
              Add Address
            </button>
          </div>

          {/* Address Display Area */}
          <div className="lg:w-3/4 h-full flex flex-wrap justify-start items-start ">
            {showaddress.length>0&&showaddress.map((address, index) => (
              <div key={index} className="w-full lg:w-1/3 p-4">
                <div className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{address.name}</h3>
                  <p className="text-gray-600">
                    <span className="font-semibold">Street:</span> {address.street}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">House No:</span> {address.houseno}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Pincode:</span> {address.pincode}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Landmark:</span> {address.landmark}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Phone No:</span> {address.phoneno}
                  </p>
                  <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => removeAddress(address._id)}
                        className=" text-red-400 underline  transition duration-200"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => updateAddress(address)}
                        className=" text-blue-400  underline transition duration-200"
                      >
                        Update
                      </button>
                    </div>
                </div>
              </div>
            ))}
          </div>

          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Address
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  name="addressName"
                  value={address.addressName}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Street"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="House No."
                  name="houseno"
                  value={address.houseno}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Landmark"
                  name="landmark"
                  value={address.landmark}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="PhoneNo"
                  name="phoneno"
                  value={address.phoneno}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={!!error}
                  helperText={error}
                  sx={{ mt: 2 }}
                />
                <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                  Submit
                </Button>
              </form>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Address;
