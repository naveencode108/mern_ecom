import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/Axios";
import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdFavoriteBorder } from "react-icons/md";
// import Review from "./pages/Review";
import { Card } from "./Card";
import { useContext } from "react";
import { QuantityContext } from "../context/Mycontext";


const Review=lazy(()=>import("./pages/Review"));

export const Show = () => {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [mainImage, setMainImage] = useState();
  // const [quantity, setQuantity] = useState(1);
  const [loadingButton, setLoadingButton] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [starRating, setstarRating] = useState(0);
    
  const {Quantity,setquantity}=useContext(QuantityContext);



  const fetchProduct = async (id) => {
    try {
      const res = await axios.post("/products/show_product_by_id", { _id: id });
      if (res.data.success) {
        const product = res.data.product[0];
        setProducts([product]);
        setProductImages(product.productImagesurl);
        setMainImage(product.productImagesurl[0]);

        // Fetch related products
        const relatedRes = await axios.post("/products/get_product_by_category", { category: product.category });
        const filteredProducts = relatedRes.data.message.filter(item => item._id !== id);
        setRelatedProducts(filteredProducts);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const addToCart = async (id) => {
    if (!sessionStorage.getItem("login_token")) {
      toast.error("You need to login first.");
      return;
    }
    setLoadingButton(true);
    try {
      // const res = await axios.post("/products/add_to_cart", { productId: id, quantity }, { withCredentials: true });
      const res = await axios.post("/products/add_to_cart", { productId: id, quantity:Quantity }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoadingButton(false);
  };

  const addToWishlist = async () => {
    try {
      const res = await axios.post("/add_wishlist", { id: productId }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
      }
      else{
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

 
 
  useEffect(() => {
    fetchProduct(productId);
    window.scrollTo(0, 0);

    return ()=>{
      setquantity(1);
      localStorage.removeItem('qt');
    }
  }, [productId]);
    
  // const totalPrice = products[0]?.productPrice * quantity;
  const totalPrice = products[0]?.productPrice * Quantity;

  return (
    <div className="py-8 px-4 lg:px-16 bg-gray-50">
      {products.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <span className="text-3xl font-semibold text-gray-600">Loading...</span>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
          {/* Product Display Section */}
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Product Thumbnails */}
            <div className="flex lg:flex-col gap-3">
              {productImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  onMouseEnter={() => setMainImage(img)}
                  className="w-16 h-16 border border-gray-300 rounded-lg cursor-pointer hover:shadow-md"
                  alt={`Product ${idx}`}
                />
              ))}
            </div>

            {/* Main Product Image */}
            {mainImage && (
              <img
                src={mainImage}
                alt="Main Product"
                className="w-full lg:w-1/2 max-h-96 object-contain rounded-xl shadow-lg"
              />
            )}

            {/* Product Information */}
            <div className="w-full lg:w-1/2 space-y-4">
              <h1 className="text-3xl font-semibold">{products[0].productName}</h1>
              <p className="text-gray-600">{products[0].productDesc}</p>

              {/* <p>{''.repeat(products[0].reviews[0].rating)}</p> */}
              <p>{"⭐".repeat(starRating&&starRating)}</p>
              <div className="text-xl font-semibold text-teal-600">
                ${products[0].productPrice}
              </div>

              {/* Quantity Selector and Actions */}
              {products[0].stock > 0 ? (
                <div className="flex flex-col space-y-3">
                  <label className="text-gray-700">Quantity:</label>
                  <select
                    className="w-20 p-2 border border-gray-300 rounded-md"
                    // onChange={(e) => setQuantity(e.target.value)}
                    onChange={(e) => setquantity(parseInt(e.target.value))}
                  >
                    {Array.from({ length: products[0].stock }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-4">
                    <button
                      onClick={() => addToCart(productId)}
                      disabled={loadingButton}
                      className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600"
                    >
                      Add to Cart
                    </button>
                    <button
                      // onClick={() => navigate("/place_order", { state: { totalPrice, cart: products, quantity } })}
                      onClick={() =>{
                        if (sessionStorage.getItem("login_token")) {
                             navigate("/place_order", { state: { totalPrice, cart: products } })
                          }
                          else{
                            toast.error("You need to login first");
                          }
                        }
                      } 
                      className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-red-600">Out of Stock</div>
              )}
              <button
                onClick={addToWishlist}
                className="flex items-center gap-2 mt-4 px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
              >
                <MdFavoriteBorder />
                Add to Wishlist
              </button>
            </div>
          </div>
          {/* Product Reviews */}

       <Suspense fallback={<div className="w-full h-full text-center text-4xl">Loading..</div>}>
          <Review productId={productId} setstarRating={setstarRating} />
       </Suspense>

          {/* Related Products */}

          <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b-2 border-black">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((product, idx) => (
              <Card
                key={idx}
                id={product._id}
                productImagesurl={product.productImagesurl}
                productName={product.productName}
                productPrice={product.productPrice}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
