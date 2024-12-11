import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../utils/Axios";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import PaymentModal from "./Paymentmodel";
import { toast } from "react-toastify";
import { QuantityContext } from "../../context/Mycontext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const PlaceOrder = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [userId, setuserId] = useState();
  const [showaddress, setshowaddress] = useState([]);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedAddress, setselectedAddress] = useState();
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    addressName: "",
    street: "",
    houseno: "",
    pincode: "",
    landmark: "",
    id: "",
    phoneno: "",
  });

  // let { totalPrice, cart, quantity} = location.state; 
  let {Quantity,setquantity}=useContext(QuantityContext);

  let { totalPrice:intialPrice, cart} = location.state; 
  const [totalprice,setTotalprice]=useState(intialPrice);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{10}$/.test(address.phoneno)) {
      setError("Phone number must be 10 digits.");
      return;
    }
    setError("");

    let res = await axios.post("/create_address", address, {
      withCredentials: true,
    });
    setshowaddress(res.data.msg);
    if (res.data) {
      toast.success(address.id ? "Address Updated" : "Address Created");
      setOpen(false);
      setAddress({
        addressName: "",
        street: "",
        houseno: "",
        pincode: "",
        landmark: "",
        id: "",
        phoneno: "",
      });
    }
  };

  const getAddress = async () => {
    try {
      let res = await axios.get("/get_address", { withCredentials: true });
      setuserId(res.data.msg._id);
      setshowaddress(res.data.msg.address);
    } catch (er) {
      console.log(er.message);
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
      phoneno: item.phoneno,
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
    if (res.data.msg) {
      toast.success("Address Removed");
    }
    setshowaddress(res.data.msg);
  };

  const openModal = () => {
    setAddress({
      addressName: "",
      street: "",
      houseno: "",
      pincode: "",
      landmark: "",
      id: "",
      phoneno: "",
    });

    setOpen(true);
  };

  const handleCheckout = () => {
    if (!selectedAddress) {
      toast.error("Please select address first");
    } else {
      setPaymentOpen(true);
    }
  };

  useEffect(()=>{
    if(cart && !cart[0].productId){
      let price=cart[0].productPrice;
      setTotalprice(price*Quantity);
   }
  },[Quantity]);

  useEffect(() => {
    getAddress();
    return ()=>{
       localStorage.removeItem('qt');
       setquantity(1);
    }
  }, []);
  return (
    <>
      <div className="flex justify-center bg-gray-50 p-5">
        <div className="bg-white rounded-lg shadow-lg w-full p-5 flex flex-col md:flex-row">
          {/* Shipping Address Form */}
          <div className="md:w-1/3 p-4">
            {showaddress.length < 3 && (
              <Button variant="contained" onClick={openModal}>
                Add Address
              </Button>
            )}

            {/* show address */}
            {showaddress.length > 0 &&
              showaddress.map((item, idx) => {
                return (
                  <label
                    className="flex items-center cursor-pointer a"
                    key={item._id}
                    onClick={() => setselectedAddress(item)}
                  >
                    <input type="radio" name="radio" />
                    <div className="mr-1 px-2 w-full rounded-lg bg-gray-200 shadow-lg hover:scale-105 min-h-40 mt-2 transition-transform duration-200 ease-in-out p-4">
                      <h1 className="text-black font-semibold text-lg">
                        Name: {item.name}
                      </h1>
                      <h1 className="text-black text-sm">
                        House No: {item.houseno}
                      </h1>
                      <h1 className="text-black text-sm">
                        Landmark: {item.landmark}
                      </h1>
                      <h1 className="text-black text-sm">
                        Street: {item.street}
                      </h1>
                      <h1 className="text-black text-sm">
                        Pincode: {item.pincode}
                      </h1>
                      <h1 className="text-black text-sm">
                        PhoneNo: {item.phoneno}
                      </h1>
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => removeAddress(item._id)}
                          className=" text-red-400 underline  transition duration-200"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => updateAddress(item)}
                          className=" text-blue-400  underline transition duration-200"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </label>
                );
              })}
            {/* todo need to create a seprate modal for addresss */}

            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  {address.id ? "Edit Address" : "Add Address"}
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

            <PaymentModal
              open={paymentOpen}
              onClose={() => setPaymentOpen(false)}
              // totalPrice={totalPrice}
              totalPrice={totalprice}
              cart={cart}
              address={selectedAddress}
              userId={userId}
              // quantity={quantity}
              quantity={Quantity}
            />
          </div>

          {/* Product Summary */}
          <div className="md:w-2/3 p-4">
            <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Product</th>
                   {cart&&cart[0].productId&& <th className="py-3 px-4 text-left">Quantity</th>}
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* for cart logic */}
                  {cart && cart[0].productId
                    ? cart.map((item, key) => (
                        <tr key={key} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 flex items-center">
                            <img
                              src={item.productId.productImagesurl[0]}
                              alt={item.productId.productName}
                              className="w-16 h-16 object-contain rounded mr-2"
                            />
                            <span>{item.productId.productName}</span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                          {item.quantity}
                          </td>

                          <td className="py-3 px-4 text-sm">
                            ${item.productId.productPrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            $
                            {(
                              item.quantity * item.productId.productPrice
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))
                    :
                    //  for buy logic 
                    cart.map((item, key) => (
                        <tr key={key} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 flex items-center">
                            <img
                              src={item.productImagesurl[0]}
                              alt={item.productName}
                              className="w-16 h-16 object-contain rounded mr-2"
                            />
                            <span>{item.productName}</span>
                          </td>
                          <td className="py-3 px-4 text-sm flex items-center gap-2">
                              <button 
                                disabled={Quantity === 1} 
                                onClick={()=>setquantity(Quantity-1)}
                                className={`px-3 py-1 rounded-md border ${
                                  Quantity === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}>
                                -
                              </button>
                              <span className="font-medium">{Quantity}</span>
                              <button 
                                disabled={Quantity === item.stock} 
                                onClick={()=>setquantity(Quantity+1)}
                                className={`px-3 py-1 rounded-md border ${
                                  Quantity === item.stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}>
                                +
                              </button>
                        </td>
                          {/* <td className="py-3 px-4 text-sm">
                            {quantity}
                            <button 
                            disabled={quantity === item.stock} 
                            className={`px-3 py-1 rounded-md border ${
                              quantity === item.stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}>
                            +
                          </button>
                            </td> */}
                          <td className="py-3 px-4 text-sm">
                            ${item.productPrice.toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {/* ${(quantity * item.productPrice).toFixed(1)} */}
                            ${(Quantity * item.productPrice).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between font-semibold mt-4">
              <span>Total Price:</span>
              <div className="flex flex-col">
                <span>${totalprice}</span>
                {showaddress.length > 0 && (
                  <button
                    onClick={handleCheckout}
                    className="px-2 py-1 bg-green-400 rounded-full text-white"
                  >
                    Placeorder
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
