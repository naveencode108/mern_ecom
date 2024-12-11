import express from 'express'
const router = express.Router();
import { addProduct, listProduct, removeProduct ,showProduct, getAllProduct,productById,addToCart,productByCategory,productByName, editProduct} from '../controller/productController.js';
import upload from '../middleware/multer.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { isLogin } from '../middleware/isLogin.js';


// superadmin and normal admin routes**
router.post('/add', isAdmin, upload.array('image',10),addProduct);

router.get('/list',isAdmin, listProduct);
router.post('/remove', isAdmin, removeProduct);
router.post("/edit_product",isAdmin,upload.array('image',10),editProduct);
// *************


// for normal user*****
router.get('/', showProduct);
router.get('/get_all_product',getAllProduct);
router.post('/show_product_by_id',productById);
router.post('/add_to_cart',isLogin,addToCart);
router.post('/get_product_by_category',productByCategory);
router.post('/show_product_by_name',productByName);




export default router;