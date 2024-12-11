// import { useEffect, useState } from "react";
// import { Card } from "./Card";
// import axios from "../utils/Axios";
// import { Link } from "react-router-dom";

// const Home = () => {
//   const [category, setCategory] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [isLoading, setisLoading] = useState(true);

//   const fetchProduct = async () => {
//     try {
//       const res = await axios.get("/products/get_all_product", {
//         withCredentials: true,
//       });
//       if (res.data.success) {
//         const val = Array.from(
//           new Set(res.data.message.map((item) => item.category))
//         );
//         setCategory(val);
//         setProducts(res.data.message);
//       }
//     } catch (er) {
//       console.log(er.message);
//     } finally {
//       setisLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, []);

//   return (
//     <>
//       {isLoading ? (
//         <div className="w-full h-screen bg-gradient-to-br from-indigo-600 to-purple-900 text-white text-4xl flex justify-center items-center">
//           Loading...
//         </div>
//       ) : (
//         <>
//           {/* Category Section */}
//           <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-4 md:px-10 py-5">
//             <h1 className="text-3xl md:text-4xl font-semibold text-center py-4 capitalize  hover:text-indigo-300 transition duration-200">
//               Browse by Category
//             </h1>
//             <hr className="m-4 border-indigo-600" />
//             <div className="w-full flex flex-wrap justify-center gap-6">
//               {category.length > 0 &&
//                 category.map((cat, key) => {
//                   const filteredProducts = products.filter(
//                     (item) => item.category === cat
//                   );
//                   if (filteredProducts.length > 0) {
//                     return (
//                       <Link
//                         to={{ pathname: "/product", search: cat }}
//                         key={key}
//                         className="bg-white w-40 h-40 rounded-full overflow-hidden flex flex-col justify-center items-center shadow-lg hover:scale-105 transform transition duration-300"
//                       >
//                         <div className="w-full">
//                           <img
//                             className="w-full h-20 object-contain"
//                             src={
//                               filteredProducts.length > 0 &&
//                               filteredProducts[0].productImagesurl[0]
//                             }
//                             alt=""
//                           />
//                         </div>
//                         <p className="text-black font-semibold capitalize text-center">
//                           {cat}
//                         </p>
//                       </Link>
//                     );
//                   }
//                   return null;
//                 })}
//             </div>
//           </div>

//           {/* Products Section */}
//           <div className="w-full bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen px-4 md:px-10 py-10 text-white">
//             {category.length > 0 &&
//               category.map((categories, key) => (
//                 <div className="w-full mb-16" key={key}>
//                   <h1 className="text-3xl md:text-4xl font-semibold text-center py-4 capitalize text-indigo-400 hover:text-indigo-300 transition duration-200">
//                     {categories}
//                   </h1>

//                   {products.filter((item) => item.category === categories)
//                     .length > 4 && (
//                     <div className="flex justify-center sm:justify-end items-center">
//                       <Link
//                         to={{
//                           pathname: "/product",
//                           search: categories,
//                         }}
//                         className="text-sm"
//                       >
//                         show more
//                       </Link>
//                     </div>
//                   )}

//                   <hr className="m-4 border-indigo-600" />
//                   <div className="w-full px-3">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                       {products.length > 0 &&
//                         products
//                           .filter((item) => item.category === categories)
//                           .splice(0, 4)
//                           .map((item, idx) => (
//                             <Card
//                               key={idx}
//                               id={item._id}
//                               productImagesurl={item.productImagesurl}
//                               productName={item.productName}
//                               productPrice={item.productPrice}
//                             />
//                           ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default Home;


import { useEffect, useState } from "react";
import { Card } from "./Card";
import axios from "../utils/Axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await axios.get("/products/get_all_product", {
        withCredentials: true,
      });
      if (res.data.success) {
        const val = Array.from(
          new Set(res.data.message.map((item) => item.category))
        );
        setCategory(val);
        setProducts(res.data.message);
      }
    } catch (er) {
      console.log(er.message);
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-full h-screen bg-gradient-to-br from-indigo-600 to-purple-900 flex justify-center items-center">
          <div className="text-white text-4xl font-bold animate-bounce">
            Loading...
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <img
              src="/hero-banner.jpg" // Replace with a relevant image URL
              alt="Hero"
              className="w-full h-[70vh] object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Welcome to Our Store
              </h1>
              <p className="text-lg md:text-2xl mb-6">
                Discover amazing products at unbeatable prices.
              </p>
              <Link
                to="/shop"
                className="px-6 py-3 bg-indigo-600 text-white rounded-full text-lg hover:bg-indigo-500 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Category Section */}
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white px-6 md:px-16 py-8">
            <h1 className="text-3xl md:text-5xl font-semibold text-center mb-6 capitalize hover:text-indigo-300 transition duration-300">
              Browse by Category
            </h1>
            <div className="w-full flex flex-wrap justify-center gap-8">
              {category.length>0&&category.map((cat, key) => {
                const filteredProducts = products.filter(
                  (item) => item.category === cat
                );
                if (filteredProducts.length > 0) {
                  return (
                    <Link
                      to={{ pathname: "/product", search: cat }}
                      key={key}
                      className="bg-white w-44 h-44 md:w-52 md:h-52 rounded-full overflow-hidden flex flex-col justify-center items-center shadow-lg hover:scale-105 transform transition duration-300 hover:shadow-indigo-500/50"
                    >
                      <img
                        className="w-24 h-24 object-contain"
                        src={filteredProducts[0].productImagesurl[0]}
                        alt={cat}
                      />
                      <p className="text-black font-medium capitalize mt-2">
                        {cat}
                      </p>
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Featured Products */}
          <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white px-6 md:px-16 py-8">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-8">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.length>0&&products.slice(0, 8).map((item, idx) => (
                <Card
                  key={idx}
                  id={item._id}
                  productImagesurl={item.productImagesurl}
                  productName={item.productName}
                  productPrice={item.productPrice}
                />
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="bg-gray-900 text-white px-6 md:px-16 py-10">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-8">
              What Our Customers Say
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full md:w-1/3">
                <p className="italic mb-4">
                  "Amazing quality! I’m so happy with my purchase."
                </p>
                <p className="font-bold">- John Doe</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full md:w-1/3">
                <p className="italic mb-4">
                  "The customer service was excellent. Highly recommend!"
                </p>
                <p className="font-bold">- Jane Smith</p>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-800 text-white px-6 md:px-16 py-8">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
              Stay Updated
            </h2>
            <p className="text-center mb-6">
              Sign up for our newsletter to get the latest news and offers.
            </p>
            <form className="flex justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-md text-black w-72 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-r-md"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Footer */}
          <footer className="bg-gray-900 text-gray-400 py-6 text-center">
            <p>&copy; 2024 Your Store. All rights reserved.</p>
            <p>
              <Link
                to="/about"
                className="text-indigo-400 hover:text-indigo-300 mx-2"
              >
                About Us
              </Link>
              |{" "}
              <Link
                to="/contact"
                className="text-indigo-400 hover:text-indigo-300 mx-2"
              >
                Contact
              </Link>
              |{" "}
              <Link
                to="/policy"
                className="text-indigo-400 hover:text-indigo-300 mx-2"
              >
                Privacy Policy
              </Link>
            </p>
          </footer>
        </>
      )}
    </>
  );
};

export default Home;
