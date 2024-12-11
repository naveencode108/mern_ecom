import React from 'react'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'

const ReviewsCard = ({index,item,setSelectedImage,handleEdit,handleDelete}) => {
  return (
    <div
    key={index}
    className="mb-6 p-4 sm:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
  >
    <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
      <img
        className="w-20 h-20 sm:w-16 sm:h-16 object-cover rounded-full mb-3 sm:mb-0 mr-0 sm:mr-4"
        src={item.productImagesurl[0]}
        alt="No image found"
      />
      <div className="text-center sm:text-left">
        <h3 className="text-xl font-semibold text-gray-800">
          {item.productName}
        </h3>
        <p className="text-gray-600 text-sm">Reviewed by you</p>
      </div>
    </div>

    <div>
      <p className="text-gray-700 mt-3">
         {"⭐".repeat(item.reviews[0].rating)}
      </p>
      <p className="text-gray-700 mt-3">
        {item.reviews[0].reviewText}
      </p>

      <div className="flex flex-wrap items-center gap-4 mt-3">
        {/* Image Thumbnails */}
        {item.reviews[0].reviewImage.map((image, index) => (
          <img
            onClick={(e) => setSelectedImage(e.target.src)}
            key={index}
            src={image}
            className="w-24 sm:w-20 h-20 rounded-lg object-cover cursor-pointer shadow-md transition-transform duration-200 hover:scale-105"
            alt="Review Image"
          />
        ))}

        {/* Video Thumbnails */}
        {item.reviews[0].reviewVideo.map((video, index) => (
          <div
            key={index}
            className="relative w-full sm:w-40 h-40 rounded-xl overflow-hidden shadow-lg"
          >
            {/* Video Element */}
            <video
              className="object-cover w-full h-full rounded-xl transition-transform duration-200 hover:scale-105"
              controls
              src={video}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      <div className="flex justify-center sm:justify-start space-x-4 mt-4">
        <button
          onClick={() => handleEdit(item)}
          className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
        >
          <AiFillEdit size={18} />
          <span>Edit</span>
        </button>
        <button onClick={()=>handleDelete(item)} className="text-red-500 hover:text-red-700 flex items-center space-x-1">
          <AiFillDelete size={18} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  </div>
  )
}

export default ReviewsCard
