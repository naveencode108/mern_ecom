import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Modal, Box, Typography, Grid, CircularProgress } from '@mui/material';
import axios from '../../utils/Axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const PaymentModal = ({ open, onClose, totalPrice, cart,address,userId ,quantity}) => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const fetchClientSecret = async () => {
        const response = await axios.post('/payment/create-payment-intent', {
            amount: totalPrice * 100,
        });
        if(response.data){
            setClientSecret(response.data.clientSecret);
        }
    };

    useEffect(() => {
        if (open) {
            fetchClientSecret();
        }
    }, [open, totalPrice]);

    const handlePayment = async (event) => {
        
        event.preventDefault();
        setLoading(true);
        
        if (!stripe || !elements || !clientSecret) {
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details:{
                    name:address.name
                }
            },
        });
        

        setLoading(false);

        if (error) {
            console.error(error);
            toast.error(error);
        }
         else {
            let res=await axios.post('/order/create_order',{totalPrice, cart,address,userId,quantity,paymentStatus:paymentIntent.status,paymentId:paymentIntent.id},{withCredentials:true});
            if(res.data.success){
                toast.success("Order Successfull");
                onClose();
                navigate('/account/orders')
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" gutterBottom>
                    Payment
                </Typography>
                <form onSubmit={handlePayment}>
                    <CardElement />
                    
                    <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Products:
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {cart[0].productId?cart.map((item) => (
                            <Grid item xs={12} sm={6} key={item.productId._id}>
                                <div className="flex items-center">
                                    <img
                                        src={item.productId.productImagesurl[0]}
                                        alt={item.productId.productName}
                                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                    />
                                    <Typography variant="body1">{item.productId.productName}</Typography>
                                </div>
                            </Grid>
                        )):
                        cart.map((item) => (
                            <Grid item xs={12} sm={6} key={item._id}>
                                <div className="flex items-center">
                                    <img
                                        src={item.productImagesurl[0]}
                                        alt={item.productName}
                                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                    />
                                    <Typography variant="body1">{item.productName}</Typography>
                                </div>
                            </Grid>
                        ))}
                    </Grid>

                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Total: ${totalPrice.toFixed(2)}
                    </Typography>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        disabled={!stripe || loading} // Disable if loading
                    >
                        {loading ? <CircularProgress size={24} /> : 'Pay'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default PaymentModal;
