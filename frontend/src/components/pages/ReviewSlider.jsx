import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css/navigation";
import "swiper/css";
import { useState } from "react";
import { Box, IconButton, Modal, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const ReviewSlider = ({ reviewsImages, ans, showReviewsImages }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div>
        {reviewsImages && reviewsImages.length > 0 && (
          <>
            <div className="flex justify-between items-center border">
              <h1 className="text-2xl underline">Customers Reviews images</h1>
              {ans.length > 10 && (
                <button
                  onClick={() => setOpen(true)}
                  className="text-sm text-sky-400"
                >
                  Show More
                </button>
              )}
            </div>
            <Swiper
              className="overflow-hidden bg-gray-200"
              modules={[Navigation]}
              spaceBetween={1}
              slidesPerView={3}
              navigation={true}
              breakpoints={{
                640: { slidesPerView: 2 }, // Adjust number of slides for medium screens
                768: { slidesPerView: 4 }, // Adjust for tablets
                1024: { slidesPerView: 5 }, // Adjust for desktops
              }}
            >
              {ans.length > 0 &&
                ans.slice(0, 10).map((item, key) => (
                  <SwiperSlide
                    className="w-24 h-32 lg:h-40 flex justify-center"
                    onClick={() => showReviewsImages(item.userId, item.src)}
                    key={key}
                  >
                    <img
                      className="rounded-xl cursor-pointer object-cover w-24 lg:w-32 h-full"
                      src={item.src}
                      alt=""
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </>
        )}
      </div>


      <Modal
        open={open}
        aria-labelledby="image-modal-title"
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
          <div className="flex justify-between items-center">
          <h2 className="my-4 text-xl underline">
            All Reviews Images
          </h2>
            <CloseIcon className="cursor-pointer" onClick={()=>setOpen(false)}/>
          </div>

          <div
           className="px-auto"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2px",
              justifyContent: "start",
              alignContent:'center',
            }}
          >
            {/* Render Images */}
            {ans &&
              ans.map((item, index) => (
                <img
                  key={index}
                  src={item.src}
                  alt={`Image-${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => showReviewsImages(item.userId,item.src)}
                />
              ))
            }
          </div>

        </Box>
      </Modal>
    </>
  );
};
