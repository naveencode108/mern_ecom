import { useEffect, useState } from "react";
import axios from "../../utils/Axios";
import { toast } from "react-toastify";

export const User = () => {
  const [user, setuser] = useState();
  const isSuperAdmin=localStorage.getItem('isSuperAdmin');

  const getUser = async () => {
    try {
      const user = await axios.get("/get_user", { withCredentials: true });

      if (user.data.success) {
        setuser(user.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRole = async (role, id) => {
    try {
      const res = await axios.post(
        "/update_user",
        { _id: id, role },
        { withCredentials: true }
      );

      if (res.data.success) {
        setuser((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, role: role } : user
          )
        );
      }
    } catch (er) {
      toast.error(er.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
    
  return (
    <div className="w-full min-h-screen bg-white py-10">
      <h1 className="text-4xl text-center">User List</h1>
      <hr className="w-full border border-black" />
      {user && user.length ? (
        user.map((item, key) => (
          <div
            key={key}
            className="flex items-center justify-between border-b py-4 mb-2 px-5"
          >
            <div className="flex-1">
              <h1 className="text-lg font-semibold">User Name: {item.name}</h1>
              <p className="text-gray-600">Email: {item.email}</p>
              {isSuperAdmin&&isSuperAdmin==='true'?
              <div className="flex items-center">
                <span className="mr-2">Role:</span>
                <select
                  value={item.role}
                  onChange={(e) => handleRole(e.target.value, item._id)}
                  className="border rounded-md p-1"
                  >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
             :''}
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-4xl flex justify-center items-center">
          No Users Found
        </h1>
      )}
    </div>
  );
  
 
};
