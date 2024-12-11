import React, { useEffect, useState } from "react";
import axios from "../../utils/Axios";
import { toast } from "react-toastify";

import ReviewsCard from "./ReviewsCard";
import ReviewsModal from "./ReviewsModal";
import { Breadcrumbs, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setloading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState("0");
  const [comment, setComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewVideos, setReviewVideos] = useState([]);
  const [productId, setProductId] = useState();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const formData = new FormData();
    let imageLen = e.target.images.files.length;
    let videoLen = e.target.videos.files.length;

    if (rating == "0") {
      toast.error("please Submit Your Rating first");
      return;
    }

    if (comment == "") {
      toast.error("Please enter your review");
      return;
    }

    if (imageLen + reviewImages.length > 5) {
      toast.error("You cannot upload more than 5 images");
      return;
    }

    if (videoLen + reviewVideos.length > 2) {
      toast.error("Only 2 video can be upload");
      return;
    }

    if (videoLen) {
      let vid = [...e.target.videos.files];
      let checkSize = vid.some((item) => Math.round(item.size / 1048576) > 10);

      if (checkSize) {
        toast.error("Video is more than 10MB!try with less ");
        return;
      }

      vid.forEach((item) => formData.append("video", item));
    }

    if (imageLen) {
      let img = [...e.target.images.files];
      img.forEach((item) => {
        formData.append("image", item);
      });
    }

    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", productId);
    formData.append("reviewImage", reviewImages);
    formData.append("reviewVideo", reviewVideos);

    try {
      setloading(true);
      let res = await axios.post("/edit_review", formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        setReviews(res.data.message);
        toast.success("Your Review Edited");
        setIsModalOpen(false);
      } else {
        toast.error(res.data.message);
      }
    } catch (er) {
      toast.error(er.message);
    } finally {
      setloading(false);
    }
  };

  const getReviews = async () => {
    try {
      const res = await axios.get("/get_review_by_id", {
        withCredentials: true,
      });
      if (res.data.success) {
        setReviews(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Failed to fetch reviews:", error);
    }
  };

  const handleEdit = (item) => {
    setIsModalOpen(true);
    setProductId(item._id);
    setComment(item.reviews[0].reviewText);
    setRating(item.reviews[0].rating);

    let imgArr = [];
    if (item.reviews[0].reviewImage.length > 0) {
      item.reviews[0].reviewImage.forEach((item) => {
        imgArr.push(item);
      });
      setReviewImages(imgArr);
    } else {
      setReviewImages(imgArr);
    }

    let vidArr = [];
    if (item.reviews[0].reviewVideo.length > 0) {
      item.reviews[0].reviewVideo.forEach((item) => {
        vidArr.push(item);
      });
      setReviewVideos(vidArr);
    } else {
      setReviewVideos(vidArr);
    }
  };

  const handleDelete=async(item)=>{
        try{
             let  productId=item._id;
             let res=await axios.post('/delete_review',{productId},{withCredentials:true});

             if(res.data.success){
                toast.success("Review Removed");
                setReviews(res.data.message);
             }
        }
        catch(er){
          toast.error(er.message);
          console.log(er.message);
        }
  }

  useEffect(() => {
    getReviews();
  }, []);

  return (
    <>
      <div className="p-6 sm:p-10 bg-gray-100 min-h-screen">
        {/* Breadcrumbs */}
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link underline="hover" key="1" color="inherit" to="/account">
            Your account
          </Link>

          <Typography key="3" sx={{ color: 'text.primary' }}>
            Your reviews
          </Typography>
        </Breadcrumbs>
      </Stack>
        <h2 className="text-2xl font-bold mb-6 sm:mb-8 text-gray-700 text-center sm:text-left">
          My Product Reviews
        </h2>
        {reviews.length > 0 ? (
          reviews.map((item, index) => (
            <ReviewsCard
              key={index}
              item={item}
              setSelectedImage={setSelectedImage}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No reviews available.</p>
        )}
      </div>

      {/* show uploaded images when click on them  */}
      {selectedImage && (
        <div
          className="fixed top-0 left-0 w-full z-50 h-full bg-black bg-opacity-80 flex items-center justify-center cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="w-full h-full object-contain"
            alt="Full Size Review Image"
          />
        </div>
      )}

      {/* Modal for submitting a new review */}
      <ReviewsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleSubmit={handleSubmit}
        rating={rating}
        setRating={setRating}
        loading={loading}
        comment={comment}
        setComment={setComment}
        reviewImages={reviewImages}
        setReviewImages={setReviewImages}
        reviewVideos={reviewVideos}
        setReviewVideos={setReviewVideos}
      />
    </>
  );
};

export default Reviews;
