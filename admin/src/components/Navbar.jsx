import { useDispatch } from "react-redux"
import { adminLogout } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const Logout=()=>{
       localStorage.removeItem('isSuperAdmin');
       dispatch(adminLogout());
       navigate('/login');
    }

  return (
    <>
    <div className='w-full flex px-10 justify-between items-center bg-black text-white py-5'>
           <h1 className='text-2xl'>AdminPanel</h1>
           <button className='text-xl bg-white text-black rounded-full px-3 py-1'
           onClick={Logout}
           >Logout</button>
    </div>
    </>
  )
}

export default Navbar
