import { Box, Modal, Typography, Button,CircularProgress } from "@mui/material";
import axios from '../../utils/Axios'
import { useState } from "react";
import { toast } from "react-toastify";

const ListModal = ({
  open,
  setOpen,
  productname,
  setProductname,
  productdesc,
  setProductdesc,
  productprice,
  setProductprice,
  productstock,
  setProductstock,
  productcategory,
  setProductcategory,
  productimages,
  setProductimages,
  productid
}) => {

  const [errors,seterrors]=useState({
     nameerror:'',
     descerror:'',
     priceerror:'',
     stockerror:''
  })

  const [loading,setLoading]=useState(false);

  const submit = async(e) => {
    e.preventDefault();

    seterrors({
      nameerror:'',
      descerror:'',
      priceerror:'',
      stockerror:''
    })

    let flag=false;
     
    if(productname==''){
        seterrors((prev)=>({...prev,nameerror:'ProductName is Required'}));
        flag=true;
      }
      if(productdesc==''){
        seterrors((prev)=>({...prev,descerror:'ProductDecription is Required'}));
        flag=true;
      }
      if(productprice==''){
        seterrors((prev)=>({...prev,priceerror:'ProductPrice is Required'}));
        flag=true;
      }
      if(productstock==''){
        seterrors((prev)=>({...prev,stockerror:'ProductStock is Required'}));
        flag=true;
    }

    if(flag==false){
    const formData=new FormData();
    formData.append('productname',productname);
    formData.append('productdesc',productdesc);
    formData.append('productprice',productprice);
    formData.append('productstock',productstock);
    formData.append('productcategory',productcategory);
    formData.append('productimages',productimages);
    formData.append('productid',productid);
    
    let image=e.target.image.files;
    if(image.length>0){
      image=[...image];
        image.forEach(data=>formData.append('image',data));
    }

     try{
         setLoading(true);
        let res=await axios.post('/products/edit_product',formData,{withCredentials:true});
        if(res.data.success){
          toast.success("Product Updated");
          setOpen(false);
        }
     }
     catch(er){
      console.log(er.message);
     }
     finally{
       setLoading(false);
     }
    }
  };


  return (
    <>
      <Modal open={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            maxWidth: 1200,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Edit Product
          </Typography>

          <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            encType="multipart/form-data"
          >
            {/* Product Name */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="productname"
              >
                Product Name
              </label>
              <input
                type="text"
                disabled={loading?true:false}
                id="productname"
                value={productname}
                onChange={(e) => setProductname(e.target.value)}
                className="p-2 border rounded-md w-full border-gray-300"
              />
              <span className="text-red-500 text-sm">{errors.nameerror&&errors.nameerror}</span>
            </div>

            {/* Product Description */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="productdesc"
              >
                Product Description
              </label>
              <textarea
                disabled={loading?true:false}
                id="productdesc"
                value={productdesc}
                onChange={(e) => setProductdesc(e.target.value)}
                className="p-2 border rounded-md w-full resize-none border-gray-300"
              />
               <span className="text-red-500 text-sm">{errors.descerror&&errors.descerror}</span>
            </div>

            {/* Product Price */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="productprice"
              >
                Product Price
              </label>
              <input
                disabled={loading?true:false}
                type="number"
                id="productprice"
                value={productprice}
                onChange={(e) => setProductprice(e.target.value)}
                className="p-2 border rounded-md w-full border-gray-300"
              />
               <span className="text-red-500 text-sm">{errors.priceerror&&errors.priceerror}</span>
            </div>

            {/* Stock */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="productstock"
              >
                Stock
              </label>
              <input
                disabled={loading?true:false}
                type="number"
                id="productstock"
                value={productstock}
                onChange={(e) => setProductstock(e.target.value)}
                className="p-2 border rounded-md w-full border-gray-300"
              />
               <span className="text-red-500 text-sm">{errors.stockerror&&errors.stockerror}</span>
            </div>

            {/* Category */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="productcategory"
              >
                Category
              </label>
              <select
                id="productcategory"
                disabled={loading?true:false}
                value={productcategory}
                onChange={(e) => setProductcategory(e.target.value)}
                className="p-2 border rounded-md w-full border-gray-300"
              >
                <option value="electronics">Electronics</option>
                <option value="home-appliance">Home Appliances</option>
                <option value="laptop">Laptops</option>
                <option value="mobile">Mobiles</option>
              </select>
            </div>

            {/* Product Image */}
            
            <div className="md:col-span-2">
            <div className="flex">
              {productimages.length>0&&productimages.map((item,key)=>(
                <div key={key} className="relative">
                 <img className="w-20 h-20 object-cover" src={item} />
                 {productimages.length>1&&!loading&&
                 <span className="cursor-pointer absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-sm" 
                 onClick={()=>setProductimages(productimages.filter(data=>data!==item))}>✕</span>
                }
                </div>
              ))}
            </div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="image"
              >
                Product Image
              </label>
              <input
                disabled={loading?true:false}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                multiple
                className="p-2 border rounded-md w-full border-gray-300"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <Button disabled={loading?true:false} onClick={() => setOpen(false)} color="error">
                Close
              </Button>
              <Button disabled={loading?true:false} variant="contained" type="submit">
               {loading?<CircularProgress color="primary" size={20} />:'Save'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ListModal;
