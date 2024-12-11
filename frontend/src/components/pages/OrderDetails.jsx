import {
    Box,
    Button,
    capitalize,
    Modal,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from "@mui/material";
import { Table } from "@mui/material";


const OrderDetails = ({orders,open,orderItem,handleModal,setopen,style}) => {
  return (
    <>
        {orders ? (
          <div className="w-full py-2">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {" "}
                      <span className="font-bold "> # Order ID</span>
                    </TableCell>
                    <TableCell>
                      {" "}
                      <span className="font-bold"> Order Status</span>
                    </TableCell>
                    <TableCell>
                      {" "}
                      <span className="font-bold"> Payment Status</span>
                    </TableCell>
                    <TableCell>
                      {" "}
                      <span className="font-bold"> TotalPrice</span>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((item, index) => {
                    return (
                      <TableRow key={index} className="hover:bg-zinc-300">
                        <TableCell>{item._id}</TableCell>
                        <TableCell sx={{textTransform:'capitalize'}}>{item.orderStatus=='delivered'?item.orderStatus+ '✔':item.orderStatus+'..'}</TableCell>
                        <TableCell>{item.paymentStatus}</TableCell>
                        <TableCell>${item.totalPrice}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleModal(item)}
                            className="px-2 py-1 bg-blue-400 text-white rounded-full"
                          >
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : (
          <div className="text-3xl text-zinc-300 my-10">Orders not Found</div>
        )}

      <Modal open={open} onClose={() => setopen(false)}>
          <Box sx={style}>
            <h2 className="text-2xl font-bold">Order Details</h2>
            <hr className="bg-black w-full"/>
            <div className="flex flex-col my-2">
              <div className="flex justify-between items-center gap-2">
                <p className="font-semibold">
                  Order ID:
                </p>
                <p className="text-sm">{orderItem&&orderItem._id}</p>
              </div>
              <div className="flex justify-between my-2">
                <p className="font-semibold">
                  Order Status:
                </p>
                <p className={`${orderItem&&orderItem.orderStatus=='delivered'?'capitalize bg-green-500 rounded-full px-2 text-white':'capitalize bg-red-500 rounded-full px-2 text-white'}`}>{orderItem&&orderItem.orderStatus}</p>
              </div>
              <div className=" justify-between my-2">
                <p className="font-semibold">
                  Shipping Address:
                </p>
                <p className="text-sm">{orderItem&&orderItem.address.name}</p>
                <p className="text-sm">{orderItem&&orderItem.address.houseno}</p>
                <p className="text-sm">{orderItem&&orderItem.address.landmark}</p>
                <p className="text-sm">{orderItem&&orderItem.address.pincode}</p>
                <p className="text-sm">{orderItem&&orderItem.address.street}</p>
              </div>
              <div className="flex justify-between my-2">
                <p className="font-semibold">
                  Payment Status:
                </p>
                <p>{orderItem&&orderItem.paymentStatus}</p>
              </div>
              <div className=" my-2">
                <p className="font-semibold">
                  Products:
                </p>
                <div>
                  {orderItem&&orderItem.Products.map((item,index)=>
                    <div className="flex justify-between" key={index}>
                      <img src={item.productImagesurl} className="w-12 h-12 object-contain" alt="" />
                      <p className="text-sm"> {item.productName} <span className="block text-right">${item.productPrice}</span></p>
                   </div>
                  )}
                </div>
              </div>
              <hr />
              <div className="flex justify-between">
                  <p className="font-semibold">TotalPrice</p>
                   <p>${orderItem&&orderItem.totalPrice}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={() => setopen(false)}>Close</Button>
            </div>
          </Box>
      </Modal>
    </>
  );
};

export default OrderDetails;
