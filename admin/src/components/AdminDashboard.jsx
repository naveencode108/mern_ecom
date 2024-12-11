import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Add } from "./pages/Add";
import { List } from "./pages/List";
import { Order } from "./pages/Order";
import { User } from "./pages/User";

export const AdminDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="w-full flex">
        <Sidebar />
        <div className="w-full "> 
          <Routes>
            {/* <Route path='/add' element={<Add />} /> */}
            <Route path='/list' element={<List />} />
            <Route path='/order' element={<Order />} />
            <Route path='/users' element={<User />} />
          </Routes>
        </div>
      </div>
    </>
  );
};
