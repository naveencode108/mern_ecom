import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import { SiChatbot } from "react-icons/si";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../utils/Axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatbotmsg, setchatbotmsg] = useState();
  const messagesEndRef = useRef(null);

  const predefinedMessages = ["Your Cart", "Your Order", "Track Order"];

  async function handleSendMessage(message) {
    setMessages(() => [{ text: message, sender: "user" }]);

    try {
      let res = await axios.post(
        "/chat_message",
        { message },
        { withCredentials: true }
      );

      if (res.data.success) {
        setchatbotmsg(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (er) {
      toast.error(er.message);
      console.log(er.message);
    }
  }

  useEffect(() => {
    setMessages(() => [
      { text: "Hello There! May I help You", sender: "user" },
    ]);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const style = {
    position: "absolute",
    bottom: "50px",
    right: "50px",
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
    p: 3,
    width: 300,
  };

  return (
    <>
      {/* Chatbot Trigger Button */}
      <Box
        className="fixed bottom-10 right-10 z-50 bg-white rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Button
          sx={{ color: "white", minWidth: "50px", height: "50px" }}
          aria-label="Open chatbot"
        >
          <SiChatbot size={22} color="blue" />
        </Button>
      </Box>

      {/* Chatbot Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" component="h2">
              Chatbot
            </Typography>
            <IconButton
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              height: 350,
              overflowY: "auto",
              border: "1px solid #ddd",
              borderRadius: "5px",
              padding: "10px",
              bgcolor: "#f9f9f9",
            }}
          >
            {messages.flatMap((msg, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: "right",
                  mb: 1,
                }}
              >
                <Typography
                  ref={messagesEndRef}
                  variant="body2"
                  sx={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    bgcolor: "#e0e0e0",
                    color: "black",
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}

            {chatbotmsg != undefined &&
            Array.isArray(chatbotmsg) &&
            chatbotmsg.length >= 1 &&
            !chatbotmsg[0].Products ? (
              chatbotmsg.map((msg, index) => (
                <Link key={index} to={`/showproduct/${msg.productId._id}`}>
                  <Box
                    key={index}
                    sx={{
                      textAlign: "left",
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      bgcolor: "#f4f6f8",
                    }}
                  >
                    <Box
                      component="img"
                      src={msg.productId.productImagesurl[0]}
                      alt={msg.productId.productName}
                      sx={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {msg.productId.productName}
                    </Typography>
                  </Box>
                </Link>
              ))
            ) : chatbotmsg !== undefined &&
              Array.isArray(chatbotmsg) &&
              chatbotmsg[0]?.Products ? (
              <Box
                sx={{
                  textAlign: "left",
                  mb: 2,
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  bgcolor: "#f4f6f8",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: "#1976d2",
                  }}
                >
                  You have {chatbotmsg[0].Products.length} recent orders
                </Typography>
                {chatbotmsg[0].Products.length > 0 &&
                  chatbotmsg[0].Products.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                          p: 2,
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          bgcolor: "#ffffff",
                        }}
                      >
                        <Box
                          component="img"
                          src={item.productImagesurl}
                          alt={item.productName}
                          sx={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            color: "#333",
                            fontSize: "small",
                          }}
                        >
                          {item.productName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: "bold",
                            color:
                              chatbotmsg[0].orderStatus == "delivered"
                                ? "green"
                                : "red",
                            fontSize: "small",
                          }}
                        >
                          {chatbotmsg[0].orderStatus}
                        </Typography>
                      </Box>
                    );
                  })}
              </Box>
            ) : (
              chatbotmsg !== undefined &&
              !Array.isArray(chatbotmsg) ? (
                <Box
                  sx={{
                    textAlign: "left",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    bgcolor: "#f4f6f8",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      textTransform: "capitalize",
                    }}
                  >
                    Your recent Order is{" "}
                    <span
                      className={`${
                        chatbotmsg == "delivered"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {chatbotmsg}
                    </span>
                  </Typography>
                </Box>
              ):
              <Box
                sx={{
                  textAlign: "center",
                  mt: 4,
                  p: 3,
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  bgcolor: "#f4f6f8",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  You haven't placed any orders yet and your cart is empty.
                </Typography>
                <Typography variant="body2" sx={{ color: "#777", mt: 1 }}>
                  Start exploring our products and add items to your cart!
                </Typography>
              </Box>
            )}
           
          </Box>

          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {predefinedMessages.map((msg, index) => (
              <Button
                key={index}
                variant="outlined"
                color="primary"
                onClick={() => handleSendMessage(msg)}
              >
                {msg}
              </Button>
            ))}
            <Button
              onClick={() => {
                setMessages([]);
                setchatbotmsg();
              }}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Chatbot;
