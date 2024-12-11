import { Breadcrumbs, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/Axios';
import {toast} from 'react-toastify';

const Wishlist = () => {

  const [wishlist,setwishlist]=useState([]);
      
   const getWishlist=async()=>{
       try{
          let res=await axios.get('/get_wishlist',{withCredentials:true});
          if(res.data.success){
             setwishlist(res.data.message);
          }
       }
       catch(er){
          console.log(er.message);
       }
   }

   const handleRemove=async(id)=>{
       try{
          let res=await axios.post('/remove_wishlist',{id},{withCredentials:true});
          if(res.data.success){
             setwishlist(res.data.message);
             toast.success('Removed Successfully');
          }
       }catch(er){
           console.log(er.message);
       }
   }

   const handleCart=async(productId,quantity)=>{
        try{ 
             let res=await axios.post('/products/add_to_cart',{productId,quantity},{withCredentials:true});
             if(res.data.success){
                toast.success(res.data.message);
             }
        }
        catch(er){
          console.log(er.message);
          toast.error(er.message);
        }
   }
     
     
   useEffect(()=>{
         getWishlist();
   },[]);

 
  return (
    <div className="p-10">
      {/* Breadcrumbs */}
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link underline="hover" key="1" color="inherit" to="/account">
            Your account
          </Link>

          <Typography key="3" sx={{ color: 'text.primary' }}>
            Your Wishlist
          </Typography>
        </Breadcrumbs>
      </Stack>

      {/* Wishlist products */}
      <div className="mt-5">
         <h1 className='text-3xl border-b-2 border-black'>WishList</h1>
        {wishlist.length>0?
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {wishlist.map((item,index)=>{
               return (<div key={index} className="bg-white shadow-lg p-4 rounded-lg">
                <div className='flex justify-center items-center'>
                <img src={item.productId.productImagesurl[0]} alt={item.productId.productImagesurl} loading='lazy'  className="w-1/2 h-40 object-cover mb-4" />
                </div>
                <p className='text-center my-3 underline font-bold'>
                  {item.productId.productName}
                </p>

                <div className="flex justify-between items-center">
                  {item.productId.stock>0?
                    <button onClick={()=>handleCart(item.productId._id,1)} className='text-sm md:text-md font-semibold px-2 py-1 rounded-full bg-sky-500 text-white'>AddtoCart</button>
                  :<p className='text-red-500'>Out of Stock</p>}
                  <button onClick={()=>handleRemove(item.productId._id)} className='text-sm md:text-md font-semibold px-2 py-1 rounded-full bg-sky-500 text-white'>Remove</button>
                </div>
              </div>)
          })}
          </div>
          :
          <Typography variant="h5" className="text-center mt-10">
            Your wishlist is empty
          </Typography>
          }
      </div>
    </div>
  );
};

export default Wishlist;
