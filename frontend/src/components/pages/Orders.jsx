import { lazy, Suspense, useEffect, useState } from "react";
import axios from "../../utils/Axios";
import { Breadcrumbs, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const OrderDetails = lazy(() => import("./OrderDetails"));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Orders = () => {
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" to="/account">
      Your account
    </Link>,

    <Typography key="3" sx={{ color: "text.primary" }}>
      Your orders
    </Typography>,
  ];
  const [orders, setorders] = useState([]);
  const [open, setopen] = useState(false);
  const [orderItem, setorderItem] = useState();

  const getOrders = async () => {
    try {
      let res = await axios.get("/order/get_orders", { withCredentials: true });
      if (res.data) {
        setorders(res.data.msg);
      }
    } catch (er) {
      console.log(er.message);
    }
  };

  const handleModal = (item) => {
    setopen(true);
    setorderItem(item);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <div className="px-20 h-full">
        <div className=" px-2 py-2">
          <Stack spacing={2}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Stack>
        </div>

        <div className="mt-2 border px-10 shadow-lg rounded-xl">
          <h1 className="text-3xl my-2 underline">Orders History</h1>
          {orders && orders.length > 0 ? (
            <Suspense
              fallback={
                <div className="w-full h-full flex justify-center items-center text-sm md:text-2xl">
                  Loading..
                </div>
              }
            >
              <OrderDetails
                orders={orders}
                open={open}
                orderItem={orderItem}
                handleModal={handleModal}
                setopen={setopen}
                style={style}
              />
            </Suspense>
          ) : (
            <div className="w-full h-full flex justify-center items-center text-sm md:text-2xl">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
