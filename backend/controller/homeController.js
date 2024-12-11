import userModel from '../models/userModel.js'
import productModel from '../models/productModel.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary';
import orderModel from '../models/orderModel.js';
import nodemailer from 'nodemailer'


export const chatBot=async(req,res)=>{
    try{
        let {message}=req.body;
         
        let userId=req.user.id;
        let data;
         
        if(message=='Your Cart'){   
            let user=await userModel.find({_id:userId}).select("cartData").populate('cartData.productId');
            data=user[0].cartData;
            return res.json({success:true,message:'Your Cart Data',data});
        }
        
        if(message=='Your Order'){
             let order=await orderModel.find({userId}).sort({_id:-1}).limit(1);
             data=order
             return res.json({success:true,message:'Your recent Orders',data});
        }

        if(message=='Track Order'){
            let status=await orderModel.findOne({userId}).sort({_id:-1});
            data=status.orderStatus;
            return res.json({success:true,message:'Your Order Status',data});
        }

    }
    catch(er){
        return res.json({success:false,message:er.message});
    }
}

// chatbot functions

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (user) {
            let match = await bcrypt.compare(password, user.password)
            if (!match) return res.json({ success: false, error: 'email and password is incorrect' });
            const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET)
            res.cookie('user_token', token, { httpOnly: true, sameSite: 'Strict' });
            return res.json({ success: true, message: 'Welcome ' + user.name, token: token, name: user.name });
        }

        return res.json({ success: false, error: "email and password is incorrect" })

    }
    catch (er) {
        return res.json({ success: false, error: er.message });
    }
}

export const register = async (req, res) => {

    try {
        let { name, email, password } = req.body;
        let isExist = await userModel.findOne({ email });

        if (isExist) {
            return res.json({ success: false, error: 'user already exists' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, error: 'please enter a valid email' })
        }

        if (password.length <= 4) {
            return res.json({ success: false, error: 'please enter a strong password' });
        }

        let salt = await bcrypt.genSalt(12);
        let hash = await bcrypt.hash(password, salt);

        let user = await userModel.create({
            name,
            email,
            password: hash
        });

        return res.json({ success: true, message: 'User Register successfully' });

    }
    catch (er) {
        console.log(er.message);
    }
}

export const logout = (req, res) => {
    res.clearCookie('user_token');
    return res.json({ message: 'logout' });
}

export const validateToken=async(req,res)=>{
    try{
        let {token}=req.body;

        let {email}=jwt.verify(token,process.env.JWT_SECRET);
        
        let user=await userModel.findOne({email});
        if(!user) return res.json({success:false,message:'something went wrong'});

        if(user.resetPasswordExpires>Date.now()){
            return res.json({success:true,message:'token is valid'});
        }
        else{
            return res.json({success:false,message:'token is not valid'});
        }

    }
    catch(er){
        return res.json({success:false,message:er.message});
    }

}

export const forgetPassword = async (req, res) => {
    try {
        let { email } = req.body;
        let user = await userModel.findOne({ email });
        if (!user) return res.json({ success: false, message: 'User not found' });

        let token = jwt.sign({ email }, process.env.JWT_SECRET);
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 2 * 60 * 1000);

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASS
            }
        });

        let link = `http://localhost:5173/resetPassword/${token}`;

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Password Reset',
            text: 'Here is your password reset link.',
            html: `<p>Here is your <a href="${link}">password reset link</a></p>`
        };

        transport.sendMail(mailOptions);


        await user.save();
        return res.json({ success: true, message: 'Reset Link send to your email' });
    }
    catch (er) {
        return res.json({ success: false, message: er.message }); 
    }
}

export const resetPassword = async (req, res) => {
    try {
        let { token, password } = req.body;
        let { email } = jwt.verify(token, process.env.JWT_SECRET);
        let user = await userModel.findOne({ email });

        if(!user) return res.json({success:false,message:'something went wrong'});

        if (user.resetPasswordExpires > Date.now()) {
            let hash = await bcrypt.hash(password, 12);
            user.password = hash;
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;

            await user.save();
            return res.json({ success: true, message: 'Your password has been changed successfully' });
        }
        else {
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            return res.json({ success: false, message: 'Reset token has expired. Please request a new one.' });
        }

    }
    catch (er) {
        return res.json({ success: false, message: er });
    }
}

export const getCartData = async (req, res) => {
    try {

        let token = req.cookies.user_token;
        let { email } = jwt.verify(token, process.env.JWT_SECRET);

        let cartData = await userModel.findOne({ email }).select('cartData').populate('cartData.productId');
        return res.json({ success: true, message: cartData.cartData });
    }
    catch (er) {
        return res.json({ success: false, message: er.message });
    }

}

export const removeCartData = async (req, res) => {
    let email = req.user.email;
    const { _id } = req.body;

    let cartData = await userModel.findOne({ email }).select('cartData').populate('cartData.productId');
    cartData.cartData = cartData.cartData.filter(item => !item.productId._id.equals(_id));
    await cartData.save();
    return res.json({ cartData });
}

export const createAddress = async (req, res) => {
    try {
        let userEmail = req.user.email;
        let { addressName, street, houseno, pincode, landmark, id, phoneno } = req.body;
        let findUser = await userModel.findOne({ email: userEmail });

        if (id) {
            let updateAddress = findUser.address.find(item => item._id.equals(id));
            updateAddress.name = addressName;
            updateAddress.street = street;
            updateAddress.houseno = houseno;
            updateAddress.pincode = pincode;
            updateAddress.landmark = landmark;
            updateAddress.phoneno = phoneno;
        }
        else {
            findUser.address.push({
                name: addressName,
                street,
                houseno,
                pincode,
                landmark,
                phoneno
            })
        }
        await findUser.save();
        return res.json({ msg: findUser.address })
    } catch (error) {
        return res.json({ msg: error.message })
    }
}

export const getAddress = async (req, res) => {
    try {
        let userEmail = req.user.email;
        let findUser = await userModel.findOne({ email: userEmail });
        return res.json({ msg: findUser })
    } catch (error) {
        return res.json({ msg: error.message });
    }
}

export const removeAddress = async (req, res) => {
    let { _id } = req.body;
    let userEmail = req.user.email;

    let findUser = await userModel.findOne({ email: userEmail });

    findUser.address = findUser.address.filter(item => !item._id.equals(_id));
    await findUser.save();

    return res.json({ msg: findUser.address });
}

export const userProfile = async (req, res) => {

    try {
        let userId = req.user.id;
        let user = await userModel.findOne({ _id: userId });

        let { name } = req.body;

        if (req.file != undefined) {
            let result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' })
            let imgUrl = result.secure_url;
            user.userImage = imgUrl;
        }

        user.name = name;
        await user.save();

        return res.json({ msg: user });
    }
    catch (er) {
        return res.json({ msg: er.message });
    }
}

export const getUserprofile = async (req, res) => {
    let user = await userModel.findOne({ _id: req.user.id });
    return res.json({ msg: user });
}

export const addWishlist = async (req, res) => {

    try {
        let userId = req.user.id;
        let { id } = req.body;

        let user = await userModel.findOne({ _id: userId });

        let isWishlist = user.wishlist.some(item => item.productId._id.equals(id));
        if (!isWishlist) user.wishlist.push({ productId: id });
        await user.save();

        return res.json({ success: true, message: 'Add to Wishlist' });
    }
    catch (er) {
        return res.json({ success: false, message: er.message });
    }
}

export const getWishlist = async (req, res) => {
    try {
        let userId = req.user.id;

        let user = await userModel.findOne({ _id: userId }).select('wishlist').populate('wishlist.productId');
        return res.json({ success: true, message: user.wishlist });

    } catch (er) {
        return res.json({ success: false, message: er.message });
    }
}

export const removeWishlist = async (req, res) => {
    try {
        let userId = req.user.id;
        let { id } = req.body;

        let user = await userModel.findOne({ _id: userId }).select('wishlist').populate('wishlist.productId');

        let isWishlist = user.wishlist.some(item => item.productId._id.equals(id));
        if (isWishlist) user.wishlist = user.wishlist.filter(item => !item.productId._id.equals(id))
        await user.save();

        return res.json({ success: true, message: user.wishlist });

    }
    catch (er) {
        return res.json({ success: false, message: er.message });
    }
}

export const userRating = async (req, res) => {

    try {
        let { comment, rating, productId } = req.body;

        let product = await productModel.findOne({ _id: productId });
        let userId = req.user.id;

        let reviews = {
            userId,
            rating,
            reviewText: comment,
        };

        if (req.files['image']) {

            let imgurl = await Promise.all(
                req.files['image'].map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
            reviews.reviewImage = imgurl;
        }


        if (req.files['video']) {

            let vidurl = await Promise.all(
                req.files['video'].map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'video', format: 'mp4', eager_async: true, transformation: [{ width: 300, crop: 'limit', quality: 'auto' }] });
                    return result.secure_url;
                })
            );
            reviews.reviewVideo = vidurl;
        }

        product.reviews.push(reviews);
        await product.save();
        product = await product.populate('reviews.userId');
        console.log(product.reviews);
        return res.json({ success: true, message: product.reviews });
    }
    catch (er) {
        console.log(er.message);
        return res.json({ success: false, message: er.message });
    }
}

export const getReview = async (req, res) => {
    try {
        let { productId } = req.body;

        let product = await productModel.find({ _id: productId }).select('reviews').populate('reviews.userId');

        return res.json({ success: true, message: product })
    }
    catch (er) {
        return res.json({ success: false, message: er.message })
    }
}

export const getReviewById = async (req, res) => {
    try {
        let userId = req.user.id;

        if (!userId) return res.json({ success: false, message: 'you need to login first' });

        let order = await orderModel.find({ userId });

        let product = order.flatMap(item => item.Products);

        let productsId = product.map(item => item.productId);
        let filterProductId = productsId.filter(item => item != undefined);


        let findProducts = await productModel.find({
            _id: { $in: filterProductId }
        }).lean();

        let ans = findProducts
            .map(item => {
                const matchingReviews = item.reviews && Array.isArray(item.reviews)
                    ? item.reviews.filter(review => review.userId.equals(userId))
                    : [];

                if (matchingReviews.length > 0) {
                    return {
                        ...item,
                        reviews: matchingReviews
                    };
                }
                return null;
            })
            .filter(product => product !== null);

        return res.json({ success: true, message: ans });

    }
    catch (er) {
        return res.json({ success: false, message: er.message });
    }
}

export const editReview = async (req, res) => {

    try {

        let userId = req.user.id;
        let { rating, comment, productId, reviewImage, reviewVideo } = req.body;

        let product = await productModel.findOne({ _id: productId });
        reviewImage = reviewImage ? reviewImage.split(',') : [];
        reviewVideo = reviewVideo ? reviewVideo.split(',') : [];

        product.reviews = await Promise.all(product.reviews.map(async (item) => {

            if (item.userId == userId) {
                item.rating = rating;
                item.reviewText = comment;

                if (reviewImage.length < item.reviewImage.length) {
                    item.reviewImage = item.reviewImage.filter(url => reviewImage.includes(url));
                }

                if (reviewVideo.length < item.reviewVideo.length) {
                    item.reviewVideo = item.reviewVideo.filter(url => reviewVideo.includes(url));
                }

                if (req.files['image']) {
                    let imgUrl = await Promise.all(
                        req.files['image'].map(async (item) => {
                            let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                            return result.secure_url;
                        })
                    )

                    item.reviewImage.push(...imgUrl);
                }

                if (req.files['video']) {
                    let vidUrl = await Promise.all(
                        req.files['video'].map(async (item) => {
                            let result = await cloudinary.uploader.upload(item.path, { resource_type: 'video' });
                            return result.secure_url;
                        })
                    )
                    item.reviewVideo.push(...vidUrl);
                }
            }
            return item;
        }));

        await product.save();

        let order = await orderModel.find({ userId });

        let products = order.flatMap(item => item.Products);

        let productsId = products.map(item => item.productId);
        let filterProductId = productsId.filter(item => item != undefined);


        let findProducts = await productModel.find({
            _id: { $in: filterProductId }
        }).lean();


        let ans = findProducts
            .map(item => {
                const matchingReviews = item.reviews && Array.isArray(item.reviews)
                    ? item.reviews.filter(review => review.userId.equals(userId))
                    : [];

                if (matchingReviews.length > 0) {
                    return {
                        ...item,
                        reviews: matchingReviews
                    };
                }
                return null;
            })
            .filter(product => product !== null);

        return res.json({ success: true, message: ans });
    }
    catch (er) {
        return res.json({ success: false, message: er.message });
    }
}

export const deleteReview = async (req, res) => {

    try {

        let userId = req.user.id;

        let { productId } = req.body;

        let findProduct = await productModel.find({ _id: productId });

        findProduct[0].reviews = findProduct[0].reviews.filter(item => item.userId != userId);
        await findProduct[0].save();


        let order = await orderModel.find({ userId });

        let product = order.flatMap(item => item.Products);

        let productsId = product.map(item => item.productId);
        let filterProductId = productsId.filter(item => item != undefined);


        let findProducts = await productModel.find({
            _id: { $in: filterProductId }
        }).lean();



        let ans = findProducts
            .map(item => {
                const matchingReviews = item.reviews && Array.isArray(item.reviews)
                    ? item.reviews.filter(review => review.userId.equals(userId))
                    : [];

                if (matchingReviews.length > 0) {
                    return {
                        ...item,
                        reviews: matchingReviews
                    };
                }
                return null;
            })
            .filter(product => product !== null);

        return res.json({ success: true, message: ans });
    }
    catch (er) {
        return res.json({ success: false, message: er.message });
    }
}


export const allReviewsImages = async (req, res) => {
    try {
        let { productId } = req.body;
        let findProduct = await productModel.findOne({ _id: productId }).select('reviews').populate('reviews.userId');

        let allImages = findProduct.reviews.filter(item => item.reviewImage.length > 0).flatMap(items => [...items.reviewImage]);
        return res.json({ success: true, message: allImages, id: findProduct.reviews });
    }
    catch (er) {
        return res.json({ success: false, message: er.message });
    }
}

// ------------------------------------------------------------------
// for admin

export const AdminLogin = async (req, res) => {

    try {

        let { email, password } = req.body;
        if (email == process.env.SUPERADMIN_EMAIL && password == process.env.SUPERADMIN_PASSWORD) {
            let token = jwt.sign({ email: email }, process.env.JWT_SECRET);
            res.cookie('admin_token', token).json({ success: true, message: token, isSuperAdmin: true });
        }
        else {
            let isNormalAdmin = await userModel.findOne({ email });

            if (isNormalAdmin && isNormalAdmin.role == 'admin') {
                const match = await bcrypt.compare(password, isNormalAdmin.password);

                if (!match) return res.json({ success: false, message: 'invalid credentials' });
                let token = jwt.sign({ email: email }, process.env.JWT_SECRET);
                res.cookie('admin_token', token).json({ success: true, message: token, isSuperAdmin: false });
            }
            else {
                return res.json({ success: false, message: 'invalid credentials' });
            }
        }
    }
    catch (er) {
        return res.json({ message: er.message });
    }
}

export const getUser = async (req, res) => {
    try {
        let user = await userModel.find({});
        return res.json({ success: true, message: user });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const updateUser = async (req, res) => {

    const { _id, role } = req.body;
    const findUser = await userModel.findOne({ _id });

    if (findUser) {
        if (findUser.role == 'user' && role == 'admin') {
            findUser.role = role;
            await findUser.save();
            return res.json({ success: true, message: role })
        }
        else if (findUser.role == 'admin' && role == 'user') {
            findUser.role = role;
            await findUser.save();
            return res.json({ success: true, message: role })
        }
    }

}

export const deleteUser = async (req, res) => {
}

export const AdminLogout = (req, res) => {
    res.clearCookie('admin_token');
    return res.json({ success: true, message: 'Logout successfully' });
}

