import {
  Modal,
  Box,
  Typography,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const ReviewImageModal = ({
  secondModalOpen,
  setSecondModal,
  ReviewImage,
  userDetails,
  selectedImageAndVideo,
  setSelectedImageAndVideo,
  ReviewVideo,
}) => {
  return (
    <Modal
      open={secondModalOpen}
      aria-labelledby="review-image-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
          width: { xs: "95%", md: "75%", lg: "60%" },
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* Close Button */}
        <Tooltip title="Close">
          <IconButton
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "text.secondary",
            }}
            onClick={() => setSecondModal(false)}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>

        {/* Main Content */}
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          {/* Image Section */}
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              bgcolor: "background.default",
              borderRadius: 2,
              p: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            {selectedImageAndVideo.split(".").includes("mp4")==false?(
              <img
                src={selectedImageAndVideo}
                alt="Selected Review"
                style={{
                  maxWidth: "100%",
                  maxHeight: "350px",
                  borderRadius: 8,
                }}
              />
            ) : (
              <video className=" rounded-3xl" controls src={selectedImageAndVideo}></video>
            )}
          </Box>

          {/* Details Section */}
          <Box flex={1} display="flex" flexDirection="column" gap={2}>
            {/* User Info */}
            <Box display="flex" alignItems="center" gap={2}>
              <img
                className="w-14 h-14 object-cover rounded-full"
                src={userDetails?.[0]?.userId?.userImage || ""}
                alt="User"
              />
              <Box>
                <Typography variant="h6">
                  {userDetails?.[0]?.userId?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(
                    userDetails?.[0]?.reviewData || ""
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {new Date(
                    userDetails?.[0]?.reviewData || ""
                  ).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Review Details */}
            <Typography variant="body1" color="text.primary">
              <strong>Rating:</strong> {userDetails?.[0]?.rating || "Not Rated"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Comments:
            </Typography>
            <Box
              sx={{
                maxHeight: "300px",
                overflowY: "auto",
                p: 2,
                borderRadius: 2,
                bgcolor: "background.default",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="body2">
                {userDetails?.[0]?.reviewText || "No comments provided."}
              </Typography>
            </Box>

            {/* Review Images */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Other Images:
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {ReviewImage?.length > 0 &&
                ReviewImage.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    alt={`Review ${index}`}
                    onClick={() => setSelectedImageAndVideo(item)}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border:
                        item === selectedImageAndVideo
                          ? "2px solid #3f51b5"
                          : "2px solid transparent",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              {/* video */}
              {ReviewVideo?.length > 0 &&
                ReviewVideo.map((item, index) => (
                  <video
                    key={index}
                    src={item}
                    alt={`Review ${index}`}
                    onClick={() => setSelectedImageAndVideo(item)}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      cursor: "pointer",
                      border:
                        item === selectedImageAndVideo
                          ? "2px solid #3f51b5"
                          : "2px solid transparent",
                      transition: "all 0.3s ease",
                    }}
                  ></video>
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
