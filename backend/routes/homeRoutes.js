import express from 'express'
const router = express.Router();

import { login, register,forgetPassword,validateToken ,AdminLogin, logout, getUser, updateUser, AdminLogout, removeCartData, getCartData, createAddress, getAddress, removeAddress, userProfile, getUserprofile, addWishlist, getWishlist, removeWishlist,userRating,getReview, getReviewById ,editReview,deleteReview,allReviewsImages, resetPassword,chatBot} from '../controller/homeController.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { isLogin } from '../middleware/isLogin.js';
import upload from '../middleware/multer.js';



router.post('/chat_message',isLogin,chatBot);
//chatbot routes 

// normal user routes
router.post('/login', login);
router.post('/register', register);
router.post('/forget_password',forgetPassword);
router.post('/reset_password',resetPassword);
router.post('/validate_token',validateToken);
router.post('/logout', logout);
// ----------------------------------------------

router.post('/remove_cart_data', isLogin, removeCartData);
router.get('/get_cart_data', getCartData);
router.post('/create_address', isLogin, createAddress);
router.get('/get_address', isLogin, getAddress);
router.post('/remove_address', isLogin, removeAddress)
router.post('/user_profile', isLogin, upload.single('image'), userProfile);
router.get('/get_user_profile', isLogin, getUserprofile);
router.post('/add_wishlist', isLogin, addWishlist)
router.get('/get_wishlist', isLogin, getWishlist);
router.post('/remove_wishlist', isLogin, removeWishlist);

router.post('/user_rating', upload.fields([
     { name: 'image', maxCount: 5 },
     { name: 'video', maxCount: 2 }
]), isLogin, userRating);

router.post('/get_review',getReview);

router.get('/get_review_by_id',isLogin,getReviewById);
router.post("/edit_review",upload.fields([
     {name:'image',maxCount:5},
     {name:'video',maxCount:2}
]),isLogin,editReview);

router.post('/delete_review',isLogin,deleteReview);

router.post("/all_reviews_images",allReviewsImages)


// --------------------------------

// admin routes
router.post('/admin_login', AdminLogin)

router.get('/check_auth', isAdmin, (req, res) => {
     const admin = req.admin;
     if (!admin) return res.json({ success: false, message: 'You dont have Access', admin });
     return res.json({ success: true, message: 'Authenticated Admin', admin });
});

router.get('/get_user', getUser);
router.post('/update_user', updateUser);
router.get('/admin_logout', AdminLogout);



export default router;