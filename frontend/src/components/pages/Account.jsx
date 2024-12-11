import { Link } from "react-router-dom";
import { FaUser, FaBox, FaHeart, FaMapMarkerAlt,FaCommentAlt  } from "react-icons/fa"; // Importing icons

export const Account = () => {
  return (
    <div className="w-full bg-gray-50 px-20 flex items-center justify-center">
      <div className="w-full bg-white shadow-md rounded-lg p-10">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Your Account</h1>
        <hr className="mb-6" />
        <div className="grid grid-cols-2 gap-6 text-lg">
          <Link
            className="flex items-center border border-gray-300 w-full py-4 rounded-lg text-center shadow-sm transition transform hover:scale-105 hover:border-gray-400 hover:shadow-lg hover:bg-gray-100"
            to="/account/profile"
          >
            <FaUser className="text-2xl mr-3 text-gray-700" /> Profile
          </Link>
          <Link
            className="flex items-center border border-gray-300 w-full py-4 rounded-lg text-center shadow-sm transition transform hover:scale-105 hover:border-gray-400 hover:shadow-lg hover:bg-gray-100"
            to="/account/orders"
          >
            <FaBox className="text-2xl mr-3 text-gray-700" /> Orders
          </Link>
          <Link
            className="flex items-center border border-gray-300 w-full py-4 rounded-lg text-center shadow-sm transition transform hover:scale-105 hover:border-gray-400 hover:shadow-lg hover:bg-gray-100"
            to="/account/wishlist"
          >
            <FaHeart className="text-2xl mr-3 text-gray-700" /> Wishlist
          </Link>
          <Link
            className="flex items-center border border-gray-300 w-full py-4 rounded-lg text-center shadow-sm transition transform hover:scale-105 hover:border-gray-400 hover:shadow-lg hover:bg-gray-100"
            to="/account/address"
          >
            <FaMapMarkerAlt className="text-2xl mr-3 text-gray-700" /> Address
          </Link>
          <Link
            className="flex items-center border border-gray-300 w-full py-4 rounded-lg text-center shadow-sm transition transform hover:scale-105 hover:border-gray-400 hover:shadow-lg hover:bg-gray-100"
            to="/account/reviews"
          >
            <FaCommentAlt  className="text-2xl mr-3 text-gray-700" /> Reviews
          </Link>
        </div>
      </div>
    </div>
  );
};
