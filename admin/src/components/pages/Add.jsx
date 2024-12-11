import { useForm } from "react-hook-form";
import axios from "../../utils/Axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export const Add = () => {
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
   
    const formData = new FormData();

    formData.append("productName", data.productName);
    formData.append("productDesc", data.productDesc)
    formData.append("productPrice", data.productPrice);
    formData.append("stock", data.stock);
    formData.append("category", data.category);
   
    if (data.image && data.image.length > 0) {
      for (let i = 0; i < data.image.length; i++) {
          formData.append("image", data.image[i]); 
      }
  }
   

    try {
      setisLoading(true);
      const res = await axios.post('/products/add', formData, {
        withCredentials: true,
      });
      setisLoading(true);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/list');
      }
      else {
        toast.error(res.data.message);
      }
    }
    catch (er) {
      console.log(er.message);
      toast.error(er.message);
    } finally{
       setisLoading(false);
    }
  };


  return (
    <>
      <div className="w-full bg-white shadow-md rounded-md relative">
        {isLoading?
         <div className="w-full rounded-md h-[100vh] flex bg-black bg-opacity-50 justify-center items-center text-5xl">Adding..</div>
         : 
         <>
        <h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="productName">
              Product Name
            </label>
            <input
              type="text"
              {...register("productName", {
                required: "Product Name is required",
              })}
              className={`mt-1 p-2 border rounded-md w-full ${errors.productName ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.productName && (
              <p className="text-red-500">{errors.productName.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="productDesc">
              Product Description
            </label>
            <textarea
              {...register("productDesc", {
                required: "Product Description is required",
              })}
              className={`mt-1 p-2 border rounded-md w-full ${errors.productDesc ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.productDesc && (
              <p className="text-red-500">{errors.productDesc.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="productPrice">
              Product Price
            </label>
            <input
              type="number"
              {...register("productPrice", {
                required: "Product Price is required",
                min: 0,
              })}
              className={`mt-1 p-2 border rounded-md w-full ${errors.productPrice ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.productPrice && (
              <p className="text-red-500">{errors.productPrice.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="stock">
              Stock
            </label>
            <input
              type="number"
              {...register("stock", { required: "Stock is required", min: 1 })}
              className={`mt-1 p-2 border rounded-md w-full ${errors.stock ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.stock && (
              <p className="text-red-500">{errors.stock.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="category">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`mt-1 p-2 border rounded-md w-full ${errors.category ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="home-appliance">Home Appliances</option>
              <option value="laptop">Laptops</option>
              <option value="mobile">Mobiles</option>
            </select>
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="image">
              Product Image 
            </label>
            <input
              type="file"
              {...register("image", { required: "Image  is required" })}
              accept="image/*"
              multiple
              className={`mt-1 border rounded-md w-full ${errors.image ? "border-red-500" : "border-gray-300"
                }`}
            />
            {errors.image1 && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Product
          </button>
        </form>
          </>
         }
      </div>
    </>
  );
};


