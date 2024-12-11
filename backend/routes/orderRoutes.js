import express from 'express';
import { createOrder,getOrders,checkOrder, allOrders, updateStatus} from '../controller/orderController.js';
import {isLogin} from '../middleware/isLogin.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router=express.Router();


router.post('/create_order',createOrder);
router.get('/get_orders',isLogin,getOrders);

router.post('/check_order',isLogin,checkOrder);


// admin routes
router.get("/get_all_orders",isAdmin,allOrders);
router.post('/update_order_status',isAdmin,updateStatus);





export default router;