import { useEffect, useState } from "react";
import axios from "../../utils/Axios";
import { toast } from "react-toastify";
import {Modal,Box, Button} from '@mui/material';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isUpdated, setisupdated] = useState(false);
  const [open,setOpen]=useState(false);
  const [selectedOrder,setselectedorder]=useState(); 

  const fetchOrders = async () => {
    try {
      let res = await axios.get("/order/get_all_orders", {
        withCredentials: true,
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (er) {
      console.log(er.message);
    }
  };

  const handleUpdate = async (e, id) => {
    setisupdated(false);
    let status = e.target.value;
    try {
      let res = await axios.post(
        "/order/update_order_status",
        { status, id },
        { withCredentials: true }
      );
      console.log(res);
      if (res.data.success) {
        setisupdated(true);
        toast.success("Status changed");
      }
    } catch (er) {
      console.log(er.message);
    }
  };

  const handleOpen=(data)=>{
    setselectedorder(data);
    setOpen(true);
  }

  useEffect(() => {
    fetchOrders();
  }, [isUpdated]);

  return (
    <>
    <div className="w-full px-2 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Customer Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {order._id}
                </td>
                <td className="border capitalize border-gray-300 px-4 py-2">
                  {order.address.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ${order.totalPrice}
                </td>
                <td className="border capitalize border-gray-300 px-4 py-2">
                  {order.orderStatus}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleUpdate(e, order._id)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    {/* <option value="Cancelled">Cancelled</option> */}
                  </select>
                  <button onClick={()=>handleOpen(order)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <Modal open={open} onClose={()=>setOpen(false)}>
          <Box sx={style}>
            <h2 className="text-xl font-bold">Customer Order Details</h2>
            <hr className="bg-black w-full"/>
            <div className="flex flex-col my-2">
              <div className="flex justify-between items-center gap-2">
                <p className="font-semibold">
                  Order ID:
                </p>
                <p className="text-sm">{selectedOrder&&selectedOrder._id}</p>
              </div>
              <div className="flex justify-between my-2">
                <p className="font-semibold">
                  Order Status:
                </p>
                <p className={`${selectedOrder&&selectedOrder.orderStatus=='delivered'?'capitalize bg-green-500 rounded-full px-2 text-white':'capitalize bg-red-500 rounded-full px-2 text-white'}`}>{selectedOrder&&selectedOrder.orderStatus}</p>
              </div>
              <div className=" justify-between my-2">
                <p className="font-semibold">
                  Shipping Address:
                </p>
                <p className="text-sm capitalize font-medium"><b>Name:</b>{selectedOrder&&selectedOrder.address.name}</p>
                <p className="text-sm capitalize font-medium"><b>Houseno:</b>{selectedOrder&&selectedOrder.address.houseno}</p>
                <p className="text-sm capitalize font-medium"><b>Landmark:</b>{selectedOrder&&selectedOrder.address.landmark}</p>
                <p className="text-sm capitalize font-medium"><b>Pincode:</b>{selectedOrder&&selectedOrder.address.pincode}</p>
                <p className="text-sm capitalize font-medium"><b>Street:</b>{selectedOrder&&selectedOrder.address.street}</p>
              </div>
              <div className="flex justify-between my-2">
                <p className="font-semibold">
                  Payment Status:
                </p>
                <p>{selectedOrder&&selectedOrder.paymentStatus}</p>
              </div>
              <div className=" my-2">
                <p className="font-semibold">
                  Products:
                </p>
                <div>
                  {selectedOrder&&selectedOrder.Products.map((item,index)=>
                    <div key={index} className="flex justify-between" >
                      <img src={item.productImagesurl} className="w-12 h-12 object-contain" alt="" />
                      <p className="text-sm"> {item.productName} <span className="block text-right">{item.productPrice}</span></p>
                   </div>
                   )} 
                </div>
              </div>
              <hr />
              <div className="flex justify-between">
                  <p className="font-semibold">TotalPrice</p>
                   <p>{selectedOrder&&selectedOrder.totalPrice}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={()=>setOpen(false)}>Close</Button>
            </div>
          </Box>
      </Modal>
    </>
  );
};
