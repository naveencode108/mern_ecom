import { Link } from 'react-router-dom';

export const Card = ({
  id,
  productImagesurl,
  productName,
  productPrice,
}) => {

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 shadow-lg transition-transform transform hover:scale-105">
      <Link 
        to={`/showproduct/${id}`} 
        className="min-h-[15vw] flex justify-center w-full transition-all transform hover:scale-110 cursor-pointer"
      >
        <img 
          src={productImagesurl[0]} 
          alt={productName} 
          loading="lazy"
          className="h-48 w-full object-cover"
        />
      </Link> 

      <div className="p-4 text-white">
        <h3 className="text-lg font-semibold truncate">{productName}</h3>
        <p className="text-indigo-300 font-bold text-2xl mt-1">${productPrice}</p>
      </div>

      <button className="w-full px-4 py-2 bg-indigo-500 rounded-b-lg text-black font-semibold uppercase tracking-wide hover:bg-indigo-400 transition-colors">
        Add to Cart
      </button>
    </div>
  );
};
