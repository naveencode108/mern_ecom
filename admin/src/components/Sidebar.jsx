import {NavLink} from 'react-router-dom'
import { IoIosAddCircleOutline } from "react-icons/io";
import { GiHistogram } from "react-icons/gi";
import { CiViewList } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";

const Sidebar = () => {
  return (
   <>

    <div className='w-[20%] bg-white min-h-screen border'>
         <div className='flex flex-col gap-4 pt-6 text-lg px-2'>
             <NavLink to='/add' className='border rounded-lg py-2  text-center'>
                <p className='flex justify-center items-center'><IoIosAddCircleOutline size={25}/>Add product</p>
             </NavLink>
             <NavLink to='/list' className='border rounded-lg py-2  text-center'>
                <p className='flex justify-center items-center'><CiViewList size={25}/>List product</p>
             </NavLink>
             <NavLink to='/order' className='border rounded-lg py-2  text-center'>
                <p className='flex justify-center items-center'><GiHistogram size={20}/>Orders</p>
             </NavLink>
             <NavLink to='/users' className='border rounded-lg py-2  text-center'>
                <p className='flex justify-center items-center'><FaRegUser size={20}/>users</p>
             </NavLink>
         </div>
    </div>
    </>
  )
}

export default Sidebar
