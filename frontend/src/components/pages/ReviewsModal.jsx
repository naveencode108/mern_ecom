import { Box, Button, CircularProgress, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { FaTimes } from 'react-icons/fa'

const ReviewsModal = ({isModalOpen,setIsModalOpen,handleSubmit,rating,setRating,loading,comment,setComment,reviewImages,setReviewImages,reviewVideos,setReviewVideos}) => {
  return (
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
            Edit Your Review
          </Typography>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Select
              disabled={loading}
              value={rating}
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

            <TextField
              disabled={loading}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              name="comment"
              label="Comment"
              multiline
              rows={4}
              fullWidth
            />

            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload Images
            </Typography>

            {/* show images */}
            <div className="flex flex-wrap gap-2 my-2">
              {reviewImages.length > 0 &&
                reviewImages.map((item, index) => (
                  <div key={index} className="relative w-12 h-12">
                    <img
                      src={item}
                      alt={`review-${index}`}
                      className="object-cover w-full h-full rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setReviewImages((prevImages) =>
                          prevImages.filter((_, idx) => idx !== index)
                        )
                      }
                      className="absolute top-0 right-0 p-1 bg-red-600 rounded-full text-white"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
            </div>

            <input
              disabled={loading}
              type="file"
              accept="image/*"
              multiple
              name="images"
              style={{ marginBottom: "16px" }}
            />

            <Typography variant="body2" sx={{ mb: 1 }}>
              Upload Videos
            </Typography>

            {/* show videos */}
            <div className="flex flex-wrap gap-2 my-2">
              {reviewVideos.length > 0 &&
                reviewVideos.map((item, index) => (
                  <div key={index} className="relative w-40">
                    <video
                      src={item}
                      controls
                      className="object-cover w-full h-full rounded-xl"
                    ></video>
                    <button
                      type="button"
                      onClick={() =>
                        setReviewVideos((prevVideos) =>
                          prevVideos.filter((_, idx) => idx !== index)
                        )
                      }
                      className="absolute top-0 right-0 p-1 bg-red-600 rounded-full text-white"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
            </div>

            <input
              disabled={loading}
              type="file"
              accept="video/*"
              name="videos"
              multiple
              style={{ marginBottom: "16px" }}
            />

            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              type="submit"
            >
              {loading ? (
                <>
                  <span>Processing</span>
                  <CircularProgress size={25} />
                </>
              ) : (
                "Edit Review"
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
  )
}

export default ReviewsModal
