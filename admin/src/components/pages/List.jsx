import { useEffect, useState } from "react";
import axios from "../../utils/Axios";
import { toast } from "react-toastify"; // Assuming you're using toast for notifications
import ListModal from "./ListModal";

export const List = () => {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(4); // You can adjust this value

  // --------------------
  const [productname, setProductname] = useState("");
  const [productdesc, setProductdesc] = useState("");
  const [productprice, setProductprice] = useState(null);
  const [productstock, setProductstock] = useState(null);
  const [productcategory, setProductcategory] = useState("");
  const [productimages, setProductimages] = useState([]);
  const [productid,setProductid]=useState('');

  const getProductList = async () => {
    try {
      const res = await axios.get("/products/list", { withCredentials: true });
      setProduct(res.data.message);
    } catch (er) {
      console.log(er.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id) => {
    let val = product.filter((item) => item._id == id);
    setProductid(id);
    setProductname(val[0].productName);
    setProductdesc(val[0].productDesc);
    setProductprice(val[0].productPrice);
    setProductstock(val[0].stock);
    setProductcategory(val[0].category);
    setProductimages(val[0].productImagesurl);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.post(
        "/products/remove",
        { _id: id },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        getProductList(); // Refresh the product list after deletion
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductList();
  }, [!open]);

  // Calculate total pages
  const totalPages = Math.ceil(product.length / productsPerPage);
  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = product.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      {isLoading ? (
        <h1 className="w-full h-full bg-black text-white text-4xl flex justify-center items-center">
          Loading..
        </h1>
      ) : (
        <>
          <div className="w-full h-full py-10">
            <h1 className="text-3xl text-center">List of Products</h1>
            <hr className="border border-black" />

            <div className="w-full h-full border py-2 px-2">
              {currentProducts && currentProducts.length ? (
                currentProducts.map((item, index) => (
                  <div key={index} className="flex flex-col border-b py-2 mt-6">
                    <div className="flex items-center">
                      {item.productImagesurl &&
                      item.productImagesurl.length > 0 ? (
                        <img
                          className="w-12 rounded-md h-12 object-cover mr-4"
                          src={item.productImagesurl[0]}
                          alt={item.productName}
                        />
                      ) : (
                        <div className="w-12 rounded-md h-12 bg-gray-300 mr-4 flex items-center justify-center">
                          <p className="text-[10px]">No image available</p>
                        </div>
                      )}
                      <div className="flex-1">
                        <h1 className="text-black text-lg font-semibold">
                          {item.productName}
                        </h1>
                        <p className="text-gray-600">
                          Price: ${item.productPrice}
                        </p>
                        <p className="text-gray-600">Stock: {item.stock}</p>
                        <p className="text-gray-600">
                          Description: {item.productDesc}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h1 className="text-4xl flex justify-center items-center">
                  No Product found !!
                </h1>
              )}
            </div>

            {/* Pagination Controls */}

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-4">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <ListModal
           open={open}
           setOpen={setOpen}
           productname={productname}
           setProductname={setProductname}
           productdesc={productdesc}
           setProductdesc={setProductdesc}
           productprice={productprice}
           setProductprice={setProductprice}
           productstock={productstock}
           setProductstock={setProductstock}
           productimages={productimages}
           setProductimages={setProductimages}
           productcategory={productcategory}
           setProductcategory={setProductcategory}
           productid={productid}
          />
        </>
      )}
    </>
  );
};
