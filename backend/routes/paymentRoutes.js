import express from 'express'
import { paymentIntent } from '../controller/paymentController.js';
const router=express.Router();


router.post('/create-payment-intent',paymentIntent);



export default router;