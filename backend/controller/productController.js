import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';

// for admin only------

export const addProduct = async (req, res) => {
    try {
        const { productName, productPrice, productDesc, stock, category } = req.body;

        let imgurl = await Promise.all(
            req.files.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );


        let product = await productModel.create({
            productName,
            productPrice,
            productDesc,
            stock,
            category,
            productImagesurl: imgurl
        })

        return res.json({ success: true, message: 'add product successfully' });

    }
    catch (er) {
        return res.json({ success: false, message: er.message })
    }
}

export const listProduct = async (req, res) => {
    try {
        let productList = await productModel.find({});
        if (!productList.length) {
            return res.json({ success: false, message: productList })
        }
        return res.json({ success: true, message: productList });
    }
    catch (er) {
        return res.json({ success: false, message: er.message });
    }
}

export const removeProduct = async (req, res) => {
    try {
        let { _id } = req.body;
        let remove = await productModel.findByIdAndDelete({ _id });
        return res.json({ success: true, message: 'Product Deleted successfully' });

    } catch (er) {
        return res.json({ success: false, message: er.message });
    }
}

export const editProduct = async (req, res) => {
    try {
        let { productid, productname, productdesc, productstock, productcategory, productprice, productimages } = req.body;
         
        productimages=productimages.split(',');

        let product = await productModel.findOne({ _id: productid });

        product.productName=productname; 
        product.productDesc=productdesc; 
        product.productPrice=productprice; 
        product.stock=productstock; 
        product.category=productcategory;
        
        product.productImagesurl=productimages;
         
        if(req.files){
            let url=await Promise.all( 
                req.files.map(async(item)=>{
                let result=await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url;
             })
            )
            let val=product.productImagesurl;
            product.productImagesurl=[...val,...url];
        }

        await product.save();

        return res.json({ success: true, message: 'working' });
    }
    catch (er) {
        return res.json({ success: false, message: er.message });
    }
}
// ----------------


export const productById = async (req, res) => {
    const { _id } = req.body
    const product = await productModel.find({ _id });
    return res.json({ success: true, product: product });
}

export const getAllProduct = async (req, res) => {
    try {
        const product = await productModel.find({});
        return res.json({ success: true, message: product });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const showProduct = async (req, res) => {
    const products = await productModel.find();
    return res.json({ message: products });
}

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let userId = req.user.id;

        const user = await userModel.findOne({ _id: userId });

        const product = await productModel.findOne({ _id: productId });

        if (quantity > product.stock) {
            return res.json({ success: false, message: 'You Cannot add more than this quantity' });
        }

        let isInCart = user.cartData.length > 0 && user.cartData.find(item => item.productId.equals(productId));
        if (!isInCart) {
            user.cartData.push({ productId, quantity });
        }
        else {
            isInCart.quantity = quantity;
        }

        await user.save();
        return res.json({ success: true, message: 'Added Successfully' });
    } catch (er) {
        return res.json({ success: false, message: er.message });
    }

}

export const productByCategory = async (req, res) => {
    const { category } = req.body;
    let product;
    if (category) {
        product = await productModel.find({ category });
        return res.json({ success: true, message: product });
    }
    else {
        product = await productModel.find({});
        return res.json({ success: true, message: product });
    }

}

export const productByName = async (req, res) => {

    let { name } = req.body;
    if (name) {
        let products = await productModel.find({ productName: { $regex: name, $options: 'i' } });
        return res.json({ message: products });
    }
    else {
        return res.json({ message: '' });
    }
}





