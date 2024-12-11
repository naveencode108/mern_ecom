import { useEffect, useState } from 'react';
import axios from '../../utils/Axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';


export const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();

  const getCartData = async () => {
    const res = await axios.get('/get_cart_data', { withCredentials: true });
    if(res.data.success){
      setCart(res.data.message);
    }
  };

  const removeFromCart=async(id)=>{
        let res=await axios.post('/remove_cart_data',{_id:id},{withCredentials:true});
        setCart(res.data.cartData.cartData);
        toast.success('Product Removed');
  }

  const handleQuantity=async(id,quantity)=>{
    try{
        setLoading(true);
        const res = await axios.post("/products/add_to_cart", { productId: id, quantity }, { withCredentials: true });
        if(res.data.success){
          getCartData();
        }
        else{
           toast.error(res.data.message);
        }
    }
    catch(er){
      toast.success(er.message);
      console.log(er.message);
    }
    finally{
      setLoading(false);
    }
    
  }

  const totalPrice = cart.length>0 && cart.reduce((total, item) => total + (item.quantity * item.productId.productPrice), 0);
  
  useEffect(() => {
    getCartData();
  }, []);


  return (
    <>
    <div className="flex justify-center bg-gray-50 p-5">
      <div className="bg-white rounded-lg shadow-lg w-full p-5">
        <h1 className="text-3xl font-semibold text-center mb-5">Shopping Cart</h1>
        <hr className="border-t border-gray-300 mb-5" />

        {cart.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="overflow-x-auto w-full md:w-[80%]">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="w-full bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left text-sm">Product</th>
                    <th className="py-3 px-4 text-left text-sm">Price</th>
                    <th className="py-3 px-4 text-left text-sm">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 flex items-center">
                        <img
                          src={item.productId.productImagesurl[0]}
                          alt={item.productId.productName}
                          className="w-16 h-16 object-contain rounded mr-1"
                        />
                        <span className='text-xs flex gap-3 flex-col md:flex-row'>{item.productId.productName}
                          <button onClick={()=>removeFromCart(item.productId._id)} className='text-xs text-blue-300'>Remove</button>
                        </span>
                      </td>
                        <td className="py-3 px-4 text-sm flex items-center gap-2">
                          <button 
                            disabled={item.quantity === 1} 
                            onClick={() => handleQuantity(item.productId._id, item.quantity-1)} 
                            className={`px-3 py-1 rounded-md border ${
                              item.quantity === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}>
                            -
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button 
                            disabled={item.quantity === item.productId.stock} 
                            onClick={() => handleQuantity(item.productId._id, item.quantity+1)} 
                            className={`px-3 py-1 rounded-md border ${
                              item.quantity === item.productId.stock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}>
                            +
                          </button>
                        </td>

                      <td className="py-3 px-4 text-sm">
                        ${(item.productId.productPrice).toFixed(1) + ' * ' + (item.quantity)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        ${(item.quantity * item.productId.productPrice).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cart Summary */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md h-52 text-center w-full md:w-[20%] mt-4 md:mt-0">
              <h2 className="text-xl font-semibold">Cart Summary</h2>
              <h4 className="my-3">
                Total Price:${totalPrice}
              </h4>
              <button onClick={()=>navigate('/place_order',{state:{totalPrice,cart}})} className="px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                Place Order
              </button>
            </div>
          </div>
        ) : (
          <div className="text-2xl text-gray-500 text-center">Your cart is empty.</div>
        )}
      </div>
    </div>

    {loading&&
    <div className='w-full h-full  backdrop-blur-[2px] absolute top-0 flex justify-center items-center'>
      <CircularProgress />
    </div>
    }
    </>
  );
};
