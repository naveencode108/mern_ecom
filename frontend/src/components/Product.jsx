// import { useEffect, useState } from "react";
// import axios from "../utils/Axios";
// import { Link, useLocation } from "react-router-dom";

// export const Product = () => {
//   const [category, setCategory] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [search, setsearch] = useState([]);

//   const location = useLocation();
//   const categories = location.search;

//   const fetchProduct = async () => {
//     if (categories == "") {
//       try {
//         const res = await axios.get("/products/get_all_product", {
//           withCredentials: true,
//         });
//         if (res.data.success) {
//           let val = Array.from(
//             new Set(res.data.message.map((item) => item.category))
//           );
//           setCategory(val);
//           setProducts(res.data.message);
//         }
//       } catch (er) {
//         console.log(er.message);
//       }
//     }
//     else{
//       let resp = await axios.post("/products/get_product_by_category", {
//         category: categories.split('?')[1],
//       });
  
//       if (resp.data.success) {
//         setProducts(resp.data.message);
//       }
//     }
//   };

//   const filterProduct = async (val) => {
//     let resp = await axios.post("/products/get_product_by_category", {
//       category: val,
//     });

//     if (resp.data.success) {
//       setProducts(resp.data.message);
//     }
//   };

//   const searchProduct = async (e) => {
//     let name = e.target.value;
//     let res = await axios.post("/products/show_product_by_name", { name });
//     setsearch(res.data.message);
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [categories]);

//   return (
//     <div className="flex w-full h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-72 bg-black h-full text-white p-4">
//         <div className="flex justify-center items-center mb-4">
//           <input
//             type="search"
//             placeholder="Search here"
//             onChange={searchProduct}
//             className="w-full rounded-lg py-2 px-2 text-black outline-none"
//           />
//         </div>

//         {search.length > 0 && (
//           <div className="w-full min-h-10 border px-3 rounded-xl">
//             {search.map((item, key) => (
//               <div key={key}>
//                 <Link
//                   to={`/showproduct/${item._id}`}
//                   className="flex items-center transition-all duration-300 gap-2 my-1 py-2 hover:bg-white rounded-lg hover:text-black"
//                 >
//                   <img
//                     className="w-10 h-7 object-cover"
//                     src={item.productImagesurl[0]}
//                     alt={item.productName}
//                   />
//                   <h1 className="text-sm">{item.productName}</h1>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Filters */}
//         <div>
//           <h1 className="text-center text-2xl border-b-2 mb-4">Filters</h1>
//           {/* Category Filter */}
//           <div className="mb-4">
//             <select
//               className="bg-black text-white w-full capitalize"
//               onChange={(e) => filterProduct(e.target.value)}
//             >
//               <option value="">All Products</option>
//               {category.map((item, key) => (
//                 <option key={key} value={item}>
//                   {item}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Products Display */}
//       {products.length > 0 ? (
//         <div
//           className="flex-1 p-4 overflow-y-auto"
//           style={{ maxHeight: "calc(100vh - 100px)", scrollbarWidth: "none" }}
//         >
//           <h1 className="text-2xl mb-4 border-b-2 border-black">Products</h1>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {products.map((product) => (
//               <Link
//                 to={`/showproduct/${product._id}`}
//                 key={product._id}
//                 className="border border-gray-300 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
//               >
//                 <div className="flex justify-center items-center">
//                   <img
//                     src={product.productImagesurl[0]}
//                     alt={product.productName}
//                     className="h-48 object-cover"
//                   />
//                 </div>
//                 <div className="p-4">
//                   <h2 className="text-lg font-semibold mb-2">
//                     {product.productName}
//                   </h2>
//                   <p className="text-gray-600 text-xl font-bold">
//                     ${product.productPrice}
//                   </p>
//                   <button className="mt-2 bg-blue-500 text-white rounded py-2 px-4 transition-colors duration-200 hover:bg-blue-600">
//                     Add to Cart
//                   </button>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="w-full h-full bg-black text-white text-4xl flex justify-center items-center">
//           Loading..
//         </div>
//       )}
//     </div>
//   );
// };


import { useEffect, useState } from "react";
import axios from "../utils/Axios";
import { Link, useLocation } from "react-router-dom";

export const Product = () => {
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const location = useLocation();
  const categories = location.search;

  const fetchProduct = async () => {
    if (categories === "") {
      try {
        const res = await axios.get("/products/get_all_product", {
          withCredentials: true,
        });
        if (res.data.success) {
          let val = Array.from(
            new Set(res.data.message.map((item) => item.category))
          );
          setCategory(val);
          setProducts(res.data.message);
        }
      } catch (er) {
        console.log(er.message);
      }
    } else {
      let resp = await axios.post("/products/get_product_by_category", {
        category: categories.split("?")[1],
      });

      if (resp.data.success) {
        setProducts(resp.data.message);
      }
    }
  };

  const filterProduct = async (val) => {
    let resp = await axios.post("/products/get_product_by_category", {
      category: val,
    });

    if (resp.data.success) {
      setProducts(resp.data.message);
    }
  };

  const searchProduct = async (e) => {
    let name = e.target.value;
    let res = await axios.post("/products/show_product_by_name", { name });
    setSearch(res.data.message);
  };

  useEffect(() => {
    fetchProduct();
  }, [categories]);

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* Button to toggle sidebar */}
      <div className="h-12">
      <button
        className="w-full fixed top-20 left-4 z-40 bg-blue-500 text-white p-2 rounded-md md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
        {isSidebarOpen ? "Close" : "Menu"}
      </button>
        </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black text-white p-4 z-50 transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0 md:w-64`}
      >
        <div className="flex justify-center items-center mb-4">
          <input
            type="search"
            placeholder="Search here"
            onChange={searchProduct}
            className="w-full rounded-lg py-2 px-2 text-black outline-none"
          />
        </div>

        {search.length > 0 && (
          <div className="w-full min-h-10 border px-3 rounded-xl">
            {search.map((item, key) => (
              <div key={key}>
                <Link
                  to={`/showproduct/${item._id}`}
                  className="flex items-center transition-all duration-300 gap-2 my-1 py-2 hover:bg-white rounded-lg hover:text-black"
                >
                  <img
                    className="w-10 h-7 object-cover"
                    src={item.productImagesurl[0]}
                    alt={item.productName}
                  />
                  <h1 className="text-sm">{item.productName}</h1>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div>
          <h1 className="text-center text-2xl border-b-2 mb-4">Filters</h1>
          <div className="mb-4">
            <select
              className="bg-black text-white w-full capitalize"
              onChange={(e) => filterProduct(e.target.value)}
            >
              <option value="">All Products</option>
              {category.map((item, key) => (
                <option key={key} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overlay for sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Products Display */}
      {products.length > 0 ? (
        <div
          className="flex-1 p-4 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 100px)", scrollbarWidth: "none" }}
        >
          <h1 className="text-2xl mb-4 border-b-2 border-black">Products</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/showproduct/${product._id}`}
                key={product._id}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              >
                <div className="flex justify-center items-center">
                  <img
                    src={product.productImagesurl[0]}
                    alt={product.productName}
                    className="h-48 object-cover w-full"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">
                    {product.productName}
                  </h2>
                  <p className="text-gray-600 text-xl font-bold">
                    ${product.productPrice}
                  </p>
                  <button className="mt-2 bg-blue-500 text-white rounded py-2 px-4 transition-colors duration-200 hover:bg-blue-600">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-black text-white text-4xl flex justify-center items-center">
          Loading..
        </div>
      )}
    </div>
  );
};
