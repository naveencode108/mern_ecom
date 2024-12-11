import { useEffect, useState } from "react";
import axios from "../../utils/Axios";
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import "swiper/css";
import { ReviewImageModal } from "./ReviewImageModal";
import { ReviewSlider } from "./ReviewSlider";

const Review = ({ productId, setstarRating }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState("0");
  const [loading, setloading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsImages, setreviewsImages] = useState([]);

  // second modal states
  const [secondModalOpen, setSecondModal] = useState(false);
  const [ReviewImage, setReviewImage] = useState([]);
  const [selectedImageAndVideo, setSelectedImageAndVideo] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [ReviewVideo, setReviewVideo] = useState([]);

  const openModal = async () => {
    try {
      let res = await axios.post(
        "/order/check_order",
        { productId },
        { withCredentials: true }
      );
      if (res.data.success && !res.data.hasReviewd) {
        setIsModalOpen(true);
      } else if (res.data.success && res.data.hasReviewd) {
        toast.error("You have already given the review");
      } else {
        toast.error(res.data.message);
      }
    } catch (er) {
      console.log(er.message);
      toast.error(er.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    let imageLen = e.target.images.files.length;
    let videoLen = e.target.videos.files.length;
    let comment = e.target.comment.value;

    if (rating == "0") {
      toast.error("please Submit Your Rating first");
      return;
    }

    if (comment == "") {
      toast.error("Please enter your review");
      return;
    }

    if (imageLen && imageLen > 5) {
      toast.error("Only 5 image can be upload");
      return;
    }

    if (videoLen && videoLen > 2) {
      toast.error("Only 2 video can be upload");
      return;
    }

    if (imageLen) {
      let img = [...e.target.images.files];
      img.forEach((item) => {
        formData.append("image", item);
      });
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

    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("productId", productId);

    try {
      setloading(true);
      let res = await axios.post("/user_rating", formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        setReviews(res.data.message);
        toast.success("Your Review Added");
        setIsModalOpen(false);
      }
    } catch (er) {
      toast.error(er.message);
    } finally {
      setloading(false);
    }
  };

  const getReview = async () => {
    let res = await axios.post("/get_review", { productId });
    setReviews(res.data.message[0].reviews);
  };

  const fetchAllReviewsImage = async () => {
    try {
      let res = await axios.post("/all_reviews_images", { productId });
      if (res.data.success) {
        setreviewsImages(res.data.id);
      }
    } catch (er) {
      console.log(er.message);
    }
  };

  const showReviewsImages = (id, url) => {
    setSecondModal(true);
    let data = reviews.filter((item) => item.userId._id == id);
    setUserDetails(data);
    setReviewImage(data[0].reviewImage.map((item) => item));
    setReviewVideo(data[0].reviewVideo.map((item) => item));
    setSelectedImageAndVideo(url);
  };

  useEffect(() => {
    getReview();
    fetchAllReviewsImage();
  }, [productId]);

  useEffect(() => {
    const reviewLength = reviews.length;
    const avgRating = reviews.reduce((total, curr) => {
      return (total += curr.rating);
    }, 0);

    setstarRating(Math.floor(avgRating / reviewLength));
  }, [reviews, productId]);

  const ans = reviewsImages.flatMap((item) =>
    item.reviewImage.map((data) => ({ userId: item.userId._id, src: data }))
  );

  return (
    <div className="w-full  bg-gray-50 text-gray-900 px-5 py-10">
      {/* Display title for Customer Reviews */}
      <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Button to open modal for adding a new review */}
        <div className="lg:w-1/4">
          <Button
            variant="contained"
            color="primary"
            onClick={openModal}
            sx={{
              backgroundColor: "#3B82F6",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Add Review
          </Button>
        </div>

        {/* Display list of existing reviews */}

        <div className="lg:w-3/4 w-full space-y-6 overflow-auto">
          {/* slider */}
          <ReviewSlider
            reviewsImages={reviewsImages}
            ans={ans}
            showReviewsImages={showReviewsImages}
          />

          {/* show reviews  */}
          {reviews && reviews.length > 0 ? (
            reviews.map((item, index) => (
              <div
                key={index}
                className="border-b pb-4 flex items-start border-l-2 px-4"
              >
                <img
                  src={item.userId.userImage}
                  alt="User avatar"
                  className="w-10 h-10 object-cover rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{item.userId.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {new Date(item.reviewData).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    , at{" "}
                    {new Date(item.reviewData).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>

                  <p>
                    {Array.from({ length: item.rating }, (_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </p>

                  <p>{item.reviewText}</p>
                  <div className="flex gap-2 flex-wrap">
                    {/* Display uploaded review images */}
                    {item.reviewImage &&
                      item.reviewImage.map((img, idx) => (
                        <img
                          key={idx}
                          className="w-20 object-cover rounded"
                          src={img}
                          alt="Review image"
                        />
                      ))}
                    {/* Display uploaded review videos */}
                    {item.reviewVideo &&
                      item.reviewVideo.map((vid, idx) => (
                        <video
                          key={idx}
                          className="w-32 rounded"
                          controls
                          src={vid}
                        />
                      ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-3xl text-gray-400 flex">No reviews yet..</div>
          )}
        </div>
      </div>

      {/*to show reviewImage slider with details  */}

      <ReviewImageModal
        secondModalOpen={secondModalOpen}
        setSecondModal={setSecondModal}
        ReviewImage={ReviewImage}
        ReviewVideo={ReviewVideo}
        // setReviewImage={setReviewImage}
        selectedImageAndVideo={selectedImageAndVideo}
        setSelectedImageAndVideo={setSelectedImageAndVideo}
        userDetails={userDetails}
      />

      {/* Modal for submitting a new review */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Submit a Review
          </Typography>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Rating dropdown select */}
            <Select
              value={rating}
              disabled={loading}
              onChange={(e) => setRating(e.target.value)}
              name="rating"
              fullWidth
              displayEmpty
              sx={{ mb: 2 }}
            >
              <MenuItem value="0" disabled>
                Rating
              </MenuItem>
              <MenuItem value="5">⭐⭐⭐⭐⭐</MenuItem>
              <MenuItem value="4">⭐⭐⭐⭐</MenuItem>
              <MenuItem value="3">⭐⭐⭐</MenuItem>
              <MenuItem value="2">⭐⭐</MenuItem>
              <MenuItem value="1">⭐</MenuItem>
            </Select>

            {/* Comment input field */}
            <TextField
              name="comment"
              label="Comment"
              multiline
              rows={4}
              fullWidth
              disabled={loading}
            />

            {/* Image upload input */}
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload Images
            </Typography>
            <input
              type="file"
              accept="image/*"
              multiple
              name="images"
              disabled={loading}
              style={{ marginBottom: "16px" }}
            />

            {/* Video upload input */}
            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload Videos
            </Typography>
            <input
              type="file"
              accept="video/*"
              name="videos"
              multiple
              disabled={loading}
              style={{ marginBottom: "16px" }}
            />

            {/* Submit and Close buttons */}
            <Button variant="contained" color="primary" type="submit">
              {loading ? (
                <>
                  <span>Processing</span>
                  <CircularProgress size={25} />
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
              color="error"
              sx={{ ml: 2 }}
            >
              Close
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Review;
